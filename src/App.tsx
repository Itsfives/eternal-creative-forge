import { useState, createContext, useContext } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAnalytics } from "./hooks/useAnalytics";
import Index from "./pages/Index";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import ClientPortal from "./pages/ClientPortal";
import CMS from "./pages/CMS";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import LogoParticles from "./components/LogoParticles";

const queryClient = new QueryClient();

// Mock authentication and roles context
interface User {
  id: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { isAuthenticated, hasRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Auth />;
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    return <NotFound />;
  }
  
  return <>{children}</>;
};

const AppWithAnalytics = () => {
  // Add console log to verify app is loading
  console.log("App is loading successfully");
  
  const [user, setUser] = useState<User | null>({
    id: "admin-1",
    email: "admin@example.com",
    roles: ["admin", "cms_editor"] // Mock admin user for testing
  });

  const authValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    hasRole: (role: string) => user?.roles.includes(role) || false,
    login: (email: string, password: string) => {
      // Mock login - in real app, this would authenticate with Supabase
      setUser({
        id: "user-1",
        email,
        roles: email.includes("admin") ? ["admin", "cms_editor"] : ["client"]
      });
    },
    logout: () => setUser(null)
  };

  useAnalytics(); // Initialize analytics tracking
  
  return (
    <AuthContext.Provider value={authValue}>
      <LogoParticles />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/client-portal" element={
          <ProtectedRoute>
            <ClientPortal />
          </ProtectedRoute>
        } />
        <Route path="/cms" element={
          <ProtectedRoute requiredRole="cms_editor">
            <CMS />
          </ProtectedRoute>
        } />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthContext.Provider>
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