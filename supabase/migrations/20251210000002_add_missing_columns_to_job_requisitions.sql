-- Add missing columns to job_requisitions table
ALTER TABLE job_requisitions 
ADD COLUMN IF NOT EXISTS jd_file_url TEXT,
ADD COLUMN IF NOT EXISTS requisition_form_url TEXT,
ADD COLUMN IF NOT EXISTS job_grade TEXT,
ADD COLUMN IF NOT EXISTS job_duties TEXT,
ADD COLUMN IF NOT EXISTS salary TEXT;

-- Add comments to describe the columns
COMMENT ON COLUMN job_requisitions.jd_file_url IS 'URL path to uploaded Job Description file';
COMMENT ON COLUMN job_requisitions.requisition_form_url IS 'URL path to uploaded Requisition Form file';
COMMENT ON COLUMN job_requisitions.job_grade IS 'Job Grade level (e.g., JG 1.1 Staff, JG 2.1 Senior)';
COMMENT ON COLUMN job_requisitions.job_duties IS 'Detailed job duties and responsibilities';
COMMENT ON COLUMN job_requisitions.salary IS 'Salary information (e.g., "25,000-30,000 บาท", "ตามตกลง", "Negotiable")';