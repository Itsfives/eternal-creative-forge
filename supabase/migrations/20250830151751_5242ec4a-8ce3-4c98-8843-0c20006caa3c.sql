-- Drop the view and create a proper table
DROP VIEW IF EXISTS public.public_profiles;

-- Create public_profiles as a proper table
CREATE TABLE public.public_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Anyone can view public profiles" 
ON public.public_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own public profile" 
ON public.public_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own public profile" 
ON public.public_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger to automatically create public profile when regular profile is created
CREATE OR REPLACE FUNCTION public.handle_new_public_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.public_profiles (user_id, display_name, avatar_url, created_at, updated_at)
  VALUES (NEW.user_id, NEW.display_name, NEW.avatar_url, NEW.created_at, NEW.updated_at)
  ON CONFLICT (user_id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = EXCLUDED.updated_at;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_profile_created_or_updated
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_public_profile();