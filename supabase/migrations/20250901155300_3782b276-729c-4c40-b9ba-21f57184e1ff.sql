
-- 1) Ensure referential integrity (allow embedding project details in communications)
ALTER TABLE public.client_communications
  ADD CONSTRAINT client_communications_project_id_fkey
  FOREIGN KEY (project_id) REFERENCES public.client_projects(id)
  ON DELETE SET NULL;

-- 2) Keep updated_at fresh on updates
DROP TRIGGER IF EXISTS set_updated_at_on_client_projects ON public.client_projects;
CREATE TRIGGER set_updated_at_on_client_projects
BEFORE UPDATE ON public.client_projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_on_client_communications ON public.client_communications;
CREATE TRIGGER set_updated_at_on_client_communications
BEFORE UPDATE ON public.client_communications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Helpful indexes for common filters
CREATE INDEX IF NOT EXISTS idx_client_projects_user_status ON public.client_projects (user_id, status);
CREATE INDEX IF NOT EXISTS idx_client_projects_created_at ON public.client_projects (created_at);
CREATE INDEX IF NOT EXISTS idx_client_communications_user_unread ON public.client_communications (user_id, is_unread);
CREATE INDEX IF NOT EXISTS idx_client_communications_project_created ON public.client_communications (project_id, created_at);

-- 4) Views for read models (safe columns + computed fields)
CREATE OR REPLACE VIEW public.v_client_projects_for_user AS
SELECT
  cp.id,
  cp.user_id,
  cp.name,
  cp.description,
  cp.status,
  cp.progress,
  cp.deadline,
  cp.phase,
  cp.next_milestone,
  cp.team_lead,
  cp.client_company,
  cp.budget,
  cp.priority,
  cp.created_at,
  cp.updated_at,
  GREATEST(0, 100 - cp.progress) AS remaining_progress,
  CASE 
    WHEN cp.deadline IS NOT NULL 
    THEN (cp.deadline::date - CURRENT_DATE)::int 
    ELSE NULL 
  END AS days_until_deadline,
  CASE 
    WHEN cp.deadline IS NOT NULL AND cp.deadline < CURRENT_DATE AND cp.status <> 'completed'
    THEN TRUE ELSE FALSE 
  END AS is_overdue
FROM public.client_projects cp;

CREATE OR REPLACE VIEW public.v_client_communications_for_user AS
SELECT
  cc.id,
  cc.user_id,
  cc.project_id,
  cc.from_user_id,
  cc.from_name,
  cc.from_role,
  cc.subject,
  cc.message,
  cc.message_type,
  cc.is_unread,
  cc.priority,
  cc.attachments,
  cc.created_at,
  cc.updated_at,
  cp.name AS project_name
FROM public.client_communications cc
LEFT JOIN public.client_projects cp ON cp.id = cc.project_id;

-- 5) RPC functions (SQL as your API)
-- Return projects for the current user (optionally filtered by status)
CREATE OR REPLACE FUNCTION public.get_client_projects(status_filter text DEFAULT NULL)
RETURNS SETOF public.v_client_projects_for_user
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.v_client_projects_for_user
  WHERE user_id = auth.uid()
    AND (status_filter IS NULL OR status = status_filter)
  ORDER BY created_at DESC;
$$;

-- Return recent communications for the current user (optional project scope)
CREATE OR REPLACE FUNCTION public.get_recent_communications(limit_count integer DEFAULT 10, project_id uuid DEFAULT NULL)
RETURNS SETOF public.v_client_communications_for_user
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.v_client_communications_for_user
  WHERE user_id = auth.uid()
    AND (project_id IS NULL OR project_id = $2)
  ORDER BY created_at DESC
  LIMIT GREATEST(1, limit_count);
$$;

-- Mark a communication as read (only for its owner)
CREATE OR REPLACE FUNCTION public.mark_communication_read(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE public.client_communications
  SET is_unread = FALSE, updated_at = now()
  WHERE id = p_id AND user_id = auth.uid();

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count > 0;
END;
$$;

-- 6) Permissions for views and functions
GRANT SELECT ON public.v_client_projects_for_user TO authenticated;
GRANT SELECT ON public.v_client_communications_for_user TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_client_projects(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_communications(integer, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_communication_read(uuid) TO authenticated;
