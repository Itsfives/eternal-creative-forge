import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Invoice {
  id: string;
  user_id: string;
  project_id?: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date?: string;
  payment_date?: string;
  description?: string;
  line_items: any[];
  created_at: string;
  updated_at: string;
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchInvoices = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInvoices((data || []).map(invoice => ({
        ...invoice,
        status: invoice.status as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
        line_items: (invoice.line_items as any[]) || [],
        currency: invoice.currency || 'usd',
        due_date: invoice.due_date || undefined,
        payment_date: invoice.payment_date || undefined,
        description: invoice.description || undefined
      })));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error",
        description: "Failed to fetch invoices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData: Partial<Invoice> & { amount: number }) => {
    if (!user || !invoiceData.amount) return null;
    
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          amount: invoiceData.amount,
          user_id: user.id,
          project_id: invoiceData.project_id || null,
          currency: invoiceData.currency || 'usd',
          status: invoiceData.status || 'draft',
          due_date: invoiceData.due_date || null,
          payment_date: invoiceData.payment_date || null,
          description: invoiceData.description || null,
          line_items: invoiceData.line_items || [],
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      fetchInvoices();
      return data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateInvoice = async (invoiceId: string, updates: Partial<Invoice>) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', invoiceId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });

      fetchInvoices();
      return data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  return {
    invoices,
    loading,
    createInvoice,
    updateInvoice,
    refetch: fetchInvoices
  };
};