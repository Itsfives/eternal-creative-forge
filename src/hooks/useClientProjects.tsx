import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useClientProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .rpc('get_user_projects_with_roles', { p_user_id: user.id });
      if (error) throw error;
      
      const formattedProjects = data?.map((item: any) => ({
        id: item.project_id,
        name: item.project_name,
        description: item.project_description,
        status: item.project_status,
        priority: item.project_priority,
        progress: Math.floor(Math.random() * 80) + 10,
        created_at: item.assigned_at
      })) || [];
      
      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActiveProjects = () => projects.filter(p => 
    p.status === 'in_progress' || p.status === 'planning'
  );

  useEffect(() => {
    fetchProjects();
  }, [user]);

  return { projects, loading, getActiveProjects, refetch: fetchProjects };
};