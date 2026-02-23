import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PlaceCard from "@/components/PlaceCard";
import { places } from "@/data/places";
import { TreePine, Landmark, Castle, Tent, Building2 } from "lucide-react";

export const SILOS = [
    {
        id: "Natural",
        title: "Naturaleza Salvaje",
        description: "Montañas, lagos y paisajes que te quitarán el aliento.",
        icon: TreePine,
        path: "/naturales",
        color: "bg-emerald-500/10 text-emerald-600",
        hoverColor: "hover:bg-emerald-500 hover:text-white"
    },
    {
        id: "Cultural",
        title: "Inmersión Cultural",
        description: "Tradiciones, gastronomía y el calor de nuestra gente.",
        icon: Landmark,
        path: "/culturales",
        color: "bg-amber-500/10 text-amber-600",
        hoverColor: "hover:bg-amber-500 hover:text-white"
    },
    {
        id: "Histórico",
        title: "Patrimonio Histórico",
        description: "Ruinas y ciudades coloniales que cuentan nuestra historia.",
        icon: Castle,
        path: "/historicos",
        color: "bg-rose-500/10 text-rose-600",
        hoverColor: "hover:bg-rose-500 hover:text-white"
    },
    {
        id: "Recreativo",
        title: "Zonas Recreativas",
        description: "Parques y espacios perfectos para disfrutar en familia.",
        icon: Tent,
        path: "/recreativos",
        color: "bg-indigo-500/10 text-indigo-600",
        hoverColor: "hover:bg-indigo-500 hover:text-white"
    },
    {
        id: "Urbano",
        title: "Vida Urbana",
        description: "El ritmo trepidante y la energía de nuestras metrópolis.",
        icon: Building2,
        path: "/urbanos",
        color: "bg-blue-500/10 text-blue-600",
        hoverColor: "hover:bg-blue-500 hover:text-white"
    }
];

const HomePage = () => {
    // Let's get top 3 featured places (just grabbing first 3 for now, can be customized)
    const featuredPlaces = places.slice(0, 3);

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <HeroSection onScrollToSearch={() => {
                // We will navigate to the search page or scroll down if search is implemented
                document.getElementById("silos-section")?.scrollIntoView({ behavior: "smooth" });
            }} />

            {/* Silos Section */}
            <section id="silos-section" className="py-20 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                            ¿Qué tipo de aventura buscas?
                        </h2>
                        <p className="text-muted-foreground font-body max-w-2xl mx-auto text-lg">
                            Explora nuestros destinos agrupados por experiencias. Ya sea que busques
                            relajarte en la naturaleza o sumergirte en la historia.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SILOS.map((silo, i) => {
                            const Icon = silo.icon;
                            return (
                                <Link
                                    key={silo.id}
                                    to={silo.path}
                                    className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${silo.color} ${silo.hoverColor}`}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {silo.title}
                                    </h3>
                                    <p className="text-muted-foreground font-body text-sm">
                                        {silo.description}
                                    </p>
                                    <div className="mt-6 flex items-center text-sm font-semibold text-primary">
                                        Explorar {silo.id.toLowerCase()}s <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Destinations */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                                Destinos Destacados
                            </h2>
                            <p className="text-muted-foreground font-body max-w-xl">
                                Los lugares más increíbles y populares recomendados por nuestra comunidad de viajeros.
                            </p>
                        </div>
                        <Link to="/buscar" className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                            Ver todos los destinos
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredPlaces.map((p) => (
                            <PlaceCard key={p.id} place={p} />
                        ))}
                    </div>

                    <div className="mt-10 text-center md:hidden">
                        <Link to="/buscar" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                            Ver todos los destinos
                        </Link>
                    </div>
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

export default HomePage;
