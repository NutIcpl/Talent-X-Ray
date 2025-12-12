-- =============================================
-- CORE-FIT Full Database Schema
-- Generated for new Supabase project setup
-- =============================================

-- =============================================
-- PART 1: ENUMS
-- =============================================

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'hr_manager', 'recruiter', 'interviewer', 'viewer', 'manager', 'ceo', 'candidate');

-- =============================================
-- PART 2: UTILITY FUNCTIONS
-- =============================================

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================
-- PART 3: PROFILES AND USER ROLES
-- =============================================

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT,
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create function to check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create trigger for profiles
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, department)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'ผู้ใช้ใหม่'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'department', '')
  );

  -- Assign default role (interviewer) for new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'interviewer');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- PART 4: ROLE PERMISSIONS
-- =============================================

CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  resource text NOT NULL,
  action text NOT NULL,
  allowed boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(role, resource, action)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view role permissions"
ON public.role_permissions FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert role permissions"
ON public.role_permissions FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update role permissions"
ON public.role_permissions FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete role permissions"
ON public.role_permissions FOR DELETE
USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_role_permissions_updated_at
BEFORE UPDATE ON public.role_permissions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- PART 5: JOB REQUISITIONS
-- =============================================

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
  job_grade TEXT,
  jd_file_url TEXT,
  requisition_form_url TEXT,
  job_duties TEXT,
  salary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.requisition_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisition_id UUID REFERENCES public.job_requisitions(id) ON DELETE CASCADE NOT NULL,
  approver_id UUID REFERENCES public.profiles(id) NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'commented')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.job_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requisition_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view requisitions"
  ON public.job_requisitions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create requisitions"
  ON public.job_requisitions FOR INSERT
  TO authenticated
  WITH CHECK (requested_by = auth.uid());

CREATE POLICY "Users can update own pending requisitions"
  ON public.job_requisitions FOR UPDATE
  TO authenticated
  USING (requested_by = auth.uid() AND status = 'pending');

CREATE POLICY "Admins and HR can update requisitions"
  ON public.job_requisitions FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr_manager')
  );

CREATE POLICY "Users can delete own pending requisitions"
  ON public.job_requisitions FOR DELETE
  TO authenticated
  USING (requested_by = auth.uid() AND status = 'pending');

CREATE POLICY "Anyone can view approval history"
  ON public.requisition_approvals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and HR can add approvals"
  ON public.requisition_approvals FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr_manager')
  );

CREATE TRIGGER on_job_requisitions_updated
  BEFORE UPDATE ON public.job_requisitions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

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

CREATE INDEX idx_job_requisitions_status ON public.job_requisitions(status);
CREATE INDEX idx_job_requisitions_requested_by ON public.job_requisitions(requested_by);
CREATE INDEX idx_requisition_approvals_requisition_id ON public.requisition_approvals(requisition_id);

-- =============================================
-- PART 6: JOB POSITIONS
-- =============================================

CREATE TABLE public.job_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filled', 'closed')),
  required_count INTEGER DEFAULT 1 CHECK (required_count > 0),
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary TEXT,
  location TEXT,
  job_grade TEXT,
  employment_type TEXT DEFAULT 'Full-time',
  responsibilities TEXT,
  requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.job_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR and managers can view positions"
ON public.job_positions FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role) OR
  has_role(auth.uid(), 'recruiter'::app_role)
);

CREATE POLICY "HR and managers can insert positions"
ON public.job_positions FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role)
);

CREATE POLICY "HR and managers can update positions"
ON public.job_positions FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role)
);

CREATE TRIGGER update_job_positions_updated_at
BEFORE UPDATE ON public.job_positions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_job_positions_status ON public.job_positions(status);
CREATE INDEX idx_job_positions_department ON public.job_positions(department);

-- =============================================
-- PART 7: CANDIDATES
-- =============================================

CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  source TEXT NOT NULL CHECK (source IN ('LinkedIn', 'Website', 'Referral', 'Job Board', 'Other')),
  ai_fit_score INTEGER CHECK (ai_fit_score >= 0 AND ai_fit_score <= 100),
  resume_url TEXT,
  photo_url TEXT,
  stage TEXT DEFAULT 'Pending' CHECK (stage IN ('Pending', 'Interested', 'Shortlist', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR and recruiters can view candidates"
ON public.candidates FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role) OR
  has_role(auth.uid(), 'recruiter'::app_role) OR
  has_role(auth.uid(), 'interviewer'::app_role)
);

CREATE POLICY "HR and recruiters can insert candidates"
ON public.candidates FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'recruiter'::app_role)
);

CREATE POLICY "HR and recruiters can update candidates"
ON public.candidates FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'recruiter'::app_role)
);

CREATE POLICY "Public can insert candidates from job application"
ON public.candidates
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Public can update candidates by email"
ON public.candidates
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_candidates_updated_at
BEFORE UPDATE ON public.candidates
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_candidates_source ON public.candidates(source);
CREATE INDEX idx_candidates_stage ON public.candidates(stage);

-- =============================================
-- PART 8: CANDIDATE DETAILS
-- =============================================

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

  -- Test Scores
  hr_test_score INTEGER,
  department_test_score INTEGER,

  -- Privacy consent
  privacy_consent BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_candidate_details_candidate_id ON public.candidate_details(candidate_id);

ALTER TABLE public.candidate_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert candidate details"
ON public.candidate_details
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update candidate details"
ON public.candidate_details
FOR UPDATE
USING (true)
WITH CHECK (true);

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

CREATE TRIGGER update_candidate_details_updated_at
BEFORE UPDATE ON public.candidate_details
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- PART 9: EMPLOYMENT RECORDS
-- =============================================

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

ALTER TABLE public.employment_records ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX idx_employment_records_candidate_id ON public.employment_records(candidate_id);

CREATE TRIGGER on_employment_records_updated
  BEFORE UPDATE ON public.employment_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- PART 10: APPLICATIONS
-- =============================================

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  position_id UUID REFERENCES public.job_positions(id) ON DELETE CASCADE NOT NULL,
  stage TEXT NOT NULL DEFAULT 'New' CHECK (stage IN ('New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected')),
  applied_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  ai_fit_score INTEGER,
  ai_fit_reasoning TEXT,
  UNIQUE(candidate_id, position_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR and recruiters can view applications"
ON public.applications FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role) OR
  has_role(auth.uid(), 'recruiter'::app_role) OR
  has_role(auth.uid(), 'interviewer'::app_role)
);

CREATE POLICY "HR and recruiters can insert applications"
ON public.applications FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'recruiter'::app_role)
);

CREATE POLICY "HR and recruiters can update applications"
ON public.applications FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'recruiter'::app_role)
);

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX idx_applications_position_id ON public.applications(position_id);
CREATE INDEX idx_applications_stage ON public.applications(stage);
CREATE INDEX idx_applications_ai_fit_score ON public.applications(ai_fit_score DESC);

-- =============================================
-- PART 11: INTERVIEWS
-- =============================================

CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  interviewer_id UUID REFERENCES public.profiles(id),
  scheduled_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  result TEXT CHECK (result IN ('passed', 'failed')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR and interviewers can view interviews"
ON public.interviews FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role) OR
  has_role(auth.uid(), 'recruiter'::app_role) OR
  has_role(auth.uid(), 'interviewer'::app_role)
);

CREATE POLICY "HR and recruiters can insert interviews"
ON public.interviews FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'recruiter'::app_role)
);

CREATE POLICY "HR and interviewers can update interviews"
ON public.interviews FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'recruiter'::app_role) OR
  (has_role(auth.uid(), 'interviewer'::app_role) AND interviewer_id = auth.uid())
);

CREATE TRIGGER update_interviews_updated_at
BEFORE UPDATE ON public.interviews
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_interviews_application_id ON public.interviews(application_id);
CREATE INDEX idx_interviews_interviewer_id ON public.interviews(interviewer_id);

-- =============================================
-- PART 12: RECRUITMENT COSTS
-- =============================================

CREATE TABLE public.recruitment_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CHECK (period_end >= period_start)
);

ALTER TABLE public.recruitment_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR and managers can view costs"
ON public.recruitment_costs FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role)
);

CREATE POLICY "HR and managers can insert costs"
ON public.recruitment_costs FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role)
);

CREATE POLICY "HR and managers can update costs"
ON public.recruitment_costs FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role)
);

-- =============================================
-- PART 13: NOTIFICATIONS
-- =============================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('status_change', 'interview', 'candidate', 'general')),
  candidate_name TEXT,
  old_status TEXT,
  new_status TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "HR and recruiters can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'hr_manager'::app_role) OR
  has_role(auth.uid(), 'recruiter'::app_role)
);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
USING (user_id = auth.uid());

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- =============================================
-- PART 14: COMPANY SETTINGS
-- =============================================

CREATE TABLE IF NOT EXISTS public.company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text,
  company_email text,
  microsoft_365_connected boolean DEFAULT false,
  microsoft_365_token text,
  ai_fit_score_weights jsonb DEFAULT '{"skills": 40, "experience": 25, "projects": 15, "education": 10, "other": 10}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and HR can view settings"
  ON public.company_settings
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'hr_manager'::app_role)
  );

CREATE POLICY "Admins and HR can update settings"
  ON public.company_settings
  FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'hr_manager'::app_role)
  );

CREATE POLICY "Admins and HR can insert settings"
  ON public.company_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'hr_manager'::app_role)
  );

CREATE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default settings
INSERT INTO public.company_settings (company_name, company_email)
VALUES ('บริษัท ABC จำกัด', 'hr@company.com')
ON CONFLICT DO NOTHING;

-- =============================================
-- PART 15: STORAGE BUCKETS
-- =============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('resumes', 'resumes', true, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('profile-photos', 'profile-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('job-descriptions', 'job-descriptions', true, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for resumes bucket
CREATE POLICY "Anyone can upload resumes"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can view resumes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');

CREATE POLICY "Users can update their own resumes"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'resumes');

CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'resumes');

CREATE POLICY "Public can upload resumes"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'resumes');

-- Storage policies for profile-photos bucket
CREATE POLICY "Anyone can upload profile photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Anyone can view profile photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "Public can upload profile photos"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'profile-photos');

-- Storage policies for job-descriptions bucket
CREATE POLICY "Allow public uploads for job-descriptions" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'job-descriptions');

CREATE POLICY "Allow public access for job-descriptions" ON storage.objects
FOR SELECT USING (bucket_id = 'job-descriptions');

CREATE POLICY "Authenticated users can view JD files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'job-descriptions'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can upload their own JD files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'job-descriptions'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own JD files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'job-descriptions'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admins and HR can delete JD files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'job-descriptions'
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role))
);

-- =============================================
-- PART 16: MANAGER INVITATIONS
-- =============================================

-- Create manager_invitations table for tracking sent invitations
CREATE TABLE IF NOT EXISTS public.manager_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(64) UNIQUE NOT NULL,
  manager_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  manager_email TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  sent_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'responded', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create manager_invitation_candidates junction table
CREATE TABLE IF NOT EXISTS public.manager_invitation_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES public.manager_invitations(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  position TEXT,
  ai_score INTEGER,
  pre_screen_comment TEXT,
  manager_response TEXT CHECK (manager_response IN ('interested', 'not_interested', 'pending')),
  time_slot_1 TIMESTAMP WITH TIME ZONE,
  time_slot_2 TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(invitation_id, candidate_id)
);

-- Enable RLS
ALTER TABLE public.manager_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_invitation_candidates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for manager_invitations
CREATE POLICY "Authenticated users can view invitations"
  ON public.manager_invitations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "HR can create invitations"
  ON public.manager_invitations FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'hr_manager'::app_role) OR
    has_role(auth.uid(), 'recruiter'::app_role)
  );

CREATE POLICY "Anyone can update invitations by token"
  ON public.manager_invitations FOR UPDATE
  USING (true);

-- RLS Policies for manager_invitation_candidates
CREATE POLICY "Authenticated users can view invitation candidates"
  ON public.manager_invitation_candidates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "HR can create invitation candidates"
  ON public.manager_invitation_candidates FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'hr_manager'::app_role) OR
    has_role(auth.uid(), 'recruiter'::app_role)
  );

CREATE POLICY "Anyone can update invitation candidates"
  ON public.manager_invitation_candidates FOR UPDATE
  USING (true);

-- Allow anonymous access for manager portal (token-based)
CREATE POLICY "Anonymous can view invitations by token"
  ON public.manager_invitations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous can update invitations"
  ON public.manager_invitations FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Anonymous can view invitation candidates"
  ON public.manager_invitation_candidates FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous can update invitation candidates"
  ON public.manager_invitation_candidates FOR UPDATE
  TO anon
  USING (true);

-- Indexes
CREATE INDEX idx_manager_invitations_token ON public.manager_invitations(token);
CREATE INDEX idx_manager_invitations_manager_id ON public.manager_invitations(manager_id);
CREATE INDEX idx_manager_invitations_status ON public.manager_invitations(status);
CREATE INDEX idx_manager_invitation_candidates_invitation_id ON public.manager_invitation_candidates(invitation_id);

-- Trigger for updated_at
CREATE TRIGGER on_manager_invitations_updated
  BEFORE UPDATE ON public.manager_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- END OF SCHEMA
-- =============================================
