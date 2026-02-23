import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, User, Mail, Lock, Loader2 } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

export function AuthModal({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Auth Profile
            await updateProfile(user, { displayName: name });

            // 3. Create User Profile in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                createdAt: new Date().toISOString(),
            });

            toast({
                title: "¡Bienvenido a TurismoExplora!",
                description: "Tu cuenta ha sido creada exitosamente.",
            });
            setIsOpen(false);
        } catch (error: any) {
            console.error("Registration error:", error);
            toast({
                variant: "destructive",
                title: "Error al registrarse",
                description: error.message || "Por favor, verifica tus datos e intenta nuevamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({
                title: "¡Qué bueno verte de nuevo!",
                description: "Has iniciado sesión exitosamente.",
            });
            setIsOpen(false);
        } catch (error: any) {
            console.error("Login error:", error);
            toast({
                variant: "destructive",
                title: "Credenciales inválidas",
                description: "El correo o la contraseña son incorrectos.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-card border-border">
                <div className="bg-primary/5 p-6 pb-4 flex flex-col items-center justify-center text-center border-b border-border/50">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-display font-bold text-foreground">TurismoExplora</DialogTitle>
                    <DialogDescription className="font-body text-muted-foreground mt-1">
                        Descubre, explora y guarda tus lugares favoritos.
                    </DialogDescription>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 rounded-none border-b border-border h-12 bg-transparent p-0">
                        <TabsTrigger
                            value="login"
                            className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none font-body"
                        >
                            Iniciar Sesión
                        </TabsTrigger>
                        <TabsTrigger
                            value="register"
                            className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none font-body"
                        >
                            Crear Cuenta
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="p-6 pt-4 m-0">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Correo Electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="login-email" name="email" type="email" placeholder="tu@correo.com" className="pl-9" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="login-password" name="password" type="password" className="pl-9" required />
                                </div>
                            </div>
                            <Button type="submit" className="w-full font-body font-semibold mt-6" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Acceder a mi cuenta
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="register" className="p-6 pt-4 m-0">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="register-name">Nombre Completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="register-name" name="name" placeholder="Ej. Juan Pérez" className="pl-9" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="register-email">Correo Electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="register-email" name="email" type="email" placeholder="tu@correo.com" className="pl-9" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="register-password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="register-password" name="password" type="password" className="pl-9" required minLength={6} />
                                </div>
                                <p className="text-xs text-muted-foreground">Mínimo 6 caracteres.</p>
                            </div>
                            <Button type="submit" className="w-full font-body font-semibold mt-4" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Crear Perfil
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
