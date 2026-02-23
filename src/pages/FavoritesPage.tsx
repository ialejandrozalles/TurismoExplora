import { Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import PlaceCard from "@/components/PlaceCard";
import { useAuth } from "@/contexts/AuthContext";
import { places } from "@/data/places";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FavoritesPage = () => {
    const { userProfile, currentUser } = useAuth();

    // If there's no user, show a fallback (although this route should theoretically be protected)
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
                    <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                    <h1 className="text-3xl font-display font-bold text-foreground mb-4">Inicia sesión para ver tus favoritos</h1>
                    <p className="text-muted-foreground font-body max-w-md mx-auto mb-8">
                        Necesitas una cuenta para poder guardar y acceder a tus lugares turísticos preferidos.
                    </p>
                    <Link to="/">
                        <Button>Volver al inicio</Button>
                    </Link>
                </main>
            </div>
        );
    }

    const favoriteIds = userProfile?.favorites || [];
    const favoritePlaces = places.filter(place => favoriteIds.includes(place.id));

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
                <div className="mb-10">
                    <h1 className="text-4xl font-display font-bold text-foreground flex items-center gap-3">
                        <Heart className="w-8 h-8 text-primary" fill="currentColor" />
                        Mis Favoritos
                    </h1>
                    <p className="text-muted-foreground font-body mt-2 text-lg">
                        Lugares que has guardado para tu próxima aventura.
                    </p>
                </div>

                {favoritePlaces.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favoritePlaces.map((place) => (
                            <PlaceCard key={place.id} place={place} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
                        <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                        <h2 className="text-2xl font-display font-semibold text-foreground mb-2">Aún no tienes favoritos</h2>
                        <p className="text-muted-foreground font-body max-w-sm mx-auto mb-6">
                            Explora nuestros destinos y haz clic en el corazón para guardarlos aquí.
                        </p>
                        <Link to="/buscar">
                            <Button variant="outline">Explorar lugares</Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FavoritesPage;
