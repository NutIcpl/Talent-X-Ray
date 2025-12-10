-- Add ai_fit_score and ai_fit_reasoning columns to applications table
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS ai_fit_score INTEGER,
ADD COLUMN IF NOT EXISTS ai_fit_reasoning TEXT;

-- Add comment to describe the columns
COMMENT ON COLUMN public.applications.ai_fit_score IS 'AI-calculated fit score (0-100) between candidate and job position';
COMMENT ON COLUMN public.applications.ai_fit_reasoning IS 'AI-generated reasoning for the fit score';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_applications_ai_fit_score ON public.applications(ai_fit_score DESC);
