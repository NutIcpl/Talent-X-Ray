-- Migration: Add 'interview_type' column to manager_invitation_candidates
-- Date: 2024-12-11
-- Purpose: Distinguish between first interview and final interview invitations

-- Add interview_type column to manager_invitation_candidates
ALTER TABLE public.manager_invitation_candidates
ADD COLUMN IF NOT EXISTS interview_type text DEFAULT 'first_interview';

-- Add check constraint for interview_type
ALTER TABLE public.manager_invitation_candidates
ADD CONSTRAINT manager_invitation_candidates_interview_type_check
CHECK (interview_type IN ('first_interview', 'final_interview'));

-- Add comment for documentation
COMMENT ON COLUMN public.manager_invitation_candidates.interview_type IS 'Type of interview: first_interview (initial screening) or final_interview (after passing first interview)';
