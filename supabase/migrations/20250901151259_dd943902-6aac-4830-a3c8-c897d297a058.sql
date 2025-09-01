-- Create client_projects table
CREATE TABLE public.client_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning',
  progress INTEGER NOT NULL DEFAULT 0,
  deadline DATE,
  phase TEXT,
  next_milestone TEXT,
  team_lead TEXT,
  client_company TEXT,
  budget INTEGER,
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT progress_range CHECK (progress >= 0 AND progress <= 100),
  CONSTRAINT valid_status CHECK (status IN ('planning', 'in-progress', 'on-hold', 'completed', 'cancelled')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

-- Create client_communications table
CREATE TABLE public.client_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.client_projects(id) ON DELETE SET NULL,
  from_user_id UUID,
  from_name TEXT NOT NULL,
  from_role TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'general',
  is_unread BOOLEAN NOT NULL DEFAULT true,
  priority TEXT NOT NULL DEFAULT 'normal',
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_message_type CHECK (message_type IN ('general', 'milestone', 'feedback_request', 'approval_needed')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- Enable RLS on both tables
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_communications ENABLE ROW LEVEL SECURITY;

-- RLS policies for client_projects
CREATE POLICY "Clients can view their own projects"
ON public.client_projects
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins and CMS editors can view all projects"
ON public.client_projects
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'cms_editor'));

CREATE POLICY "Admins and CMS editors can create projects"
ON public.client_projects
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'cms_editor'));

CREATE POLICY "Admins and CMS editors can update projects"
ON public.client_projects
FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'cms_editor'));

CREATE POLICY "Admins and CMS editors can delete projects"
ON public.client_projects
FOR DELETE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'cms_editor'));

-- RLS policies for client_communications
CREATE POLICY "Clients can view their own communications"
ON public.client_communications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins and CMS editors can view all communications"
ON public.client_communications
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'cms_editor'));

CREATE POLICY "Admins and CMS editors can create communications"
ON public.client_communications
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'cms_editor'));

CREATE POLICY "Clients can mark their own messages as read"
ON public.client_communications
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and CMS editors can update communications"
ON public.client_communications
FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'cms_editor'));

CREATE POLICY "Admins and CMS editors can delete communications"
ON public.client_communications
FOR DELETE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'cms_editor'));

-- Create triggers for updated_at columns
CREATE TRIGGER update_client_projects_updated_at
BEFORE UPDATE ON public.client_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_communications_updated_at
BEFORE UPDATE ON public.client_communications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_client_projects_user_id ON public.client_projects(user_id);
CREATE INDEX idx_client_projects_status ON public.client_projects(status);
CREATE INDEX idx_client_communications_user_id ON public.client_communications(user_id);
CREATE INDEX idx_client_communications_project_id ON public.client_communications(project_id);
CREATE INDEX idx_client_communications_unread ON public.client_communications(is_unread);
CREATE INDEX idx_client_communications_created_at ON public.client_communications(created_at DESC);