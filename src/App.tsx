import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SiloPage from "./pages/SiloPage";
import ExplorePage from "./pages/ExplorePage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buscar" element={<ExplorePage />} />
          <Route path="/lugar/:id" element={<PlaceDetailPage />} />
          <Route path="/mis-favoritos" element={<FavoritesPage />} />
          <Route path="/naturales" element={<SiloPage siloType="Natural" />} />
          <Route path="/culturales" element={<SiloPage siloType="Cultural" />} />
          <Route path="/historicos" element={<SiloPage siloType="Histórico" />} />
          <Route path="/recreativos" element={<SiloPage siloType="Recreativo" />} />
          <Route path="/urbanos" element={<SiloPage siloType="Urbano" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
