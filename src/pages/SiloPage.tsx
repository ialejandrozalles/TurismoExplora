import { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PlaceCard from "@/components/PlaceCard";
import { places } from "@/data/places";
import type { PlaceType } from "@/data/places";
import { Search, MapPin, TreePine, Landmark, Castle, Tent, Building2 } from "lucide-react";

interface Props {
    siloType: PlaceType;
}

const siloMeta: Record<PlaceType, { title: string; subtitle: string; icon: any; color: string; bg: string }> = {
    Natural: {
        title: "Naturaleza Salvaje",
        subtitle: "Desconecta de la rutina y reconecta con la tierra. Explora paisajes intocables, rutas de senderismo y maravillas geológicas.",
        icon: TreePine,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    Cultural: {
        title: "Inmersión Cultural",
        subtitle: "Vive las tradiciones locales, prueba la gastronomía auténtica y descubre el corazón de cada comunidad viva.",
        icon: Landmark,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    Histórico: {
        title: "Patrimonio Histórico",
        subtitle: "Viaja en el tiempo caminando por ruinas antiguas, templos milenarios y ciudades coloniales llenas de secretos.",
        icon: Castle,
        color: "text-rose-500",
        bg: "bg-rose-500/10"
    },
    Recreativo: {
        title: "Diversión y Recreación",
        subtitle: "Espacios diseñados para el disfrute en familia o con amigos. Parques dinámicos, áreas de picnic y actividades al aire libre.",
        icon: Tent,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10"
    },
    Urbano: {
        title: "Atractivos Urbanos",
        subtitle: "Siente el pulso de las grandes ciudades. Arte callejero, arquitectura moderna y paseos que te mostrarán la vida vibrante metropolitana.",
        icon: Building2,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    }
};

const SiloPage = ({ siloType }: Props) => {
    const meta = siloMeta[siloType];
    const Icon = meta.icon;

    const topPlaces = useMemo(() => {
        // Return top 6 places of this silo
        return places.filter(p => p.type === siloType).slice(0, 6);
    }, [siloType]);

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Silo Hero */}
            <section className="relative bg-secondary py-20 overflow-hidden">
                {/* Decorative background circle */}
                <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3 ${meta.bg}`} />

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
                    <div className={`inline-flex items-center justify-center p-4 rounded-2xl mb-6 ${meta.bg} ${meta.color} animate-fade-in`}>
                        <Icon className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        {meta.title}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground font-body max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        {meta.subtitle}
                    </p>
                    <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                        <Link
                            to={`/buscar?type=${siloType}`}
                            className="inline-flex items-center justify-center gap-2 rounded-full text-base font-medium ring-offset-background transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/25 h-14 px-8"
                        >
                            <Search className="w-5 h-5" />
                            Buscar destinos {siloType.toLowerCase()}s
                        </Link>
                    </div>
                </div>
            </section>

            {/* Top Destinations for this Silo */}
            <section className="py-20 md:py-24">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex items-center gap-3 mb-12">
                        <MapPin className={`w-8 h-8 ${meta.color}`} />
                        <h2 className="text-3xl font-display font-bold text-foreground">
                            Destinos Imperdibles
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topPlaces.map((p) => (
                            <PlaceCard key={p.id} place={p} />
                        ))}
                    </div>

                    {topPlaces.length === 0 && (
                        <div className="text-center py-20 bg-card rounded-2xl border border-border">
                            <p className="text-muted-foreground font-body text-lg">
                                Pronto agregaremos más destinos increíbles de tipo {siloType.toLowerCase()}.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <footer className="border-t border-border py-8 text-center bg-card">
                <p className="text-sm font-body text-muted-foreground">
                    © 2026 TurismoExplora — Diseñado para descubridores
                </p>
            </footer>
        </main>
    );
};

export default SiloPage;
