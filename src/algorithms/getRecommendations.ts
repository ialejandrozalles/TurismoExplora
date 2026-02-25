import { places, TouristPlace } from "@/data/places";

export interface RecommendedPlace {
    place: TouristPlace;
    score: number;
}

/** Subconjunto del perfil del usuario relevante para el algoritmo */
export interface UserPreferences {
    favorites?: string[];
    viewedPlaces?: string[];
    typePreferences?: Record<string, number>;
    climatePreferences?: Record<string, number>;
    accessibilityPreferences?: Record<string, number>;
    entryCostPreferences?: Record<string, number>;
}

/**
 * Calcula el score de un destino según las preferencias del usuario.
 *
 * Fórmula:
 *   score = (typePreferences[type]         × 3)
 *         + (climatePreferences[climate]   × 2)
 *         + (entryCostPreferences[cost]    × 2)
 *         + (accessibilityPreferences[a]   × 1)
 *         + 20  si algún favorito tiene el mismo tipo
 *         + 5   si algún lugar visto tiene el mismo tipo
 *
 * Favoritos y vistos son SEÑALES de preferencia, no exclusiones.
 */
function scorePlace(place: TouristPlace, prefs: UserPreferences): number {
    const typeScore = (prefs.typePreferences?.[place.type]                 ?? 0) * 3;
    const climScore = (prefs.climatePreferences?.[place.climate]           ?? 0) * 2;
    const costScore = (prefs.entryCostPreferences?.[place.entryCost]       ?? 0) * 2;
    const accScore  = (prefs.accessibilityPreferences?.[place.accessibility] ?? 0) * 1;

    // Bonus favoritos: +20 si algún favorito comparte tipo con este destino
    const favoritedPlaces = places.filter(p => (prefs.favorites ?? []).includes(p.id));
    const favBonus = favoritedPlaces.some(p => p.type === place.type) ? 20 : 0;

    // Bonus vistas: +5 si algún lugar visto comparte tipo con este destino
    const viewedPlacesList = places.filter(p => (prefs.viewedPlaces ?? []).includes(p.id));
    const viewBonus = viewedPlacesList.some(p => p.type === place.type) ? 5 : 0;

    return typeScore + climScore + costScore + accScore + favBonus + viewBonus;
}

/**
 * Devuelve hasta `limit` lugares recomendados ordenados por score descendente.
 *
 * - NO excluye favoritos ni vistos (son señales de preferencia)
 * - Solo excluye `excludeId` (el lugar actual que el usuario está viendo)
 * - `excludeViewed` (default: false) si es true evita mostrar ya visitados
 * - Devuelve [] si no hay ninguna interacción aún (cold start)
 */
export function getRecommendations(
    prefs: UserPreferences,
    limit: number = 3,
    excludeId?: string,
    excludeViewed: boolean = false,
): RecommendedPlace[] {
    // Cold start: sin interacciones todavía
    const hasInteractions =
        Object.values(prefs.typePreferences ?? {}).some(v => v > 0) ||
        Object.values(prefs.climatePreferences ?? {}).some(v => v > 0) ||
        (prefs.favorites ?? []).length > 0;

    if (!hasInteractions) return [];

    return places
        .filter(p => p.id !== excludeId)          // excluir el lugar actual
        .map(p => ({ place: p, score: scorePlace(p, prefs) }))
        .filter(r => {
            if (r.score <= 0) return false;
            if (excludeViewed && (prefs.viewedPlaces ?? []).includes(r.place.id)) return false;
            return true;
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}


