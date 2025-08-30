-- Critical Security Fixes for store_purchases table

-- 1. Add missing DELETE policy to prevent unauthorized deletions
CREATE POLICY "Users can delete their own purchases" 
ON public.store_purchases 
FOR DELETE 
USING (auth.uid() = user_id);

-- 2. Add admin access policies for customer support and fraud prevention
CREATE POLICY "Admins can view all purchases" 
ON public.store_purchases 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.provider = 'admin'
  )
);

CREATE POLICY "Admins can update purchase status" 
ON public.store_purchases 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.provider = 'admin'
  )
);

-- 3. Add constraints to validate financial data integrity
ALTER TABLE public.store_purchases 
ADD CONSTRAINT positive_amount_paid CHECK (amount_paid > 0);

ALTER TABLE public.store_purchases 
ADD CONSTRAINT valid_download_counts CHECK (
  download_count >= 0 AND 
  download_count <= download_limit AND
  download_limit > 0
);

ALTER TABLE public.store_purchases 
ADD CONSTRAINT valid_status CHECK (
  status IN ('pending', 'completed', 'failed', 'refunded', 'expired')
);

-- 4. Add constraint to ensure stripe_session_id is present for completed purchases
ALTER TABLE public.store_purchases 
ADD CONSTRAINT stripe_session_required CHECK (
  (status = 'completed' AND stripe_session_id IS NOT NULL) OR 
  (status != 'completed')
);

-- 5. Add index for better performance on user queries
CREATE INDEX IF NOT EXISTS idx_store_purchases_user_status 
ON public.store_purchases(user_id, status);

-- 6. Add index on stripe_session_id for payment verification
CREATE INDEX IF NOT EXISTS idx_store_purchases_stripe_session 
ON public.store_purchases(stripe_session_id) 
WHERE stripe_session_id IS NOT NULL;