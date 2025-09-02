import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type Page = Database['public']['Tables']['pages']['Row'];
type PageInsert = Database['public']['Tables']['pages']['Insert'];
type PageUpdate = Database['public']['Tables']['pages']['Update'];

export const usePages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (page: Omit<PageInsert, 'user_id'>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('pages')
        .insert([{ ...page, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setPages(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Page created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating page:', error);
      toast({
        title: "Error",
        description: "Failed to create page",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePage = async (id: string, updates: PageUpdate) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPages(prev => prev.map(page => page.id === id ? data : page));
      toast({
        title: "Success",
        description: "Page updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating page:', error);
      toast({
        title: "Error",
        description: "Failed to update page",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPages(prev => prev.filter(page => page.id !== id));
      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getPageBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      return null;
    }
  };

  const publishPage = async (id: string) => {
    return updatePage(id, { status: 'published' });
  };

  const unpublishPage = async (id: string) => {
    return updatePage(id, { status: 'draft' });
  };

  useEffect(() => {
    fetchPages();

    // Set up real-time subscription
    const channel = supabase
      .channel('pages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pages'
        },
        () => {
          fetchPages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    pages,
    loading,
    createPage,
    updatePage,
    deletePage,
    getPageBySlug,
    publishPage,
    unpublishPage,
    refetch: fetchPages,
  };
};