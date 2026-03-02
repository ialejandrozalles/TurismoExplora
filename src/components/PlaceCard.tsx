import { MapPin, Thermometer, Calendar, DollarSign, ShieldCheck, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { TouristPlace } from "@/data/places";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  place: TouristPlace;
  matchScore?: number;
}

const typeBadgeColor: Record<string, string> = {
  Natural: "bg-primary text-primary-foreground",
  Cultural: "bg-accent text-accent-foreground",
  Histórico: "bg-earth text-earth-foreground",
  Recreativo: "bg-forest-light text-primary-foreground",
  Urbano: "bg-secondary text-secondary-foreground",
};

const PlaceCard = ({ place, matchScore }: Props) => {
  const { currentUser, userProfile, toggleFavorite } = useAuth();
  const isFavorite = userProfile?.favorites?.includes(place.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return;
    await toggleFavorite(place.id);
  };

  return (
    <Link to={`/lugar/${place.id}`} className="block">
      <div className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-up h-full flex flex-col">
        <div className="relative h-52 shrink-0 overflow-hidden">
          <img
            src={place.image}
            alt={place.name}
            width={600}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Smart Match Score Badge */}
          {matchScore !== undefined && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-md text-primary px-4 py-2 rounded-full text-sm font-bold font-display flex items-center gap-2 shadow-xl border border-primary/20 animate-fade-in opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="w-4 h-4" />
              {matchScore}% Match
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
            <span className={`${typeBadgeColor[place.type]} text-xs font-body font-semibold px-2.5 py-1 rounded-md shadow-sm`}>
              {place.type}
            </span>
            <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-md shadow-sm ${place.entryCost === "Gratuito" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}>
              {place.entryCost}
            </span>
          </div>

          {currentUser && (
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-110 ${isFavorite
                  ? "bg-primary/90 text-primary-foreground"
                  : "bg-background/80 text-muted-foreground hover:bg-background/90 hover:text-primary"
                  }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
              </button>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
          <div>
            <h3 className="text-xl font-display font-bold text-foreground leading-tight mb-2">
              {place.name}
            </h3>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm font-body">
                {place.city}, {place.department}
              </span>
            </div>
            <p className="text-sm font-body text-muted-foreground leading-relaxed line-clamp-2">
              {place.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 pt-4 mt-auto border-t border-border text-xs font-body text-muted-foreground">
            <div className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-primary" />
              {place.climate}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {place.season}
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              {place.accessibility.toLowerCase()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
