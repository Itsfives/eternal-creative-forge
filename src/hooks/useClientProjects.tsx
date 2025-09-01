import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ClientProject {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  progress: number;
  deadline?: string;
  phase?: string;
  next_milestone?: string;
  team_lead?: string;
  client_company?: string;
  budget?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export const useClientProjects = () => {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProjects = useCallback(async (statusFilter?: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('client_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setProjects((data || []) as ClientProject[]);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getProjectById = useCallback(async (id: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('client_projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching project:', err);
      return null;
    }
  }, [user]);

  const getActiveProjects = useCallback(() => {
    return projects.filter(project => 
      project.status === 'planning' || project.status === 'in-progress'
    );
  }, [projects]);

  const getProjectsByStatus = useCallback((status: string) => {
    return projects.filter(project => project.status === status);
  }, [projects]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription
    const channel = supabase
      .channel('client-projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_projects',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProjectById,
    getActiveProjects,
    getProjectsByStatus,
    refetch: () => fetchProjects()
  };
};