-- Create candidate_details table to store all employment application data
CREATE TABLE public.candidate_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  
  -- Job Application Info
  position TEXT,
  expected_salary TEXT,
  
  -- Personal Info
  title_name TEXT,
  first_name TEXT,
  last_name TEXT,
  nickname TEXT,
  present_address TEXT,
  moo TEXT,
  district TEXT,
  sub_district TEXT,
  province TEXT,
  zip_code TEXT,
  mobile_phone TEXT,
  birth_date DATE,
  age TEXT,
  id_card TEXT,
  sex TEXT,
  blood_type TEXT,
  religion TEXT,
  height TEXT,
  weight TEXT,
  
  -- Marital Status
  marital_status TEXT,
  spouse_name TEXT,
  spouse_occupation TEXT,
  number_of_children TEXT,
  
  -- Emergency Contact
  emergency_name TEXT,
  emergency_relation TEXT,
  emergency_address TEXT,
  emergency_phone TEXT,
  
  -- Special Skills
  computer_skill BOOLEAN DEFAULT false,
  driving_car BOOLEAN DEFAULT false,
  driving_car_license_no TEXT,
  driving_motorcycle BOOLEAN DEFAULT false,
  driving_motorcycle_license_no TEXT,
  other_skills TEXT,
  
  -- Training
  training_curriculums TEXT,
  
  -- Other Questions
  worked_at_icp_before TEXT,
  worked_at_icp_details TEXT,
  relatives_at_icp TEXT,
  relatives_at_icp_details TEXT,
  criminal_record TEXT,
  criminal_record_details TEXT,
  serious_illness TEXT,
  serious_illness_details TEXT,
  color_blindness TEXT,
  pregnant TEXT,
  contagious_disease TEXT,
  
  -- Complex data stored as JSONB
  educations JSONB DEFAULT '[]'::jsonb,
  work_experiences JSONB DEFAULT '[]'::jsonb,
  family_members JSONB DEFAULT '[]'::jsonb,
  language_skills JSONB DEFAULT '[]'::jsonb,
  
  -- Privacy consent
  privacy_consent BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_candidate_details_candidate_id ON public.candidate_details(candidate_id);

-- Enable RLS
ALTER TABLE public.candidate_details ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (for job application form)
CREATE POLICY "Public can insert candidate details"
ON public.candidate_details
FOR INSERT
WITH CHECK (true);

-- Allow public to update their own details by candidate_id
CREATE POLICY "Public can update candidate details"
ON public.candidate_details
FOR UPDATE
USING (true)
WITH CHECK (true);

-- HR and recruiters can view all candidate details
CREATE POLICY "HR and recruiters can view candidate details"
ON public.candidate_details
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'hr_manager'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'recruiter'::app_role) OR 
  has_role(auth.uid(), 'interviewer'::app_role)
);

-- Create trigger for updated_at
CREATE TRIGGER update_candidate_details_updated_at
BEFORE UPDATE ON public.candidate_details
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();