-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.get_safe_public_profiles()
RETURNS TABLE (
  display_id TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.display_id,
    p.display_name,
    p.avatar_url,
    p.created_at
  FROM public.public_profiles p
  WHERE p.display_name IS NOT NULL OR p.avatar_url IS NOT NULL;
$$;