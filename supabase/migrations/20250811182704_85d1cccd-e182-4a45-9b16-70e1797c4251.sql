-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_company TEXT,
  client_position TEXT,
  testimonial_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  project_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for testimonials
CREATE POLICY "Testimonials are viewable by everyone" 
ON public.testimonials 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert testimonials" 
ON public.testimonials 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials" 
ON public.testimonials 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete testimonials" 
ON public.testimonials 
FOR DELETE 
TO authenticated
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create site_settings table for configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site_settings
CREATE POLICY "Site settings are viewable by authenticated users" 
ON public.site_settings 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can manage site settings" 
ON public.site_settings 
FOR ALL 
TO authenticated
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, description) VALUES
('site_title', '"Eternals Studio"', 'Main site title'),
('site_description', '"Creative digital studio specializing in web development and design"', 'Site meta description'),
('contact_email', '"info@eternals-studio.com"', 'Primary contact email'),
('social_media', '{"youtube": "https://www.youtube.com/@eternals_studio", "instagram": "", "linkedin": "", "twitter": ""}', 'Social media links'),
('seo_keywords', '["web development", "design", "creative studio", "digital agency"]', 'SEO keywords'),
('analytics_enabled', 'true', 'Enable analytics tracking'),
('maintenance_mode', 'false', 'Site maintenance mode');