-- Drop and recreate the public_profiles view without SECURITY DEFINER
DROP VIEW IF EXISTS public.public_profiles;

-- Create the view with SECURITY INVOKER (default) instead of SECURITY DEFINER
CREATE VIEW public.public_profiles AS 
SELECT 
  id,
  user_id,
  display_name,
  avatar_url,
  created_at,
  updated_at
FROM profiles;

-- Also fix the handle_new_user function search path issue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url, email, provider)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    new.email,
    new.raw_app_meta_data ->> 'provider'
  );
  RETURN new;
END;
$function$;