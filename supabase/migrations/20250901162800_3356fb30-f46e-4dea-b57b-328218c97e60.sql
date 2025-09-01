-- Add RLS policy to allow users to send communications
CREATE POLICY "Users can send communications" 
ON public.client_communications 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = from_user_id);

-- Create function to auto-populate sender information when creating communications
CREATE OR REPLACE FUNCTION public.populate_communication_sender()
RETURNS TRIGGER AS $$
DECLARE
  user_profile profiles%ROWTYPE;
BEGIN
  -- Get user profile information
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE user_id = NEW.from_user_id;
  
  -- Set from_name from profile if available, otherwise use email
  IF user_profile.display_name IS NOT NULL THEN
    NEW.from_name := user_profile.display_name;
  ELSE
    NEW.from_name := (SELECT email FROM auth.users WHERE id = NEW.from_user_id);
  END IF;
  
  -- Set from_role to 'client' for user-sent communications
  NEW.from_role := 'client';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;