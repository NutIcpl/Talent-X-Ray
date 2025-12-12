-- Create manager_invitations table for tracking sent invitations
CREATE TABLE IF NOT EXISTS public.manager_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(64) UNIQUE NOT NULL,
  manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Optional: can be null for manual email entry
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
