
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ListsPage from "./pages/ListsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          
          <Route path="/" element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/listas" element={<ListsPage />} />
            <Route path="/recomendacoes" element={<RecommendationsPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
