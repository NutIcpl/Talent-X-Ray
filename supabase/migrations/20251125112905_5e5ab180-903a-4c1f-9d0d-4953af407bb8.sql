-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true);

-- RLS policies for resumes bucket
CREATE POLICY "Anyone can upload resumes"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can view resumes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');

CREATE POLICY "Users can update their own resumes"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'resumes');

CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'resumes');