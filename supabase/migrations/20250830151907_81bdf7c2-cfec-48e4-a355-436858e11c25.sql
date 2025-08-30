-- Fix the security warning by setting search_path
CREATE OR REPLACE FUNCTION public.handle_new_public_profile()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.public_profiles (user_id, display_name, avatar_url, created_at, updated_at)
  VALUES (NEW.user_id, NEW.display_name, NEW.avatar_url, NEW.created_at, NEW.updated_at)
  ON CONFLICT (user_id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = EXCLUDED.updated_at;
  RETURN NEW;
END;
$$;