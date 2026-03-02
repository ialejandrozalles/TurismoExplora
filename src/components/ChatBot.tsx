import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { places } from "@/data/places";

// ─── Contexto del sistema ────────────────────────────────────────────────────
const buildSystemPrompt = () => {
    const placesList = places
        .map(
            (p) =>
                `- ${p.name} (${p.city}, ${p.department}): Tipo: ${p.type} | Clima: ${p.climate} | Temporada: ${p.season} | Costo: ${p.entryCost} | Accesibilidad: ${p.accessibility}. ${p.description}`
        )
        .join("\n");

    return `Eres el asistente virtual de TurismoExplora, una plataforma de turismo. Tu función es exclusivamente ayudar a los usuarios a descubrir destinos turísticos disponibles en la plataforma.

DESTINOS DISPONIBLES:
${placesList}

REGLAS — DEBES SEGUIRLAS SIN EXCEPCIÓN:
1. SOLO respondes sobre los destinos listados arriba y temas directamente relacionados con turismo (clima, temporadas, accesibilidad, consejos de viaje).
2. Ante cualquier mensaje ajeno al turismo (política, religión, matemáticas, programación, chistes, etc.) responde ÚNICAMENTE: "Solo puedo ayudarte con información sobre destinos turísticos en TurismoExplora. ¿Hay algún destino que te interese?"
3. No respondas preguntas sobre ti mismo, otros modelos de IA, ni sobre tecnología.
4. Responde siempre en español, con tono amigable y directo.
5. Basa tus recomendaciones en los atributos reales de los destinos: tipo, clima, temporada, costo y accesibilidad.
6. Nunca inventes destinos ni datos que no estén en la lista.
7. Respuestas cortas y útiles: máximo 3 párrafos. Sin listas interminables.`;
};

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface Message {
    role: "user" | "model";
    text: string;
}

// ─── API Groq ─────────────────────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// llama-3.3-70b-versatile: modelo estable de Groq, óptimo para comprensión
// contextual y seguimiento estricto de instrucciones en español.
const GROQ_MODEL = "llama-3.3-70b-versatile";

async function askGroq(history: Message[], userMessage: string): Promise<string> {
    // Groq usa formato OpenAI: role "assistant" en lugar de "model"
    const messages = [
        { role: "system", content: buildSystemPrompt() },
        ...history.map((m) => ({
            role: m.role === "model" ? "assistant" : "user",
            content: m.text,
        })),
        { role: "user", content: userMessage },
    ];

    const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages,
            temperature: 0.4,   // bajo para respuestas enfocadas y consistentes
            max_tokens: 512,
            stream: false,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`Groq API error ${response.status}: ${JSON.stringify(err)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "No pude generar una respuesta. Intenta de nuevo.";
}

// ─── Componente ───────────────────────────────────────────────────────────────
const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "model",
            text: "¡Hola! Soy tu asistente de TurismoExplora 🌍 ¿En qué puedo ayudarte? Puedo recomendarte destinos según tu clima favorito, presupuesto, temporada o tipo de aventura.",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll al último mensaje
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    // Focus input al abrir
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMsg: Message = { role: "user", text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // El historial que se manda excluye el mensaje de bienvenida inicial
            const history = messages.slice(1);
            const reply = await askGroq(history, text);
            setMessages((prev) => [...prev, { role: "model", text: reply }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "model", text: "Hubo un error al conectar con el asistente. Por favor, intenta de nuevo." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* ─── Panel del chat ─────────────────────────────────── */}
            <div
                className={`fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                    isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-4 pointer-events-none"
                }`}
                style={{ height: "480px" }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm leading-tight">Asistente TurismoExplora</p>
                        <p className="text-primary-foreground/70 text-xs font-body">Destinos turísticos · en línea</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 rounded-full hover:bg-primary-foreground/20 transition-colors"
                        aria-label="Cerrar chat"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {/* Avatar */}
                            <div
                                className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs ${
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-accent text-accent-foreground"
                                }`}
                            >
                                {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                            </div>
                            {/* Bubble */}
                            <div
                                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm font-body leading-relaxed whitespace-pre-wrap ${
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-sm"
                                        : "bg-secondary text-secondary-foreground rounded-bl-sm"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {loading && (
                        <div className="flex items-end gap-2">
                            <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground shrink-0 flex items-center justify-center">
                                <Bot className="w-3.5 h-3.5" />
                            </div>
                            <div className="bg-secondary text-secondary-foreground px-3 py-2 rounded-2xl rounded-bl-sm">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-border shrink-0 flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Pregunta sobre un destino..."
                        disabled={loading}
                        className="flex-1 text-sm font-body bg-background border border-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 placeholder:text-muted-foreground/60"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        aria-label="Enviar"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ─── Botón flotante ─────────────────────────────────── */}
            <button
                onClick={() => setIsOpen((v) => !v)}
                className={`fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
                    isOpen
                        ? "bg-muted-foreground text-background"
                        : "bg-primary text-primary-foreground"
                }`}
                aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente"}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </>
    );
};

export default ChatBot;
