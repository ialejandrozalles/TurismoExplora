import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchFilters, { type Filters } from "@/components/SearchFilters";
import PlaceCard from "@/components/PlaceCard";
import Navbar from "@/components/Navbar";
import { places } from "@/data/places";
import type { PlaceType } from "@/data/places";
import { SearchX, Sparkles, MapPin } from "lucide-react";

export interface ScoredPlace {
  place: typeof places[0];
  score: number;
}

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type") as PlaceType | null;

  const [filters, setFilters] = useState<Filters>({
    department: "",
    city: "",
    type: typeParam || "",
    entryCost: "",
    season: "",
    climate: "",
    accessibility: "",
  });

  // Update internal filters if URL changes (e.g. user clicked from SiloPage)
  useEffect(() => {
    if (typeParam && typeParam !== filters.type) {
      setFilters(prev => ({ ...prev, type: typeParam }));
    }
  }, [typeParam]);

  // SMART SEARCH: Matching Algorithm (Scoring System)
  const scoredPlaces = useMemo(() => {
    // 1. Calculate how many filters the user actually applied
    const activeFilters = Object.values(filters).filter(value => value !== "");
    const totalFiltersApplied = activeFilters.length;

    // If no filters applied, return all places with 100% score
    if (totalFiltersApplied === 0) {
      return places.map(p => ({ place: p, score: 100 }));
    }

    // 2. Score each place
    const results: ScoredPlace[] = places.map((p) => {
      let matches = 0;
      let score = 0;

      // Location filters are strict overrides (if wrong city, score is 0)
      // because if someone searches entirely in a different city, it shouldn't show up as a "match" usually.
      // But for a true "smart" search, let's just make them heavy weights instead of hard filters.
      const WEIGHTS = {
        department: 30,
        city: 30,
        type: 15,
        climate: 10,
        season: 5,
        entryCost: 5,
        accessibility: 5
      };

      let maxPossibleScore = 0;

      if (filters.department) {
        maxPossibleScore += WEIGHTS.department;
        if (p.department === filters.department) matches += WEIGHTS.department;
      }
      if (filters.city) {
        maxPossibleScore += WEIGHTS.city;
        if (p.city === filters.city) matches += WEIGHTS.city;
      }
      if (filters.type) {
        maxPossibleScore += WEIGHTS.type;
        if (p.type === filters.type) matches += WEIGHTS.type;
      }
      if (filters.climate) {
        maxPossibleScore += WEIGHTS.climate;
        if (p.climate === filters.climate) matches += WEIGHTS.climate;
      }
      if (filters.season) {
        maxPossibleScore += WEIGHTS.season;
        if (p.season === filters.season || p.season === "Todo el año") matches += WEIGHTS.season; // "Todo el año" matches anything
      }
      if (filters.entryCost) {
        maxPossibleScore += WEIGHTS.entryCost;
        if (p.entryCost === filters.entryCost) matches += WEIGHTS.entryCost;
        if (filters.entryCost === "Pago" && p.entryCost === "Gratuito") matches += WEIGHTS.entryCost * 0.5; // Free is partially acceptable if they are willing to pay, but not vice versa
      }
      if (filters.accessibility) {
        maxPossibleScore += WEIGHTS.accessibility;
        if (p.accessibility === filters.accessibility) matches += WEIGHTS.accessibility;
        if (filters.accessibility === "Baja" && (p.accessibility === "Media" || p.accessibility === "Alta")) matches += WEIGHTS.accessibility; // If I accept low access, high access is also good
        if (filters.accessibility === "Media" && p.accessibility === "Alta") matches += WEIGHTS.accessibility;
      }

      // Calculate percentage, maxing at 100%
      score = maxPossibleScore > 0 ? Math.round((matches / maxPossibleScore) * 100) : 100;

      return { place: p, score };
    });

    // 3. Filter minimum threshold (e.g. must be at least 40% match) and Sort by highest score
    return results
      .filter(r => r.score >= 40)
      .sort((a, b) => b.score - a.score);

  }, [filters]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-secondary/50 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> Búsqueda Inteligente
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3">
            Encuentra tu Match Ideal
          </h1>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Dinos qué buscas y nuestro algoritmo encontrará los destinos con mayor porcentaje de afinidad para ti.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14 space-y-8">
        <SearchFilters filters={filters} onChange={setFilters} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-display font-bold text-foreground">
              {scoredPlaces.length} lugar{scoredPlaces.length !== 1 ? "es" : ""} compatible{scoredPlaces.length !== 1 ? "s" : ""}
            </h2>
          </div>
          {activeFilterCount > 0 && (
            <span className="text-sm font-body text-muted-foreground">
              {activeFilterCount} preferencia{activeFilterCount !== 1 ? "s" : ""} activa{activeFilterCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {scoredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scoredPlaces.map(({ place, score }) => (
              <PlaceCard key={place.id} place={place} matchScore={activeFilterCount > 0 ? score : undefined} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in bg-card rounded-2xl border border-border">
            <SearchX className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">
              No hemos encontrado un buen Match
            </h3>
            <p className="text-muted-foreground font-body max-w-md">
              Tus preferencias son muy específicas y no encontramos lugares con al menos un 40% de afinidad. Intenta relajar algunos filtros.
            </p>
          </div>
        )}
      </div>

      <footer className="border-t border-border py-8 text-center bg-card">
        <p className="text-sm font-body text-muted-foreground">
          © 2026 TurismoExplora — Plataforma informativa de lugares turísticos
        </p>
      </footer>
    </main>
  );
};

export default ExplorePage;
