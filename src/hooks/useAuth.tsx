import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

// Define the available app roles
export type AppRole = 'admin' | 'cms_editor' | 'client';

// Auth context type
interface AuthContextType {
  user: User | null;
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          // Fetch user roles when user is authenticated
          const userRoles = await fetchUserRoles(currentUser.id);
          setRoles(userRoles);
        } else {
          setRoles([]);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const userRoles = await fetchUserRoles(currentUser.id);
        setRoles(userRoles);
      } else {
        setRoles([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    roles,
    loading,
    isAuthenticated: !!user,
    hasRole: (role: AppRole | string) => roles.includes(role as AppRole),
    hasAnyRole: (targetRoles: AppRole[]) => targetRoles.some(role => roles.includes(role)),
    isAdmin: () => roles.includes('admin'),
    isCmsEditor: () => roles.includes('cms_editor'),
    refreshRoles,
    login: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    logout: async () => {
      console.log('Logout function called');
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Logout error:', error);
          throw error;
        }
        console.log('Logout successful');
      } catch (error) {
        console.error('Failed to logout:', error);
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