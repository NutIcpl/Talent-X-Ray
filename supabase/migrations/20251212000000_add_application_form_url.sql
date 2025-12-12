-- Add application_form_url column to candidate_details table
-- This column stores the URL to the HTML version of the job application form

ALTER TABLE public.candidate_details
ADD COLUMN IF NOT EXISTS application_form_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.candidate_details.application_form_url IS 'URL to the HTML version of the job application form stored in Supabase Storage';

-- Create storage bucket for application forms (HTML files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'application-forms',
  'application-forms',
  true,
  5242880, -- 5MB limit
  ARRAY['text/html']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access for application-forms bucket
CREATE POLICY "Public can view application forms"
ON storage.objects FOR SELECT
USING (bucket_id = 'application-forms');

-- Allow anyone to upload application forms (for job applicants)
CREATE POLICY "Anyone can upload application forms"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'application-forms');
