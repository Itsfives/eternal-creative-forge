-- Complete Database Backup for Lovable Portfolio Site
-- Generated: 2025-01-09
-- Project: zdhwmlnvbqbeyxbdfwhx

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'cms_editor',
    'client'
);

CREATE TYPE public.project_role AS ENUM (
    'owner',
    'manager',
    'developer',
    'designer',
    'client'
);

-- =============================================================================
-- TABLES
-- =============================================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL UNIQUE,
    display_name text,
    avatar_url text,
    provider text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Public profiles table
CREATE TABLE IF NOT EXISTS public.public_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL UNIQUE,
    display_id text DEFAULT ('user_'::text || substr(md5((random())::text), 1, 8)),
    display_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- User roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    UNIQUE(user_id, role)
);

-- Portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    category text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    client text,
    live_url text,
    github_url text,
    testimonial text,
    testimonial_author text,
    challenges text,
    solutions text,
    results text,
    technologies text[] DEFAULT '{}'::text[],
    images text[] DEFAULT '{}'::text[],
    featured boolean DEFAULT false,
    completed_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Client projects table
CREATE TABLE IF NOT EXISTS public.client_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    status text DEFAULT 'planning'::text NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    budget integer,
    deadline date,
    phase text,
    next_milestone text,
    team_lead text,
    client_company text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Project team members table
CREATE TABLE IF NOT EXISTS public.project_team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    project_id uuid,
    user_id uuid,
    project_role public.project_role NOT NULL,
    assigned_at timestamp with time zone DEFAULT now(),
    assigned_by uuid,
    UNIQUE(project_id, user_id, project_role)
);

-- Client communications table
CREATE TABLE IF NOT EXISTS public.client_communications (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    project_id uuid,
    from_user_id uuid,
    from_name text NOT NULL,
    from_role text,
    subject text,
    message text NOT NULL,
    message_type text DEFAULT 'general'::text NOT NULL,
    priority text DEFAULT 'normal'::text NOT NULL,
    is_unread boolean DEFAULT true NOT NULL,
    attachments jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Pages table
CREATE TABLE IF NOT EXISTS public.pages (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    content text,
    meta_description text,
    status text DEFAULT 'draft'::text NOT NULL,
    template text DEFAULT 'default'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Media table
CREATE TABLE IF NOT EXISTS public.media (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    filename text NOT NULL,
    original_name text NOT NULL,
    file_type text NOT NULL,
    file_size integer NOT NULL,
    url text NOT NULL,
    alt_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Store products table
CREATE TABLE IF NOT EXISTS public.store_products (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    description text,
    category text DEFAULT 'digital'::text NOT NULL,
    price integer NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    file_url text,
    file_name text,
    file_size integer,
    preview_image_url text,
    features text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Store purchases table
CREATE TABLE IF NOT EXISTS public.store_purchases (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    amount_paid integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    stripe_session_id text,
    download_count integer DEFAULT 0,
    download_limit integer DEFAULT 5,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Update updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Handle new user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Handle new public profile function
CREATE OR REPLACE FUNCTION public.handle_new_public_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Populate communication sender function
CREATE OR REPLACE FUNCTION public.populate_communication_sender()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_profile profiles%ROWTYPE;
BEGIN
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE user_id = NEW.from_user_id;
  
  IF user_profile.display_name IS NOT NULL THEN
    NEW.from_name := user_profile.display_name;
  ELSE
    NEW.from_name := (SELECT email FROM auth.users WHERE id = NEW.from_user_id);
  END IF;
  
  NEW.from_role := 'client';
  
  RETURN NEW;
END;
$$;

-- Has role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Get user roles function
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS app_role[]
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT ARRAY_AGG(role)
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- Get safe public profiles function
CREATE OR REPLACE FUNCTION public.get_safe_public_profiles()
RETURNS TABLE(display_id text, display_name text, avatar_url text, created_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    p.display_id,
    p.display_name,
    p.avatar_url,
    p.created_at
  FROM public.public_profiles p
  WHERE p.display_name IS NOT NULL OR p.avatar_url IS NOT NULL;
$$;

-- Get project team members function
CREATE OR REPLACE FUNCTION public.get_project_team_members(p_project_id uuid)
RETURNS TABLE(user_id uuid, project_role project_role, assigned_at timestamp with time zone, display_name text, avatar_url text, email text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    ptm.user_id,
    ptm.project_role,
    ptm.assigned_at,
    COALESCE(p.display_name, au.email) as display_name,
    p.avatar_url,
    au.email
  FROM project_team_members ptm
  LEFT JOIN profiles p ON ptm.user_id = p.user_id
  LEFT JOIN auth.users au ON ptm.user_id = au.id
  WHERE ptm.project_id = p_project_id
  ORDER BY ptm.assigned_at;
$$;

-- Get user projects with roles function
CREATE OR REPLACE FUNCTION public.get_user_projects_with_roles(p_user_id uuid)
RETURNS TABLE(project_id uuid, project_name text, project_description text, project_status text, project_priority text, project_role project_role, assigned_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    cp.id as project_id,
    cp.name as project_name,
    cp.description as project_description,
    cp.status as project_status,
    cp.priority as project_priority,
    ptm.project_role,
    ptm.assigned_at
  FROM client_projects cp
  INNER JOIN project_team_members ptm ON cp.id = ptm.project_id
  WHERE ptm.user_id = p_user_id
  ORDER BY ptm.assigned_at DESC;
$$;

-- Assign project role function
CREATE OR REPLACE FUNCTION public.assign_project_role(p_project_id uuid, p_user_id uuid, p_role project_role, p_assigned_by uuid DEFAULT auth.uid())
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  team_member_id UUID;
BEGIN
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role)) THEN
    RAISE EXCEPTION 'Insufficient permissions to assign project roles';
  END IF;

  INSERT INTO project_team_members (project_id, user_id, project_role, assigned_by)
  VALUES (p_project_id, p_user_id, p_role, p_assigned_by)
  ON CONFLICT (project_id, user_id, project_role) 
  DO UPDATE SET assigned_at = NOW(), assigned_by = p_assigned_by
  RETURNING id INTO team_member_id;

  RETURN team_member_id;
END;
$$;

-- Remove project member function
CREATE OR REPLACE FUNCTION public.remove_project_member(p_project_id uuid, p_user_id uuid, p_role project_role DEFAULT NULL::project_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role)) THEN
    RAISE EXCEPTION 'Insufficient permissions to remove project team members';
  END IF;

  IF p_role IS NOT NULL THEN
    DELETE FROM project_team_members 
    WHERE project_id = p_project_id AND user_id = p_user_id AND project_role = p_role;
  ELSE
    DELETE FROM project_team_members 
    WHERE project_id = p_project_id AND user_id = p_user_id;
  END IF;

  RETURN FOUND;
END;
$$;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Updated at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_public_profiles_updated_at BEFORE UPDATE ON public.public_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_client_projects_updated_at BEFORE UPDATE ON public.client_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_client_communications_updated_at BEFORE UPDATE ON public.client_communications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_store_products_updated_at BEFORE UPDATE ON public.store_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_store_purchases_updated_at BEFORE UPDATE ON public.store_purchases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Profile sync triggers
CREATE TRIGGER on_public_profile_changed AFTER INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_new_public_profile();
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Communication trigger
CREATE TRIGGER populate_communication_sender_trigger BEFORE INSERT ON public.client_communications FOR EACH ROW EXECUTE FUNCTION public.populate_communication_sender();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_purchases ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Public profiles policies
CREATE POLICY "Anyone can view public profile data" ON public.public_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own public profile" ON public.public_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own public profile" ON public.public_profiles FOR UPDATE USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can assign roles" ON public.user_roles FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Portfolios policies
CREATE POLICY "Anyone can view published portfolios" ON public.portfolios FOR SELECT USING ((status = 'published'::text) OR (auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role));
CREATE POLICY "Users can create their own portfolios" ON public.portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own portfolios" ON public.portfolios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own portfolios" ON public.portfolios FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "CMS editors can manage portfolios" ON public.portfolios FOR ALL USING (has_role(auth.uid(), 'cms_editor'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Client projects policies
CREATE POLICY "Clients can view their own projects" ON public.client_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins and CMS editors can view all projects" ON public.client_projects FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role));
CREATE POLICY "Admins and CMS editors can create projects" ON public.client_projects FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role));
CREATE POLICY "Admins and CMS editors can update projects" ON public.client_projects FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role));
CREATE POLICY "Admins and CMS editors can delete projects" ON public.client_projects FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role));

-- Project team members policies
CREATE POLICY "Project team members can view their project team" ON public.project_team_members FOR SELECT USING ((auth.uid() = user_id) OR (EXISTS ( SELECT 1 FROM project_team_members ptm2 WHERE ((ptm2.project_id = project_team_members.project_id) AND (ptm2.user_id = auth.uid())))));
CREATE POLICY "Admins and CMS editors can manage all team members" ON public.project_team_members FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role));

-- Client communications policies
CREATE POLICY "Clients can view their own communications" ON public.client_communications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins and CMS editors can view all communications" ON public.client_communications FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role));
CREATE POLICY "Users can send communications" ON public.client_communications FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Clients can mark their own messages as read" ON public.client_communications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins and CMS editors can create communications" ON public.client_communications FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role));
CREATE POLICY "Admins and CMS editors can update communications" ON public.client_communications FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role));
CREATE POLICY "Admins and CMS editors can delete communications" ON public.client_communications FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role));

-- Pages policies
CREATE POLICY "Anyone can view published pages" ON public.pages FOR SELECT USING ((status = 'published'::text) OR (auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role));
CREATE POLICY "Users can create their own pages" ON public.pages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pages" ON public.pages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pages" ON public.pages FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "CMS editors can manage pages" ON public.pages FOR ALL USING (has_role(auth.uid(), 'cms_editor'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Media policies
CREATE POLICY "Users can view their own media" ON public.media FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload their own media" ON public.media FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own media" ON public.media FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own media" ON public.media FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "CMS editors can manage media" ON public.media FOR ALL USING (has_role(auth.uid(), 'cms_editor'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Store products policies
CREATE POLICY "Anyone can view active products" ON public.store_products FOR SELECT USING (status = 'active'::text);
CREATE POLICY "Authenticated users can view all products" ON public.store_products FOR SELECT USING (auth.uid() IS NOT NULL);

-- Store purchases policies
CREATE POLICY "Users can view their own purchases" ON public.store_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own purchases" ON public.store_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own purchases" ON public.store_purchases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own purchases" ON public.store_purchases FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all purchases" ON public.store_purchases FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update purchase status" ON public.store_purchases FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================================================
-- SAMPLE DATA (Based on current database state)
-- =============================================================================

-- Note: This section would contain actual data dumps
-- For security reasons, actual user data is not included in this template
-- When creating a real backup, export the data using:
-- pg_dump --data-only --no-owner --no-privileges

-- =============================================================================
-- STORAGE SETUP
-- =============================================================================

-- See storage_policies.sql for complete storage configuration

-- =============================================================================
-- END OF BACKUP
-- =============================================================================