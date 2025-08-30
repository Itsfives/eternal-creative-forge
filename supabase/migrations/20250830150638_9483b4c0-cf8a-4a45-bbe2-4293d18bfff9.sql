-- Create store products table
CREATE TABLE public.store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- price in cents
  category TEXT NOT NULL DEFAULT 'digital',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  file_url TEXT, -- for digital downloads
  file_name TEXT,
  file_size INTEGER,
  preview_image_url TEXT,
  features TEXT[], -- array of features/benefits
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create store purchases table to track what users bought
CREATE TABLE public.store_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.store_products(id) ON DELETE CASCADE,
  stripe_session_id TEXT,
  amount_paid INTEGER NOT NULL, -- amount paid in cents
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  download_count INTEGER DEFAULT 0,
  download_limit INTEGER DEFAULT 5, -- max downloads allowed
  expires_at TIMESTAMPTZ, -- optional expiration for downloads
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_purchases ENABLE ROW LEVEL SECURITY;

-- RLS policies for store_products (public read, admin write)
CREATE POLICY "Anyone can view active products" 
ON public.store_products 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Authenticated users can view all products" 
ON public.store_products 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- RLS policies for store_purchases (users can only see their own purchases)
CREATE POLICY "Users can view their own purchases" 
ON public.store_purchases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases" 
ON public.store_purchases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchases" 
ON public.store_purchases 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_store_products_updated_at
BEFORE UPDATE ON public.store_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_store_purchases_updated_at
BEFORE UPDATE ON public.store_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample products
INSERT INTO public.store_products (name, description, price, category, file_url, file_name, file_size, preview_image_url, features) VALUES
('Website Template Pack', 'Professional website templates with modern designs', 4999, 'templates', '/downloads/website-templates.zip', 'website-templates.zip', 25600000, '/images/website-templates-preview.jpg', ARRAY['5 Premium Templates', 'Mobile Responsive', 'Easy Customization', 'Documentation Included']),
('Brand Identity Kit', 'Complete brand identity package with logos and guidelines', 7999, 'branding', '/downloads/brand-identity-kit.zip', 'brand-identity-kit.zip', 15360000, '/images/brand-kit-preview.jpg', ARRAY['Logo Variations', 'Color Palette', 'Typography Guide', 'Brand Guidelines']),
('Social Media Pack', 'Ready-to-use social media templates and graphics', 2999, 'graphics', '/downloads/social-media-pack.zip', 'social-media-pack.zip', 10240000, '/images/social-media-preview.jpg', ARRAY['50+ Templates', 'Instagram & Facebook', 'Editable Designs', 'Multiple Formats']),
('E-commerce Starter Kit', 'Complete e-commerce website solution', 12999, 'templates', '/downloads/ecommerce-starter.zip', 'ecommerce-starter.zip', 51200000, '/images/ecommerce-preview.jpg', ARRAY['Full Website', 'Payment Integration', 'Admin Dashboard', '30 Days Support']);