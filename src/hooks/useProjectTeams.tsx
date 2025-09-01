import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ProjectTeamMember {
  user_id: string;
  project_role: 'owner' | 'project_manager' | 'developer';
  assigned_at: string;
  display_name: string;
  avatar_url?: string;
  email: string;
}

export interface UserProfile {
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  email: string;
}

export const useProjectTeams = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const getProjectTeamMembers = useCallback(async (projectId: string): Promise<ProjectTeamMember[]> => {
    if (!user) return [];

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await (supabase as any).rpc('get_project_team_members', {
        p_project_id: projectId
      });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch team members';
      setError(errorMessage);
      console.error('Error fetching project team members:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getAllUsers = useCallback(async (): Promise<UserProfile[]> => {
    if (!user) return [];

    try {
      setLoading(true);
      setError(null);

      // Get all user profiles with their auth information
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select(`
          user_id,
          display_name,
          avatar_url
        `);

      if (fetchError) throw fetchError;

      // Transform the data to match our interface
      const users: UserProfile[] = data?.map(profile => ({
        user_id: profile.user_id,
        display_name: profile.display_name || undefined,
        avatar_url: profile.avatar_url || undefined,
        email: profile.display_name || 'User' // We'll need to get email from auth if needed
      })) || [];

      return users;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const assignProjectRole = useCallback(async (
    projectId: string,
    userId: string,
    role: 'owner' | 'project_manager' | 'developer'
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      setError(null);

      const { data, error: assignError } = await (supabase as any).rpc('assign_project_role', {
        p_project_id: projectId,
        p_user_id: userId,
        p_role: role
      });

      if (assignError) throw assignError;

      toast({
        title: "Team member assigned",
        description: `Successfully assigned ${role.replace('_', ' ')} role`,
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign role';
      setError(errorMessage);
      toast({
        title: "Assignment failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error assigning project role:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const removeProjectMember = useCallback(async (
    projectId: string,
    userId: string,
    role?: 'owner' | 'project_manager' | 'developer'
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      setError(null);

      const { data, error: removeError } = await (supabase as any).rpc('remove_project_member', {
        p_project_id: projectId,
        p_user_id: userId,
        p_role: role || null
      });

      if (removeError) throw removeError;

      toast({
        title: "Team member removed",
        description: role ? `Removed ${role.replace('_', ' ')} role` : "Removed from project",
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove member';
      setError(errorMessage);
      toast({
        title: "Removal failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error removing project member:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const getUserProjectsWithRoles = useCallback(async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return [];

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await (supabase as any).rpc('get_user_projects_with_roles', {
        p_user_id: targetUserId
      });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user projects';
      setError(errorMessage);
      console.error('Error fetching user projects with roles:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    getProjectTeamMembers,
    getAllUsers,
    assignProjectRole,
    removeProjectMember,
    getUserProjectsWithRoles
  };
};