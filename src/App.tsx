import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useOptimizedAnalytics } from "./hooks/useOptimizedAnalytics";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import ClientPortal from "./pages/ClientPortal";
import Store from "./pages/Store";
import CMS from "./pages/CMS";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import { CheckoutPage } from "./pages/Checkout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { LazyLogoParticles } from "./components/LazyWrapper";
import PerformanceMonitor from "./components/PerformanceMonitor";

const queryClient = new QueryClient();

const AppWithAnalytics = () => {
  console.log("App is loading successfully");
  
  useOptimizedAnalytics(); // Initialize analytics tracking
  
  return (
    <>
      <LazyLogoParticles />
      <PerformanceMonitor />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/store" element={<Store />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRoles={['admin']}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/client-portal" element={
          <ProtectedRoute>
            <ClientPortal />
          </ProtectedRoute>
        } />
        <Route path="/cms" element={
          <ProtectedRoute requiredRoles={['admin', 'cms_editor']}>
            <CMS />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppWithAnalytics />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;