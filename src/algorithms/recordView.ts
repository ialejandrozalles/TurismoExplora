import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { places } from "@/data/places";

/**
 * Registra la visita de un usuario a un lugar turístico.
 * Actualiza en Firestore: viewedPlaces, typePreferences,
 * climatePreferences, accessibilityPreferences, entryCostPreferences.
 */
export async function recordView(userId: string, placeId: string): Promise<void> {
    const place = places.find((p) => p.id === placeId);
    if (!place) return;

    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            viewedPlaces: arrayUnion(placeId),
            [`typePreferences.${place.type}`]: increment(1),
            [`climatePreferences.${place.climate}`]: increment(1),
            [`accessibilityPreferences.${place.accessibility}`]: increment(1),
            [`entryCostPreferences.${place.entryCost}`]: increment(1),
        });
    } catch (error) {
        console.error("[recordView] Error al registrar vista:", error);
    }
}
