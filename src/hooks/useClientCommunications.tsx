import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useClientCommunications = () => {
  const [communications, setCommunications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCommunications = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('client_communications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCommunications(data || []);
    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    await supabase
      .from('client_communications')
      .update({ is_unread: false })
      .eq('id', id);
    fetchCommunications();
  };

  const sendCommunication = async (data: any) => {
    if (!user) return;
    await supabase.from('client_communications').insert({
      user_id: user.id,
      from_user_id: user.id,
      from_name: user.email || 'Client',
      subject: data.subject || 'Client Message',
      message: data.message,
      is_unread: true
    });
    fetchCommunications();
  };

  const getRecentCommunications = (limit = 5) => communications.slice(0, limit);
  const getUnreadCount = () => communications.filter(c => c.is_unread).length;

  useEffect(() => {
    fetchCommunications();
  }, [user]);

  return { communications, loading, markAsRead, getRecentCommunications, getUnreadCount, sendCommunication };
};