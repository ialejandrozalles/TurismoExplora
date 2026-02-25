import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { places } from "@/data/places";

interface UserProfile {
    name: string;
    email: string;
    favorites?: string[];
    createdAt?: string;
    // Algoritmo de recomendación
    viewedPlaces?: string[];
    typePreferences?: Record<string, number>;
    climatePreferences?: Record<string, number>;
    accessibilityPreferences?: Record<string, number>;
    entryCostPreferences?: Record<string, number>;
}

interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
    toggleFavorite: (placeId: string) => Promise<void>;
    recordViewAndUpdate: (placeId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    userProfile: null,
    loading: true,
    logout: async () => { },
    toggleFavorite: async () => { },
    recordViewAndUpdate: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch extended user profile from Firestore
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data() as UserProfile);
                    } else {
                        // Fallback if doc doesn't exist yet but auth does
                        setUserProfile({ name: user.displayName || "Usuario", email: user.email || "" });
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setUserProfile(null);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    /**
     * Registra la vista de un lugar EN Firestore y actualiza el estado local
     * de userProfile para que las recomendaciones sean inmediatas.
     */
    const recordViewAndUpdate = async (placeId: string) => {
        if (!currentUser || !userProfile) return;
        const place = places.find((p) => p.id === placeId);
        if (!place) return;

        // 1. Escribir en Firestore
        try {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                viewedPlaces: arrayUnion(placeId),
                [`typePreferences.${place.type}`]: increment(1),
                [`climatePreferences.${place.climate}`]: increment(1),
                [`accessibilityPreferences.${place.accessibility}`]: increment(1),
                [`entryCostPreferences.${place.entryCost}`]: increment(1),
            });
        } catch (error) {
            console.error("[recordViewAndUpdate] Error Firestore:", error);
        }

        // 2. Actualizar el estado local inmediatamente (sin re-fetch)
        setUserProfile((prev) => {
            if (!prev) return prev;
            const addOne = (record: Record<string, number> | undefined, key: string) => ({
                ...(record ?? {}),
                [key]: ((record ?? {})[key] ?? 0) + 1,
            });
            const viewed = prev.viewedPlaces ?? [];
            return {
                ...prev,
                viewedPlaces: viewed.includes(placeId) ? viewed : [...viewed, placeId],
                typePreferences: addOne(prev.typePreferences, place.type),
                climatePreferences: addOne(prev.climatePreferences, place.climate),
                accessibilityPreferences: addOne(prev.accessibilityPreferences, place.accessibility),
                entryCostPreferences: addOne(prev.entryCostPreferences, place.entryCost),
            };
        });
    };

    const toggleFavorite = async (placeId: string) => {
        if (!currentUser || !userProfile) return;

        const currentFavorites = userProfile.favorites || [];
        const isFavorite = currentFavorites.includes(placeId);

        let newFavorites: string[];
        if (isFavorite) {
            newFavorites = currentFavorites.filter(id => id !== placeId);
        } else {
            newFavorites = [...currentFavorites, placeId];
        }

        try {
            const docRef = doc(db, "users", currentUser.uid);
            await updateDoc(docRef, { favorites: newFavorites });
            setUserProfile({ ...userProfile, favorites: newFavorites });
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, userProfile, loading, logout, toggleFavorite, recordViewAndUpdate }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
