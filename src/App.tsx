import { useState, createContext, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import Store from "./pages/Store";
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
  console.log("App is loading successfully");
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ? {
          id: session.user.id,
          email: session.user.email || '',
          roles: session.user.email?.includes("admin") ? ["admin", "cms_editor"] : ["client"]
        } : null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email || '',
        roles: session.user.email?.includes("admin") ? ["admin", "cms_editor"] : ["client"]
      } : null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const authValue: AuthContextType = {
    user,
    isAuthenticated: !!user && !!session,
    hasRole: (role: string) => user?.roles.includes(role) || false,
    login: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    logout: async () => {
      await supabase.auth.signOut();
    }
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
        <Route path="/store" element={<Store />} />
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