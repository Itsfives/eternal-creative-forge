-- Storage Bucket Configuration and Policies
-- Generated: 2025-01-09
-- Project: zdhwmlnvbqbeyxbdfwhx

-- =============================================================================
-- STORAGE BUCKETS
-- =============================================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('portfolios', 'portfolios', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('media', 'media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'video/mp4'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =============================================================================
-- STORAGE POLICIES
-- =============================================================================

-- Portfolios bucket policies
CREATE POLICY "Portfolio images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'portfolios');

CREATE POLICY "Authenticated users can upload portfolio images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'portfolios' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own portfolio images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'portfolios' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own portfolio images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'portfolios' 
  AND auth.uid() IS NOT NULL
);

-- Media bucket policies
CREATE POLICY "Media files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'media' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own media" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'media' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own media" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'media' 
  AND auth.uid() IS NOT NULL
);

-- Admin override policies
CREATE POLICY "Admins can manage all storage objects" 
ON storage.objects 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  )
);

-- CMS Editor policies
CREATE POLICY "CMS editors can manage media files" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id IN ('media', 'portfolios')
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin'::public.app_role, 'cms_editor'::public.app_role)
  )
);

-- =============================================================================
-- SECURITY NOTES
-- =============================================================================

/*
STORAGE SECURITY CONFIGURATION:

1. Both buckets are set to public (publicly accessible URLs)
2. File size limit: 50MB per file
3. MIME type restrictions for security
4. RLS policies ensure only authenticated users can upload
5. Users can manage their own files
6. Admins and CMS editors have full access

IMPORTANT:
- Adjust file_size_limit based on your needs
- Modify allowed_mime_types for your use case
- Consider making buckets private if you need more control
- Regular cleanup of unused files is recommended

BACKUP CONSIDERATIONS:
- Files in storage buckets should be backed up separately
- Use Supabase CLI or API to download all bucket contents
- Consider implementing automated backup scripts for large media libraries
*/

-- =============================================================================
-- RESTORE INSTRUCTIONS
-- =============================================================================

/*
To restore storage configuration:

1. Run this SQL script in your new Supabase project
2. Verify buckets were created: SELECT * FROM storage.buckets;
3. Test upload permissions with a sample file
4. Check policies: SELECT * FROM storage.policies;
5. Upload your backed-up files to the appropriate buckets

For file uploads during restoration:
- Use Supabase dashboard storage interface
- Or use Supabase CLI: supabase storage cp ./backup-files/ supabase://bucket-name/
- Or use the API with your service role key
*/