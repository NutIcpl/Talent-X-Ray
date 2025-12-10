-- Step 1: Create employment_records table
CREATE TABLE IF NOT EXISTS public.employment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  period_time TEXT,
  company TEXT,
  position TEXT,
  responsibilities TEXT,
  salary NUMERIC,
  reason_for_leaving TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 2: Enable RLS
ALTER TABLE public.employment_records ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies
CREATE POLICY "Allow all for authenticated users"
  ON public.employment_records
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Step 4: Create index
CREATE INDEX idx_employment_records_candidate_id ON public.employment_records(candidate_id);

-- Step 5: Create trigger for updated_at
CREATE TRIGGER on_employment_records_updated
  BEFORE UPDATE ON public.employment_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
