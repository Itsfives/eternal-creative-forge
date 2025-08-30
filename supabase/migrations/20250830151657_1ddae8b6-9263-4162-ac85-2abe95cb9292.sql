-- Add RLS policies to public_profiles table
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view public profiles (this is intended to be public data)
CREATE POLICY "Anyone can view public profiles" 
ON public.public_profiles 
FOR SELECT 
USING (true);

-- Only allow users to insert/update their own public profile
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
  INSERT INTO public.public_profiles (user_id, id, display_name, avatar_url, created_at, updated_at)
  VALUES (NEW.user_id, NEW.id, NEW.display_name, NEW.avatar_url, NEW.created_at, NEW.updated_at)
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