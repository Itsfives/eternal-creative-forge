-- Create project roles enum
CREATE TYPE project_role AS ENUM ('owner', 'project_manager', 'developer');

-- Create project team members table
CREATE TABLE project_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES client_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_role project_role NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(project_id, user_id, project_role)
);

-- Enable RLS on project_team_members
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;

-- Create function to get project team members with user details
CREATE OR REPLACE FUNCTION public.get_project_team_members(p_project_id UUID)
RETURNS TABLE(
  user_id UUID,
  project_role project_role,
  assigned_at TIMESTAMP WITH TIME ZONE,
  display_name TEXT,
  avatar_url TEXT,
  email TEXT
)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
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

-- Create function to get user projects with their roles
CREATE OR REPLACE FUNCTION public.get_user_projects_with_roles(p_user_id UUID)
RETURNS TABLE(
  project_id UUID,
  project_name TEXT,
  project_description TEXT,
  project_status TEXT,
  project_priority TEXT,
  project_role project_role,
  assigned_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
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

-- RLS Policies for project_team_members
CREATE POLICY "Admins and CMS editors can manage all team members"
ON project_team_members
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role));

CREATE POLICY "Project team members can view their project team"
ON project_team_members
FOR SELECT
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM project_team_members ptm2 
    WHERE ptm2.project_id = project_team_members.project_id 
    AND ptm2.user_id = auth.uid()
  )
);

-- Create function to assign project role
CREATE OR REPLACE FUNCTION public.assign_project_role(
  p_project_id UUID,
  p_user_id UUID,
  p_role project_role,
  p_assigned_by UUID DEFAULT auth.uid()
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  team_member_id UUID;
BEGIN
  -- Check if user has permission to assign roles
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role)) THEN
    RAISE EXCEPTION 'Insufficient permissions to assign project roles';
  END IF;

  -- Insert or update the team member assignment
  INSERT INTO project_team_members (project_id, user_id, project_role, assigned_by)
  VALUES (p_project_id, p_user_id, p_role, p_assigned_by)
  ON CONFLICT (project_id, user_id, project_role) 
  DO UPDATE SET assigned_at = NOW(), assigned_by = p_assigned_by
  RETURNING id INTO team_member_id;

  RETURN team_member_id;
END;
$$;

-- Create function to remove project member
CREATE OR REPLACE FUNCTION public.remove_project_member(
  p_project_id UUID,
  p_user_id UUID,
  p_role project_role DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has permission to remove team members
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'cms_editor'::app_role)) THEN
    RAISE EXCEPTION 'Insufficient permissions to remove project team members';
  END IF;

  -- Remove specific role or all roles for the user in the project
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