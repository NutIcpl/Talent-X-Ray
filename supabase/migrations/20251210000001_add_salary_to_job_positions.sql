-- Add salary column to job_positions table
ALTER TABLE job_positions 
ADD COLUMN salary TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN job_positions.salary IS 'Salary information for the job position (e.g., "25,000-30,000 บาท", "ตามตกลง", "Negotiable")';

-- Update existing records to have default salary value
UPDATE job_positions 
SET salary = 'ตามตกลง' 
WHERE salary IS NULL;