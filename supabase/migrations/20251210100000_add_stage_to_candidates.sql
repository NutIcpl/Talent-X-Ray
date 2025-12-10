-- Add stage column to candidates table for tracking candidate status
-- This allows us to track candidate status even without an application

ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'Pending' 
CHECK (stage IN ('Pending', 'Interested', 'Shortlist', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_candidates_stage ON public.candidates(stage);

-- Update existing candidates to have 'Pending' stage if they don't have a stage
UPDATE public.candidates 
SET stage = 'Pending' 
WHERE stage IS NULL;
