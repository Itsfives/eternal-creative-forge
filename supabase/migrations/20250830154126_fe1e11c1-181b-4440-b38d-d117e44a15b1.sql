-- Create proper role management system
CREATE TYPE public.app_role AS ENUM ('admin', 'cms_editor', 'client');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS app_role[]
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT ARRAY_AGG(role)
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can assign roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add indexes for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- Update existing RLS policies to use proper role checking
-- Update portfolios policies
DROP POLICY IF EXISTS "Users can view all published portfolios" ON public.portfolios;
CREATE POLICY "Anyone can view published portfolios"
ON public.portfolios
FOR SELECT
USING (
  status = 'published' OR 
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'cms_editor')
);

-- Update pages policies  
DROP POLICY IF EXISTS "Users can view all published pages" ON public.pages;
CREATE POLICY "Anyone can view published pages"
ON public.pages
FOR SELECT
USING (
  status = 'published' OR 
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'cms_editor')
);

-- Update store_purchases policies to use proper role checking
DROP POLICY IF EXISTS "Admins can view all purchases" ON public.store_purchases;
DROP POLICY IF EXISTS "Admins can update purchase status" ON public.store_purchases;

CREATE POLICY "Admins can view all purchases"
ON public.store_purchases
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update purchase status"
ON public.store_purchases
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Add CMS editor policies for content management
CREATE POLICY "CMS editors can manage portfolios"
ON public.portfolios
FOR ALL
USING (public.has_role(auth.uid(), 'cms_editor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "CMS editors can manage pages"
ON public.pages
FOR ALL
USING (public.has_role(auth.uid(), 'cms_editor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "CMS editors can manage media"
ON public.media
FOR ALL
USING (public.has_role(auth.uid(), 'cms_editor') OR public.has_role(auth.uid(), 'admin'));