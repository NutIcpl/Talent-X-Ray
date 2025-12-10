-- Create employment_records table
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

-- Enable RLS
ALTER TABLE public.employment_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to view employment records"
  ON public.employment_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert employment records"
  ON public.employment_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update employment records"
  ON public.employment_records FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete employment records"
  ON public.employment_records FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_employment_records_candidate_id ON public.employment_records(candidate_id);

-- Create trigger for updated_at
CREATE TRIGGER on_employment_records_updated
  BEFORE UPDATE ON public.employment_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data for testing (optional - remove in production)
-- This assumes you have a candidate with this ID, adjust as needed
INSERT INTO public.employment_records (candidate_id, period_time, company, position, responsibilities, salary, reason_for_leaving)
SELECT 
  c.id,
  '2020-2023 (3 ปี)',
  'ABC Technology Co., Ltd.',
  'Senior Software Engineer',
  'พัฒนาระบบ Web Application ด้วย React และ Node.js
- ออกแบบและพัฒนา RESTful API
- ทำงานร่วมกับทีม UX/UI Designer
- Code Review และ Mentoring Junior Developer',
  45000,
  'ต้องการความก้าวหน้าในสายงาน'
FROM public.candidates c
WHERE c.email = 'pmetheechutikul@gmail.com'
LIMIT 1;

INSERT INTO public.employment_records (candidate_id, period_time, company, position, responsibilities, salary, reason_for_leaving)
SELECT 
  c.id,
  '2018-2020 (2 ปี)',
  'XYZ Solutions Ltd.',
  'Software Developer',
  'พัฒนาและดูแลระบบ ERP
- แก้ไข Bug และปรับปรุงระบบ
- ทำงานร่วมกับทีม QA
- เขียน Documentation',
  35000,
  'ต้องการเรียนรู้เทคโนโลยีใหม่'
FROM public.candidates c
WHERE c.email = 'pmetheechutikul@gmail.com'
LIMIT 1;
