import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Contract {
  id: string;
  user_id: string;
  project_id?: string;
  title: string;
  contract_number: string;
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';
  content?: string;
  signed_date?: string;
  expires_at?: string;
  file_path?: string;
  created_at: string;
  updated_at: string;
}

export const useContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchContracts = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setContracts((data || []).map(contract => ({
        ...contract,
        status: contract.status as 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled'
      })));
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contracts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createContract = async (contractData: Partial<Contract> & { title: string }) => {
    if (!user || !contractData.title) return null;
    
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert({
          title: contractData.title,
          user_id: user.id,
          project_id: contractData.project_id || null,
          status: contractData.status || 'draft',
          content: contractData.content || null,
          signed_date: contractData.signed_date || null,
          expires_at: contractData.expires_at || null,
          file_path: contractData.file_path || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract created successfully",
      });

      fetchContracts();
      return data;
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: "Error",
        description: "Failed to create contract",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateContract = async (contractId: string, updates: Partial<Contract>) => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update(updates)
        .eq('id', contractId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract updated successfully",
      });

      fetchContracts();
      return data;
    } catch (error) {
      console.error('Error updating contract:', error);
      toast({
        title: "Error",
        description: "Failed to update contract",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [user]);

  return {
    contracts,
    loading,
    createContract,
    updateContract,
    refetch: fetchContracts
  };
};