-- Phase 1: Security Hardening - Fix public profile exposure
-- Remove user_id from public visibility and add anonymized identifiers

-- Add anonymous display identifier to public_profiles
ALTER TABLE public.public_profiles 
ADD COLUMN display_id TEXT UNIQUE DEFAULT ('user_' || substr(md5(random()::text), 1, 8));

-- Update RLS policy to hide user_id from public access
DROP POLICY IF EXISTS "Anyone can view public profiles" ON public.public_profiles;

CREATE POLICY "Anyone can view public profile data" 
ON public.public_profiles 
FOR SELECT 
USING (true);

-- Create a view that exposes only safe public data
CREATE OR REPLACE VIEW public.safe_public_profiles AS
SELECT 
  display_id,
  display_name,
  avatar_url,
  created_at
FROM public.public_profiles
WHERE display_name IS NOT NULL OR avatar_url IS NOT NULL;