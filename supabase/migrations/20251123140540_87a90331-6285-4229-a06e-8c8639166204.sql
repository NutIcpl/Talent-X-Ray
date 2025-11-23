-- Add job_grade column to job_requisitions table
ALTER TABLE public.job_requisitions
ADD COLUMN job_grade text;

COMMENT ON COLUMN public.job_requisitions.job_grade IS 'Job grade level for the requisition';