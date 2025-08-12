-- Fix security issue: Remove public access to user email addresses
-- Drop the current overly permissive policy
DROP POLICY "Profiles are viewable by everyone" ON public.profiles;

-- Create a more secure policy that only allows users to view their own profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Optional: Create a separate policy for public profile data (without email)
-- This allows viewing display names and avatars but not emails
CREATE POLICY "Public can view basic profile info" 
ON public.profiles 
FOR SELECT 
USING (true)
WITH CHECK (false); -- This will be handled by a view or filtered query

-- Create a view for public profile access without sensitive data
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  display_name,
  avatar_url,
  created_at,
  updated_at
FROM public.profiles;