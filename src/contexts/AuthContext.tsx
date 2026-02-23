import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface UserProfile {
    name: string;
    email: string;
    favorites?: string[];
    createdAt?: string;
}

interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
    toggleFavorite: (placeId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    userProfile: null,
    loading: true,
    logout: async () => { },
    toggleFavorite: async () => { },
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
        <AuthContext.Provider value={{ currentUser, userProfile, loading, logout, toggleFavorite }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
