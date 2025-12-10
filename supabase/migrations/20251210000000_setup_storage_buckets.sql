-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('resumes', 'resumes', true, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('profile-photos', 'profile-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('job-descriptions', 'job-descriptions', true, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create policies for job-descriptions bucket
CREATE POLICY "Allow public uploads for job-descriptions" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'job-descriptions');

CREATE POLICY "Allow public access for job-descriptions" ON storage.objects
FOR SELECT USING (bucket_id = 'job-descriptions');