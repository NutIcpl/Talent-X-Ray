-- Create job_requisitions table
CREATE TABLE public.job_requisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisition_number TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  position TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  date_needed DATE NOT NULL,
  work_location TEXT NOT NULL,
  reports_to TEXT NOT NULL,
  hiring_type TEXT NOT NULL CHECK (hiring_type IN ('replacement', 'permanent', 'temporary')),
  replacement_for TEXT,
  replacement_date DATE,
  temporary_duration TEXT,
  justification TEXT NOT NULL,
  job_description_no TEXT,
  gender TEXT,
  max_age TEXT,
  min_experience TEXT,
  min_education TEXT,
  field_of_study TEXT,
  other_skills TEXT,
  marital_status TEXT,
  experience_in TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create requisition_approvals table for approval history
CREATE TABLE public.requisition_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisition_id UUID REFERENCES public.job_requisitions(id) ON DELETE CASCADE NOT NULL,
  approver_id UUID REFERENCES public.profiles(id) NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'commented')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requisition_approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_requisitions
-- All authenticated users can view requisitions
CREATE POLICY "Anyone can view requisitions"
  ON public.job_requisitions FOR SELECT
  TO authenticated
  USING (true);

-- Users can create requisitions
CREATE POLICY "Users can create requisitions"
  ON public.job_requisitions FOR INSERT
  TO authenticated
  WITH CHECK (requested_by = auth.uid());

-- Users can update their own pending requisitions
CREATE POLICY "Users can update own pending requisitions"
  ON public.job_requisitions FOR UPDATE
  TO authenticated
  USING (requested_by = auth.uid() AND status = 'pending');

-- Admins and HR managers can update any requisition
CREATE POLICY "Admins and HR can update requisitions"
  ON public.job_requisitions FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'hr_manager')
  );

-- Users can delete their own pending requisitions
CREATE POLICY "Users can delete own pending requisitions"
  ON public.job_requisitions FOR DELETE
  TO authenticated
  USING (requested_by = auth.uid() AND status = 'pending');

-- RLS Policies for requisition_approvals
-- All authenticated users can view approval history
CREATE POLICY "Anyone can view approval history"
  ON public.requisition_approvals FOR SELECT
  TO authenticated
  USING (true);

-- Admins and HR managers can add approval records
CREATE POLICY "Admins and HR can add approvals"
  ON public.requisition_approvals FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'hr_manager')
  );

-- Create trigger for updated_at
CREATE TRIGGER on_job_requisitions_updated
  BEFORE UPDATE ON public.job_requisitions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to generate requisition number
CREATE OR REPLACE FUNCTION public.generate_requisition_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  year_part TEXT;
BEGIN
  year_part := TO_CHAR(now(), 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(requisition_number FROM 8) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.job_requisitions
  WHERE requisition_number LIKE 'REQ-' || year_part || '%';
  
  RETURN 'REQ-' || year_part || LPAD(next_num::TEXT, 4, '0');
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_job_requisitions_status ON public.job_requisitions(status);
CREATE INDEX idx_job_requisitions_requested_by ON public.job_requisitions(requested_by);
CREATE INDEX idx_requisition_approvals_requisition_id ON public.requisition_approvals(requisition_id);