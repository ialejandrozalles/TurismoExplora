import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { ArrowLeft, MapPin, Thermometer, Calendar, DollarSign, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import { places } from "@/data/places";
import { Button } from "@/components/ui/button";
import PlaceCard from "@/components/PlaceCard";
import { useAuth } from "@/contexts/AuthContext";
import { getRecommendations } from "@/algorithms/getRecommendations";

const PlaceDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser, userProfile, recordViewAndUpdate } = useAuth();

    // Registrar vista + actualizar estado local para recomendaciones inmediatas
    useEffect(() => {
        if (currentUser && id) {
            recordViewAndUpdate(id);
        }
    }, [currentUser, id]);

    const place = places.find(p => p.id === id);

    // Recomendaciones personalizadas — excluye el lugar actual y los ya visitados
    const personalizedRecs = useMemo(() => {
        if (!currentUser || !userProfile) return [];
        return getRecommendations(userProfile, 3, id, true);
    }, [currentUser, userProfile, id]);

    // Lugares similares por tipo (siempre visible, excluye el actual)
    const similarPlaces = useMemo(() => {
        if (!place) return [];
        return places.filter(p => p.type === place.type && p.id !== place.id).slice(0, 3);
    }, [place]);

    // Decide qué sección mostrar
    const showPersonalized = personalizedRecs.length > 0;
    const showSimilar = !showPersonalized && similarPlaces.length > 0;

    if (!place) {
        return (
            <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-display font-bold text-foreground mb-4">Lugar no encontrado</h1>
                <p className="text-muted-foreground font-body mb-8">El destino turístico que buscas no existe o ha sido removido.</p>
                <Button onClick={() => navigate(-1)} variant="default">Volver atrás</Button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Image Section */}
            <section className="relative h-[60vh] min-h-[400px] w-full bg-muted">
                <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Top-left back button */}
                <div className="absolute top-6 left-4 md:left-8 z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 bg-background/20 hover:bg-background/40 backdrop-blur-md text-white px-4 py-2 rounded-full transition-colors font-body text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </button>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                    <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
                        <span className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-display font-semibold px-3 py-1 rounded-md shadow-sm">
                            {place.type}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-display font-bold drop-shadow-lg">
                            {place.name}
                        </h1>
                        <div className="flex items-center gap-2 text-white/90 font-body text-lg md:text-xl">
                            <MapPin className="w-5 h-5 text-accent" />
                            {place.city}, {place.department}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-8 animate-fade-up">
                        <div>
                            <h2 className="text-2xl font-display font-bold text-foreground mb-4">Acerca de {place.name}</h2>
                            <p className="text-muted-foreground font-body leading-relaxed text-lg">
                                {place.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm h-fit space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <h3 className="text-xl font-display font-bold text-foreground border-b border-border pb-4">
                            Información Práctica
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Thermometer className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-body">Clima Preferente</p>
                                    <p className="font-semibold text-foreground font-body">{place.climate}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                    <Calendar className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-body">Temporada Ideal</p>
                                    <p className="font-semibold text-foreground font-body">{place.season}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-earth/10 flex items-center justify-center shrink-0">
                                    <DollarSign className="w-5 h-5 text-earth" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-body">Costo de Ingreso</p>
                                    <p className="font-semibold text-foreground font-body">{place.entryCost}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-body">Nivel de Accesibilidad</p>
                                    <p className="font-semibold text-foreground font-body">{place.accessibility}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ─── Sección de Recomendaciones ─── */}
            {(showPersonalized || showSimilar) && (
                <section className="py-14 bg-secondary/30 border-t border-border">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        {showPersonalized ? (
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                                    Recomendados para ti
                                </h2>
                                <p className="text-muted-foreground font-body mt-1">
                                    Basado en los destinos que has explorado.
                                </p>
                            </div>
                        ) : (
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                                    Lugares similares
                                </h2>
                                <p className="text-muted-foreground font-body mt-1">
                                    Otros destinos {place.type.toLowerCase()}s que podrían interesarte.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {showPersonalized
                                ? personalizedRecs.map(({ place: rec }) => (
                                    <PlaceCard key={rec.id} place={rec} />
                                ))
                                : similarPlaces.map((p) => (
                                    <PlaceCard key={p.id} place={p} />
                                ))
                            }
                        </div>
                    </div>
                </section>
            )}

            <footer className="border-t border-border py-8 text-center bg-card">
                <p className="text-sm font-body text-muted-foreground">
                    © 2026 TurismoExplora — Diseñado para descubridores
                </p>
            </footer>
        </main>
    );
};

export default PlaceDetailPage;
