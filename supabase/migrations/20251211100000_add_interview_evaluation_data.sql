-- Migration: Add interview_evaluation_data column and update manager_response constraint
-- Date: 2024-12-11

-- Add interview_evaluation_data column to store evaluation data as JSONB
ALTER TABLE public.manager_invitation_candidates
ADD COLUMN IF NOT EXISTS interview_evaluation_data JSONB;

-- Drop the existing constraint on manager_response
ALTER TABLE public.manager_invitation_candidates
DROP CONSTRAINT IF EXISTS manager_invitation_candidates_manager_response_check;

-- Add new constraint with 'evaluated' status
ALTER TABLE public.manager_invitation_candidates
ADD CONSTRAINT manager_invitation_candidates_manager_response_check
CHECK (manager_response IN ('interested', 'not_interested', 'pending', 'evaluated'));

-- Add comment for documentation
COMMENT ON COLUMN public.manager_invitation_candidates.interview_evaluation_data IS 'JSON data containing interview evaluation: interviewDate, result (passed/failed), score, feedback, strengths, weaknesses, recommendation';
