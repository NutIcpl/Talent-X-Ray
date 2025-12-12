-- Migration: Add 'pending' status to interviews table
-- Date: 2024-12-11
-- Purpose: Allow interview records to be created with 'pending' status
--          when Manager selects time slots before Admin confirms

-- Drop the existing constraint on status
ALTER TABLE public.interviews
DROP CONSTRAINT IF EXISTS interviews_status_check;

-- Add new constraint with 'pending' status
ALTER TABLE public.interviews
ADD CONSTRAINT interviews_status_check
CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled'));

-- Also add 'rejected' and 'not_interested' to result column for interview outcomes
ALTER TABLE public.interviews
DROP CONSTRAINT IF EXISTS interviews_result_check;

ALTER TABLE public.interviews
ADD CONSTRAINT interviews_result_check
CHECK (result IN ('passed', 'failed', 'rejected', 'not_interested'));

-- Add comment for documentation
COMMENT ON COLUMN public.interviews.status IS 'Interview status: pending (waiting for Admin to confirm time), scheduled (time confirmed), completed, cancelled';
