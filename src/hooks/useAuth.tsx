import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export type AppRole = 'admin' | 'cms_editor' | 'client';

interface AuthState {
  user: User | null;
  roles: AppRole[];
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    roles: [],
    loading: true
  });

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

  const hasRole = (role: AppRole): boolean => {
    return authState.roles.includes(role);
  };

  const hasAnyRole = (roles: AppRole[]): boolean => {
    return roles.some(role => authState.roles.includes(role));
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isCmsEditor = (): boolean => {
    return hasRole('cms_editor');
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        
        if (user) {
          // Fetch user roles when user is authenticated
          const roles = await fetchUserRoles(user.id);
          setAuthState({ user, roles, loading: false });
        } else {
          setAuthState({ user: null, roles: [], loading: false });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      
      if (user) {
        const roles = await fetchUserRoles(user.id);
        setAuthState({ user, roles, loading: false });
      } else {
        setAuthState({ user: null, roles: [], loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user: authState.user,
    roles: authState.roles,
    loading: authState.loading,
    hasRole,
    hasAnyRole,
    isAdmin,
    isCmsEditor,
    refreshRoles: async () => {
      if (authState.user) {
        const roles = await fetchUserRoles(authState.user.id);
        setAuthState(prev => ({ ...prev, roles }));
      }
    }
  };
};