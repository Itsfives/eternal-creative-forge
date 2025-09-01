
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ClientCommunication {
  id: string;
  user_id: string;
  project_id?: string;
  from_user_id?: string;
  from_name: string;
  from_role?: string;
  subject?: string;
  message: string;
  message_type: 'general' | 'milestone' | 'feedback_request' | 'approval_needed';
  is_unread: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: any;
  created_at: string;
  updated_at: string;
  // When previously using a join we exposed project name via nested object:
  client_projects?: {
    name: string;
  };
  // With the new view we get a flat project_name column
  project_name?: string;
}

export const useClientCommunications = () => {
  const [communications, setCommunications] = useState<ClientCommunication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCommunications = useCallback(async (limit?: number, projectId?: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Use SQL-as-API via RPC: get_recent_communications(limit_count, project_id)
      const limitToUse = typeof limit === 'number' ? limit : 10;
      const projectParam = projectId ?? null;

      console.log('[useClientCommunications] Fetching via RPC get_recent_communications', {
        limit_count: limitToUse,
        project_id: projectParam
      });

      const { data, error: fetchError } = await (supabase as any).rpc('get_recent_communications', {
        limit_count: limitToUse,
        project_id: projectParam
      });

      if (fetchError) throw fetchError;

      setCommunications((data as ClientCommunication[]) || []);
    } catch (err) {
      console.error('Error fetching communications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch communications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    if (!user) return;

    try {
      console.log('[useClientCommunications] Marking as read via RPC mark_communication_read', { id });
      const { data, error } = await (supabase as any).rpc('mark_communication_read', { 
        p_id: id 
      });

      if (error) throw error;

      const success = Boolean(data);
      if (!success) {
        console.warn('[useClientCommunications] mark_communication_read returned false');
        return;
      }

      // Update local state
      setCommunications(prev =>
        prev.map(comm =>
          comm.id === id ? { ...comm, is_unread: false } : comm
        )
      );
    } catch (err) {
      console.error('Error marking communication as read:', err);
    }
  }, [user]);

  const sendCommunication = useCallback(async (messageData: {
    project_id?: string;
    subject?: string;
    message: string;
    message_type: 'general' | 'milestone' | 'feedback_request' | 'approval_needed';
    priority: 'low' | 'normal' | 'high' | 'urgent';
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('[useClientCommunications] Sending communication', messageData);
      
      const { data, error } = await supabase
        .from('client_communications')
        .insert({
          user_id: user.id,
          from_user_id: user.id,
          from_name: 'User', // Will be updated by trigger
          project_id: messageData.project_id || null,
          subject: messageData.subject || null,
          message: messageData.message,
          message_type: messageData.message_type,
          priority: messageData.priority,
          is_unread: true,
          // from_role will be populated by the trigger
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh communications to include the new message
      await fetchCommunications();

      return data;
    } catch (err) {
      console.error('Error sending communication:', err);
      throw err;
    }
  }, [user, fetchCommunications]);

  const getUnreadCount = useCallback(() => {
    return communications.filter(comm => comm.is_unread).length;
  }, [communications]);

  const getRecentCommunications = useCallback((limit: number = 5) => {
    return communications.slice(0, limit);
  }, [communications]);

  const getCommunicationsByProject = useCallback((projectId: string) => {
    return communications.filter(comm => comm.project_id === projectId);
  }, [communications]);

  const getCommunicationsByType = useCallback((messageType: string) => {
    return communications.filter(comm => comm.message_type === messageType);
  }, [communications]);

  const getUrgentCommunications = useCallback(() => {
    return communications.filter(comm => comm.priority === 'urgent' || comm.priority === 'high');
  }, [communications]);

  useEffect(() => {
    if (user) {
      fetchCommunications();
    }
  }, [user, fetchCommunications]);

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription
    const channel = supabase
      .channel('client-communications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_communications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('[useClientCommunications] Realtime change detected, refetching...');
          fetchCommunications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchCommunications]);

  return {
    communications,
    loading,
    error,
    fetchCommunications,
    markAsRead,
    sendCommunication,
    getUnreadCount,
    getRecentCommunications,
    getCommunicationsByProject,
    getCommunicationsByType,
    getUrgentCommunications,
    refetch: () => fetchCommunications()
  };
};
