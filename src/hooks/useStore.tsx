import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type StoreProduct = Database['public']['Tables']['store_products']['Row'];
type StorePurchase = Database['public']['Tables']['store_purchases']['Row'];
type StorePurchaseInsert = Database['public']['Tables']['store_purchases']['Insert'];

// Define the type with the joined product data
interface StorePurchaseWithProduct extends StorePurchase {
  store_products: StoreProduct;
}

export const useStore = () => {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [purchases, setPurchases] = useState<StorePurchaseWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('store_products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch store products",
        variant: "destructive",
      });
    }
  };

  const fetchUserPurchases = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('store_purchases')
        .select(`
          *,
          store_products (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your purchases",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPurchase = async (productId: string, amountPaid: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const purchaseData: StorePurchaseInsert = {
        user_id: user.id,
        product_id: productId,
        amount_paid: amountPaid,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('store_purchases')
        .insert(purchaseData)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Purchase Initiated",
        description: "Your purchase is being processed",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating purchase:', error);
      toast({
        title: "Error",
        description: "Failed to create purchase",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePurchaseStatus = async (purchaseId: string, status: string, stripeSessionId?: string) => {
    try {
      const updates: any = { status };
      if (stripeSessionId) {
        updates.stripe_session_id = stripeSessionId;
      }

      const { error } = await supabase
        .from('store_purchases')
        .update(updates)
        .eq('id', purchaseId);

      if (error) throw error;
      
      if (status === 'completed') {
        toast({
          title: "Purchase Complete",
          description: "Your download is now available!",
        });
        fetchUserPurchases(); // Refresh purchases
      }
    } catch (error) {
      console.error('Error updating purchase:', error);
      throw error;
    }
  };

  const incrementDownloadCount = async (purchaseId: string) => {
    try {
      const { data, error } = await supabase
        .from('store_purchases')
        .select('download_count, download_limit')
        .eq('id', purchaseId)
        .single();

      if (error) throw error;

      const newCount = (data.download_count || 0) + 1;
      if (newCount > data.download_limit) {
        throw new Error('Download limit exceeded');
      }

      await supabase
        .from('store_purchases')
        .update({ download_count: newCount })
        .eq('id', purchaseId);

      return newCount;
    } catch (error) {
      console.error('Error incrementing download count:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUserPurchases();
  }, []);

  return {
    products,
    purchases,
    loading,
    createPurchase,
    updatePurchaseStatus,
    incrementDownloadCount,
    refetchProducts: fetchProducts,
    refetchPurchases: fetchUserPurchases
  };
};