import { Link, useLocation } from "react-router-dom";
import { Trees, Landmark, Clock, Palmtree, Building2, LayoutGrid, MapPin, User, LogOut, Heart } from "lucide-react";
import type { PlaceType } from "@/data/places";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const siloItems: { label: string; path: string; type: PlaceType | "all"; icon: React.ReactNode }[] = [
  { label: "Todos", path: "/", type: "all", icon: <LayoutGrid className="w-4 h-4" /> },
  { label: "Naturales", path: "/naturales", type: "Natural", icon: <Trees className="w-4 h-4" /> },
  { label: "Culturales", path: "/culturales", type: "Cultural", icon: <Landmark className="w-4 h-4" /> },
  { label: "Históricos", path: "/historicos", type: "Histórico", icon: <Clock className="w-4 h-4" /> },
  { label: "Recreativos", path: "/recreativos", type: "Recreativo", icon: <Palmtree className="w-4 h-4" /> },
  { label: "Urbanos", path: "/urbanos", type: "Urbano", icon: <Building2 className="w-4 h-4" /> },
];

const Navbar = () => {
  const location = useLocation();
  const { currentUser, userProfile, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-accent" />
            <span className="font-display font-bold text-lg text-foreground">TurismoExplora</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 mr-2">
              {siloItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body font-medium transition-colors ${isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 outline-none rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Avatar className="h-10 w-10 border border-border shadow-sm transition-transform hover:scale-105">
                      <AvatarFallback className="bg-primary/10 text-primary font-display font-bold">
                        {userProfile?.name ? getInitials(userProfile.name) : <User className="w-5 h-5" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none font-display">{userProfile?.name || "Usuario"}</p>
                      <p className="text-xs leading-none text-muted-foreground font-body">
                        {userProfile?.email || currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/mis-favoritos" className="w-full cursor-pointer flex items-center">
                      <Heart className="mr-2 h-4 w-4 text-primary" />
                      <span>Mis Favoritos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthModal>
                <Button variant="default" size="sm" className="font-body font-medium shadow-sm hover:shadow-md transition-all">
                  <User className="w-4 h-4 mr-2" />
                  Acceder
                </Button>
              </AuthModal>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden gap-1 pb-3 overflow-x-auto scrollbar-none border-t border-border/50 pt-2 mt-1">
          {siloItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-body font-medium whitespace-nowrap transition-colors ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
