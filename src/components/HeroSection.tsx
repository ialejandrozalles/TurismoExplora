import heroBg from "@/assets/hero-bg.jpg";
import { MapPin } from "lucide-react";

const HeroSection = ({ onScrollToSearch }: { onScrollToSearch: () => void }) => {
  return (
    <section className="relative h-[65vh] min-h-[450px] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="Paisaje montañoso al atardecer"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/30 to-background" />
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-up">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPin className="w-7 h-7 text-accent" />
          <span className="text-accent font-body font-semibold tracking-widest uppercase text-sm">
            Lugares Turísticos
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-4 leading-tight">
          Encuentra tu próximo{" "}
          <span className="text-accent">destino</span>
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 font-body font-light mb-8 max-w-xl mx-auto">
          Explora sitios naturales, culturales, históricos, recreativos y urbanos con nuestro buscador de filtros inteligentes.
        </p>
        <button
          onClick={onScrollToSearch}
          className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-body font-semibold text-lg hover:brightness-110 transition-all shadow-lg hover:shadow-xl"
        >
          Explorar lugares
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
