import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { AppRole } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  roles: AppRole[];
  last_sign_in_at?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, created_at');

      if (profilesError) throw profilesError;

      // Get user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Try to get auth users for email and last sign in
      const { data: authData } = await supabase.auth.admin.listUsers();

      // Combine the data
      const usersData: UserProfile[] = [];

      if (authData?.users && authData.users.length > 0) {
        // If we have auth data, use it as the primary source
        authData.users.forEach((authUser: any) => {
          const profile = profiles?.find(p => p.user_id === authUser.id);
          const userRolesList = userRoles?.filter(ur => ur.user_id === authUser.id).map(ur => ur.role) || [];
          
          usersData.push({
            id: authUser.id,
            email: authUser.email || 'No email',
            display_name: profile?.display_name || authUser.user_metadata?.display_name,
            avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url,
            created_at: profile?.created_at || authUser.created_at,
            roles: userRolesList as AppRole[],
            last_sign_in_at: authUser.last_sign_in_at
          });
        });
      } else {
        // Fallback to profiles only
        profiles?.forEach(profile => {
          const userRolesList = userRoles?.filter(ur => ur.user_id === profile.user_id).map(ur => ur.role) || [];
          
          usersData.push({
            id: profile.user_id,
            email: 'Email hidden (no admin access)',
            display_name: profile.display_name,
            avatar_url: profile.avatar_url,
            created_at: profile.created_at,
            roles: userRolesList as AppRole[]
          });
        });
      }

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast.success(`Role ${role} assigned successfully`);
      await fetchUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast.success(`Role ${role} removed successfully`);
      await fetchUsers();
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    assignRole,
    removeRole
  };
};