-- Add admin role to itisfives@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('22e9e8ad-18d8-41ce-80b6-1af36d0d12e7', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;