import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ClientFile {
  id: string;
  user_id: string;
  project_id?: string;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  version: number;
  is_current_version: boolean;
  upload_date: string;
  expires_at?: string;
  download_count: number;
  download_limit: number;
  created_at: string;
  updated_at: string;
}

export const useClientFiles = () => {
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFiles = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('client_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, projectId?: string) => {
    if (!user) return null;
    
    try {
      // Upload file to Supabase storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create file record in database
      const { data, error } = await supabase
        .from('client_files')
        .insert({
          user_id: user.id,
          project_id: projectId,
          filename: fileName,
          original_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_path: uploadData.path,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      fetchFiles();
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
      return null;
    }
  };

  const downloadFile = async (fileId: string) => {
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) throw new Error('File not found');

      if (file.download_count >= file.download_limit) {
        toast({
          title: "Download Limit Reached",
          description: "You have reached the download limit for this file",
          variant: "destructive",
        });
        return;
      }

      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('media')
        .createSignedUrl(file.file_path, 3600); // 1 hour expiry

      if (error) throw error;

      // Increment download count
      await supabase
        .from('client_files')
        .update({ download_count: file.download_count + 1 })
        .eq('id', fileId);

      // Trigger download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = file.original_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      fetchFiles();
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) throw new Error('File not found');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('client_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [user]);

  return {
    files,
    loading,
    uploadFile,
    downloadFile,
    deleteFile,
    refetch: fetchFiles
  };
};