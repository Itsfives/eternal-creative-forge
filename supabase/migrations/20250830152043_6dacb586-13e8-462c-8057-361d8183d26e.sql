-- Remove email column from profiles table to eliminate security risk
-- Email addresses are available through auth.users and don't need to be duplicated
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Update the trigger function to not include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url, provider)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_app_meta_data ->> 'provider'
  );
  RETURN new;
END;
$$;