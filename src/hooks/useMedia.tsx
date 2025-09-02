import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type Media = Database['public']['Tables']['media']['Row'];
type MediaInsert = Database['public']['Tables']['media']['Insert'];

export const useMedia = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: "Error",
        description: "Failed to fetch media",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, altText?: string) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setUploading(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `media/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Save media record to database
      const mediaRecord: Omit<MediaInsert, 'user_id'> = {
        filename: fileName,
        original_name: file.name,
        file_type: file.type,
        file_size: file.size,
        url: publicUrl,
        alt_text: altText,
      };

      const { data, error } = await supabase
        .from('media')
        .insert([{ ...mediaRecord, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setMedia(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (id: string, filename: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([`media/${filename}`]);

      if (storageError) throw storageError;

      // Delete from database
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMedia(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMedia = async (id: string, updates: { alt_text?: string }) => {
    try {
      const { data, error } = await supabase
        .from('media')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setMedia(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Success",
        description: "Media updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating media:', error);
      toast({
        title: "Error",
        description: "Failed to update media",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchMedia();

    // Set up real-time subscription
    const channel = supabase
      .channel('media-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'media'
        },
        () => {
          fetchMedia();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    media,
    loading,
    uploading,
    uploadFile,
    deleteFile,
    updateMedia,
    refetch: fetchMedia,
  };
};