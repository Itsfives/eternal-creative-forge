import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type Portfolio = Database['public']['Tables']['portfolios']['Row'];
type PortfolioInsert = Database['public']['Tables']['portfolios']['Insert'];
type PortfolioUpdate = Database['public']['Tables']['portfolios']['Update'];

export const usePortfolio = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAuthenticated, hasRole } = useAuth();

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('portfolios')
        .select('*');

      // If user is not authenticated or doesn't have special roles, only show published portfolios
      if (!isAuthenticated || (!hasRole('admin') && !hasRole('cms_editor'))) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolios(data || []);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async (portfolio: PortfolioInsert) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const portfolioData = {
        ...portfolio,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('portfolios')
        .insert(portfolioData)
        .select()
        .single();

      if (error) throw error;
      
      setPortfolios(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Portfolio project created successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to create portfolio",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePortfolio = async (id: string, updates: PortfolioUpdate) => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPortfolios(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Success",
        description: "Portfolio updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to update portfolio",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePortfolio = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPortfolios(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Portfolio deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getPortfolioBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching portfolio by slug:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchPortfolios();

    // Set up real-time subscription
    const channel = supabase
      .channel('portfolios-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolios'
        },
        () => {
          fetchPortfolios();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, hasRole]); // Re-fetch when auth state changes

  return {
    portfolios,
    loading,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    getPortfolioBySlug,
    refetch: fetchPortfolios
  };
};