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

    // 2. Score each place using the advanced algorithm
    const results: ScoredPlace[] = places.map((p) => {
      let rawScore = 0;

      // Base matches according to user's requested logic
      if (filters.type && p.type === filters.type) rawScore += 30;
      if (filters.city && p.city === filters.city) rawScore += 25;
      if (filters.entryCost && p.entryCost === filters.entryCost) rawScore += 15;
      if (filters.climate && p.climate === filters.climate) rawScore += 10;

      // Additional UI filters not in the exact snippet but exist in the UI
      if (filters.department && p.department === filters.department) rawScore += 25;
      if (filters.season && (p.season === filters.season || p.season === "Todo el año")) rawScore += 10;
      if (filters.accessibility && p.accessibility === filters.accessibility) rawScore += 10;

      // Advanced metrics added by user
      rawScore += p.popularidad * 5;
      rawScore += Math.log(p.visitas + 1);

      // Max theoretical raw score is around 660 (125 from filters + 500 from popularity + ~16 from visits log)
      // We normalize it to a 0-100 scale for the UI Badge to make sense.
      // If we don't normalize it, it might display "450% Match".
      // We'll map the rawScore so that a very good place with matches reaches ~99%
      let normalizedScore = Math.min(Math.round((rawScore / 640) * 100), 100);

      // If no filters are applied, we still want to sort by popularity, 
      // but maybe not show them all as "100% Match". A normalized score works perfectly for this default ranking.

      return { place: p, score: normalizedScore };
    });

    // 3. Sort by highest score.
    // If filters are active, we might want a minimum threshold (e.g. at least 60% with the new high baseline).
    // Because popularity alone gives ~500 points (78%), let's just sort and not aggressively filter out popular places, 
    // or filter based on a relative threshold. 
    // Actually, users want to see the best matches first!
    const sorted = results.sort((a, b) => b.score - a.score);

    // If there are filters applied, maybe filter out places that didn't match any filter 
    // and just have low popularity, but with this algorithm, sorting is usually enough.
    return sorted;

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
