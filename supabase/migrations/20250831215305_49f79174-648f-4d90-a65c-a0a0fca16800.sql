-- Fix the security definer view by dropping it and using RLS policies instead
DROP VIEW IF EXISTS public.safe_public_profiles;

-- Create a proper function to get safe public profile data
CREATE OR REPLACE FUNCTION public.get_safe_public_profiles()
RETURNS TABLE (
  display_id TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    p.display_id,
    p.display_name,
    p.avatar_url,
    p.created_at
  FROM public.public_profiles p
  WHERE p.display_name IS NOT NULL OR p.avatar_url IS NOT NULL;
$$;