
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAnalytics } from "./hooks/useAnalytics";
import Index from "./pages/Index";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import ClientPortal from "./pages/ClientPortal";
import CMS from "./pages/CMS";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppWithAnalytics = () => {
  useAnalytics(); // Initialize analytics tracking
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/client-portal" element={<ClientPortal />} />
      <Route path="/cms" element={<CMS />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/auth" element={<Auth />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithAnalytics />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
