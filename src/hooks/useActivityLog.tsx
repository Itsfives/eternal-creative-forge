import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Activity {
  id: string;
  action: string;
  user_id?: string;
  user_name?: string;
  details?: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  ip_address?: string;
}

export const useActivityLog = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      // For now, we'll create some real activities from recent database changes
      // Later this could be expanded to a proper activity_logs table
      
      // Get recent auth logs from Supabase analytics (if available)
      const recentActivities: Activity[] = [];
      
      // Add some real system activities
      const { data: recentPages } = await supabase
        .from('pages')
        .select('title, updated_at, user_id')
        .order('updated_at', { ascending: false })
        .limit(5);
        
      const { data: recentPortfolios } = await supabase
        .from('portfolios')
        .select('title, updated_at, user_id')
        .order('updated_at', { ascending: false })
        .limit(5);

      const { data: recentCommunications } = await supabase
        .from('client_communications')
        .select('subject, created_at, from_name')
        .order('created_at', { ascending: false })
        .limit(5);

      // Convert recent activities to activity log format
      recentPages?.forEach(page => {
        recentActivities.push({
          id: `page-${page.user_id}-${Date.parse(page.updated_at)}`,
          action: `Page "${page.title}" updated`,
          user_id: page.user_id,
          user_name: 'CMS User',
          timestamp: page.updated_at,
          type: 'info'
        });
      });

      recentPortfolios?.forEach(portfolio => {
        recentActivities.push({
          id: `portfolio-${portfolio.user_id}-${Date.parse(portfolio.updated_at)}`,
          action: `Portfolio "${portfolio.title}" updated`,
          user_id: portfolio.user_id,
          user_name: 'CMS User',
          timestamp: portfolio.updated_at,
          type: 'success'
        });
      });

      recentCommunications?.forEach(comm => {
        recentActivities.push({
          id: `comm-${Date.parse(comm.created_at)}`,
          action: `New message: ${comm.subject || 'No subject'}`,
          user_name: comm.from_name,
          timestamp: comm.created_at,
          type: 'info'
        });
      });

      // Sort by timestamp
      recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setActivities(recentActivities.slice(0, 20));
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (action: string, type: Activity['type'] = 'info', details?: string) => {
    try {
      // For now, just add to local state
      // In a real implementation, this would save to a database table
      const newActivity: Activity = {
        id: `${Date.now()}-${Math.random()}`,
        action,
        timestamp: new Date().toISOString(),
        type,
        details,
        user_name: 'Current User'
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    fetchActivities,
    logActivity
  };
};