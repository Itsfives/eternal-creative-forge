import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

// Define the available app roles
export type AppRole = 'admin' | 'cms_editor' | 'client';

// Auth context type
interface AuthContextType {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: AppRole | string) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
  isAdmin: () => boolean;
  isCmsEditor: () => boolean;
  refreshRoles: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to manage auth state
const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserRoles = async (userId: string): Promise<AppRole[]> => {
    try {
      const { data, error } = await supabase.rpc('get_user_roles', {
        _user_id: userId
      });
      
      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
      return [];
    }
  };

  const refreshRoles = async () => {
    if (user) {
      const userRoles = await fetchUserRoles(user.id);
      setRoles(userRoles);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.email);
        
        // SYNCHRONOUS state updates only
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        // Defer role fetching to prevent blocking the auth state change
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserRoles(currentSession.user.id).then(userRoles => {
              setRoles(userRoles);
            });
          }, 0);
        } else {
          setRoles([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log('Initial session check:', existingSession?.user?.email);
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      setLoading(false);
      
      if (existingSession?.user) {
        setTimeout(() => {
          fetchUserRoles(existingSession.user.id).then(userRoles => {
            setRoles(userRoles);
          });
        }, 0);
      } else {
        setRoles([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    roles,
    loading,
    isAuthenticated: !!user && !!session,
    hasRole: (role: AppRole | string) => roles.includes(role as AppRole),
    hasAnyRole: (targetRoles: AppRole[]) => targetRoles.some(role => roles.includes(role)),
    isAdmin: () => roles.includes('admin'),
    isCmsEditor: () => roles.includes('cms_editor'),
    refreshRoles,
    login: async (email: string, password: string) => {
      console.log('Login attempt for:', email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      console.log('Login successful');
    },
    logout: async () => {
      console.log('Logout function called - starting logout process');
      try {
        // Clear local state immediately
        setUser(null);
        setSession(null);
        setRoles([]);
        
        // Then call Supabase signOut
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Logout error:', error);
          throw error;
        }
        console.log('Logout successful - user signed out');
      } catch (error) {
        console.error('Failed to logout:', error);
        // Even if Supabase call fails, ensure local state is cleared
        setUser(null);
        setSession(null);
        setRoles([]);
        throw error;
      }
    },
  };
};

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authValue = useAuthState();
  
  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};