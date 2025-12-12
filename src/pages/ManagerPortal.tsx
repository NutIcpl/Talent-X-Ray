import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ClipboardCheck,
} from "lucide-react";
import { ManagerCandidateDetailDialog } from "@/components/candidates/ManagerCandidateDetailDialog";
import { ManagerTimeSlotDialog } from "@/components/candidates/ManagerTimeSlotDialog";
import { ManagerFirstInterviewDialog, FirstInterviewEvaluationData } from "@/components/candidates/ManagerFirstInterviewDialog";
import { ManagerFinalInterviewDialog } from "@/components/candidates/ManagerFinalInterviewDialog";

interface InvitationCandidate {
  id: string;
  candidate_id: string;
  position: string;
  ai_score: number;
  pre_screen_comment: string | null;
  manager_response: 'pending' | 'interested' | 'not_interested' | 'evaluated';
  time_slot_1: string | null;
  time_slot_2: string | null;
  responded_at: string | null;
  interview_evaluation_data: FirstInterviewEvaluationData | null;
  interview_type: 'first_interview' | 'final_interview';
  candidate: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    resume_url: string | null;
    photo_url: string | null;
  };
}

interface Invitation {
  id: string;
  token: string;
  manager_name: string;
  manager_email: string;
  expires_at: string;
  status: string;
  created_at: string;
}

export default function ManagerPortal() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [candidates, setCandidates] = useState<InvitationCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<InvitationCandidate | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showTimeSlotDialog, setShowTimeSlotDialog] = useState(false);
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch invitation data
  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) {
        setError("ไม่พบ Token กรุณาใช้ลิงก์ที่ได้รับจากอีเมล");
        setIsLoading(false);
        return;
      }

      try {
        // Get invitation by token (cast to any for new tables not in generated types)
        const { data: invitationData, error: invitationError } = await (supabase
          .from("manager_invitations" as any)
          .select("*")
          .eq("token", token)
          .single() as any);

        if (invitationError || !invitationData) {
          setError("ไม่พบข้อมูลคำเชิญ หรือลิงก์ไม่ถูกต้อง");
          setIsLoading(false);
          return;
        }

        // Check if expired
        if (new Date(invitationData.expires_at) < new Date()) {
          setError("ลิงก์นี้หมดอายุแล้ว กรุณาติดต่อ HR เพื่อขอลิงก์ใหม่");
          setIsLoading(false);
          return;
        }

        setInvitation(invitationData as Invitation);

        // Update status to viewed if pending
        if (invitationData.status === 'pending') {
          await (supabase
            .from("manager_invitations" as any)
            .update({ status: 'viewed' })
            .eq("id", invitationData.id) as any);
        }

        // Get invitation candidates with candidate details
        const { data: candidatesData, error: candidatesError } = await (supabase
          .from("manager_invitation_candidates" as any)
          .select(`
            *,
            candidate:candidates(id, name, email, phone, resume_url, photo_url)
          `)
          .eq("invitation_id", invitationData.id) as any);

        if (candidatesError) throw candidatesError;

        // Filter out candidates where the candidate relation is null (deleted candidates)
        const validCandidates = (candidatesData || []).filter((c: any) => c.candidate !== null);
        setCandidates(validCandidates as InvitationCandidate[]);
      } catch (err: any) {
        console.error("Error fetching invitation:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleViewDetail = (candidate: InvitationCandidate) => {
    setSelectedCandidate(candidate);
    setShowDetailDialog(true);
  };

  const handleScheduleInterview = (candidate: InvitationCandidate) => {
    setSelectedCandidate(candidate);
    setShowTimeSlotDialog(true);
  };

  const handleTimeSlotSubmit = async (timeSlot1: Date, timeSlot2: Date) => {
    if (!selectedCandidate) return;

    try {
      // Update invitation candidate with time slots
      const { error } = await (supabase
        .from("manager_invitation_candidates" as any)
        .update({
          manager_response: 'interested',
          time_slot_1: timeSlot1.toISOString(),
          time_slot_2: timeSlot2.toISOString(),
          responded_at: new Date().toISOString(),
        })
        .eq("id", selectedCandidate.id) as any);

      if (error) throw error;

      // Find or create application for this candidate
      let applicationId: string | null = null;

      // First, try to find existing application
      const { data: existingApp } = await supabase
        .from("applications")
        .select("id")
        .eq("candidate_id", selectedCandidate.candidate_id)
        .maybeSingle();

      if (existingApp) {
        applicationId = existingApp.id;
      } else {
        // Find job position by title to create application
        const { data: jobPosition } = await supabase
          .from("job_positions")
          .select("id")
          .ilike("title", `%${selectedCandidate.position}%`)
          .maybeSingle();

        if (jobPosition) {
          // Create new application
          const { data: newApp } = await supabase
            .from("applications")
            .insert({
              candidate_id: selectedCandidate.candidate_id,
              position_id: jobPosition.id,
              stage: "Interview",
              applied_at: new Date().toISOString(),
            })
            .select("id")
            .single();

          if (newApp) {
            applicationId = newApp.id;
          }
        } else {
          // If no job position found, create application with first available position
          const { data: firstPosition } = await supabase
            .from("job_positions")
            .select("id")
            .limit(1)
            .single();

          if (firstPosition) {
            const { data: newApp } = await supabase
              .from("applications")
              .insert({
                candidate_id: selectedCandidate.candidate_id,
                position_id: firstPosition.id,
                stage: "Interview",
                applied_at: new Date().toISOString(),
              })
              .select("id")
              .single();

            if (newApp) {
              applicationId = newApp.id;
            }
          }
        }
      }

      // Create or update interview record in interviews table
      // Check if this is a first interview or final interview
      const isFinalInterview = selectedCandidate.interview_type === 'final_interview';

      if (applicationId) {
        if (isFinalInterview) {
          // For Final Interview - update the existing Final Interview record
          // (created by SendToFinalInterviewDialog)
          const { data: existingInterviews } = await supabase
            .from("interviews")
            .select("id, notes")
            .eq("application_id", applicationId);

          // Find the existing final interview record
          const existingFinalInterview = existingInterviews?.find(i => {
            try {
              const notes = JSON.parse(i.notes || '{}');
              return notes.type === 'final_interview' && notes.waiting_for_manager;
            } catch {
              return false;
            }
          });

          if (existingFinalInterview) {
            // Update existing Final Interview record with time slots
            const existingNotes = JSON.parse(existingFinalInterview.notes || '{}');
            const { error: updateError } = await supabase
              .from("interviews")
              .update({
                status: 'pending', // Now it's pending admin confirmation
                notes: JSON.stringify({
                  ...existingNotes,
                  proposedSlots: [
                    { time: timeSlot1.toISOString(), label: 'ช่วงเวลาที่ 1' },
                    { time: timeSlot2.toISOString(), label: 'ช่วงเวลาที่ 2' },
                  ],
                  waiting_for_manager: false, // Manager has responded
                  manager_responded_at: new Date().toISOString(),
                }),
              })
              .eq("id", existingFinalInterview.id);

            if (updateError) {
              console.error("Could not update final interview record:", updateError);
              throw new Error("ไม่สามารถอัพเดทการสัมภาษณ์ได้: " + updateError.message);
            }
          } else {
            // No existing final interview, create new one (fallback)
            const { error: interviewError } = await supabase
              .from("interviews")
              .insert({
                application_id: applicationId,
                interviewer_id: null,
                scheduled_at: null,
                status: 'pending',
                notes: JSON.stringify({
                  candidate_id: selectedCandidate.candidate_id,
                  candidate_name: selectedCandidate.candidate?.name || 'ผู้สมัคร',
                  position: selectedCandidate.position,
                  proposedSlots: [
                    { time: timeSlot1.toISOString(), label: 'ช่วงเวลาที่ 1' },
                    { time: timeSlot2.toISOString(), label: 'ช่วงเวลาที่ 2' },
                  ],
                  source: 'manager_portal_final',
                  type: 'final_interview',
                  invitation_id: invitation?.id,
                  manager_name: invitation?.manager_name,
                  manager_email: invitation?.manager_email,
                }),
              });

            if (interviewError) {
              console.error("Could not create interview record:", interviewError);
              throw new Error("ไม่สามารถสร้างการสัมภาษณ์ได้: " + interviewError.message);
            }
          }
        } else {
          // For First Interview - create new interview record
          const { error: interviewError } = await supabase
            .from("interviews")
            .insert({
              application_id: applicationId,
              interviewer_id: null,
              scheduled_at: null, // Will be set when Admin confirms
              status: 'pending',
              notes: JSON.stringify({
                candidate_id: selectedCandidate.candidate_id,
                candidate_name: selectedCandidate.candidate?.name || 'ผู้สมัคร',
                position: selectedCandidate.position,
                proposedSlots: [
                  { time: timeSlot1.toISOString(), label: 'ช่วงเวลาที่ 1' },
                  { time: timeSlot2.toISOString(), label: 'ช่วงเวลาที่ 2' },
                ],
                source: 'manager_portal',
                type: 'first_interview',
                invitation_id: invitation?.id,
                manager_name: invitation?.manager_name,
                manager_email: invitation?.manager_email,
              }),
            });

          if (interviewError) {
            console.error("Could not create interview record:", interviewError);
            throw new Error("ไม่สามารถสร้างการสัมภาษณ์ได้: " + interviewError.message);
          }
        }
      } else {
        throw new Error("ไม่สามารถสร้าง Application ได้ กรุณาติดต่อ Admin");
      }

      // Update candidate stage to Interview
      await (supabase
        .from("candidates")
        .update({ stage: "Interview" } as any)
        .eq("id", selectedCandidate.candidate_id) as any);

      // Update local state
      setCandidates(prev =>
        prev.map(c =>
          c.id === selectedCandidate.id
            ? {
                ...c,
                manager_response: 'interested',
                time_slot_1: timeSlot1.toISOString(),
                time_slot_2: timeSlot2.toISOString(),
                responded_at: new Date().toISOString(),
              }
            : c
        )
      );

      const interviewTypeName = isFinalInterview ? 'Final Interview' : 'First Interview';
      toast({
        title: "บันทึกสำเร็จ",
        description: `นัดหมาย ${interviewTypeName} ${selectedCandidate.candidate?.name || 'ผู้สมัคร'} เรียบร้อยแล้ว`,
      });

      setShowTimeSlotDialog(false);
    } catch (err: any) {
      console.error("Error saving time slots:", err);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (candidate: InvitationCandidate) => {
    try {
      const { error } = await (supabase
        .from("manager_invitation_candidates" as any)
        .update({
          manager_response: 'not_interested',
          responded_at: new Date().toISOString(),
        })
        .eq("id", candidate.id) as any);

      if (error) throw error;

      // Update candidate stage to "Rejected" in candidates table
      await (supabase
        .from("candidates")
        .update({ stage: "Rejected" } as any)
        .eq("id", candidate.candidate_id) as any);

      setCandidates(prev =>
        prev.map(c =>
          c.id === candidate.id
            ? { ...c, manager_response: 'not_interested', responded_at: new Date().toISOString() }
            : c
        )
      );

      toast({
        title: "บันทึกสำเร็จ",
        description: `ไม่สนใจ ${candidate.candidate?.name || 'ผู้สมัคร'}`,
      });
    } catch (err: any) {
      console.error("Error rejecting candidate:", err);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
    }
  };

  const handleEvaluateInterview = (candidate: InvitationCandidate) => {
    setSelectedCandidate(candidate);
    setShowEvaluationDialog(true);
  };

  const handleSaveEvaluation = async (data: FirstInterviewEvaluationData) => {
    if (!selectedCandidate) return;

    try {
      // Update manager_invitation_candidates with evaluation data
      const { error } = await (supabase
        .from("manager_invitation_candidates" as any)
        .update({
          interview_evaluation_data: data,
        })
        .eq("id", selectedCandidate.id) as any);

      if (error) throw error;

      // Update local state
      setCandidates(prev =>
        prev.map(c =>
          c.id === selectedCandidate.id
            ? { ...c, interview_evaluation_data: data }
            : c
        )
      );

      toast({
        title: "บันทึกสำเร็จ",
        description: "บันทึกผลการประเมินเรียบร้อยแล้ว",
      });
    } catch (err: any) {
      console.error("Error saving evaluation:", err);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
    }
  };

  const handleSubmitEvaluation = async (data: FirstInterviewEvaluationData) => {
    if (!selectedCandidate) return;

    const isFinalInterview = selectedCandidate.interview_type === 'final_interview';

    try {
      // Update manager_invitation_candidates with evaluation data and mark as evaluated
      const { error } = await (supabase
        .from("manager_invitation_candidates" as any)
        .update({
          manager_response: 'evaluated',
          interview_evaluation_data: data,
        })
        .eq("id", selectedCandidate.id) as any);

      if (error) throw error;

      // Find the interview record and update it
      const { data: existingApp } = await supabase
        .from("applications")
        .select("id")
        .eq("candidate_id", selectedCandidate.candidate_id)
        .maybeSingle();

      if (existingApp) {
        const isPassed = data.result === 'passed';

        if (isFinalInterview) {
          // Final Interview - just update the interview record, no new interview created
          // Find the Final Interview record (has type: final_interview in notes)
          const { data: interviews } = await supabase
            .from("interviews")
            .select("id, notes")
            .eq("application_id", existingApp.id);

          // Find the final interview record
          const finalInterview = interviews?.find(i => {
            try {
              const notes = JSON.parse(i.notes || '{}');
              return notes.type === 'final_interview';
            } catch {
              return false;
            }
          });

          if (finalInterview) {
            const existingNotes = JSON.parse(finalInterview.notes || '{}');
            await supabase
              .from("interviews")
              .update({
                status: 'completed',
                result: isPassed ? 'passed' : 'rejected',
                score: data.totalScore,
                notes: JSON.stringify({
                  ...existingNotes,
                  evaluation: {
                    interviewDate: data.interviewDate,
                    scores: data.scores,
                    totalScore: data.totalScore,
                    result: data.result,
                    feedback: data.feedback,
                  },
                  waiting_for_manager: false,
                }),
              })
              .eq("id", finalInterview.id);
          }

          // Update candidate stage based on Final Interview result
          const newStage = isPassed ? 'Offer' : 'Not_Offer';
          await supabase
            .from("candidates")
            .update({ stage: newStage })
            .eq("id", selectedCandidate.candidate_id);
        } else {
          // First Interview - find the existing First Interview record and update it
          const { data: existingInterviews } = await supabase
            .from("interviews")
            .select("id, notes")
            .eq("application_id", existingApp.id);

          // Find the First Interview record (has type: first_interview in notes)
          const firstInterview = existingInterviews?.find(i => {
            try {
              const notes = JSON.parse(i.notes || '{}');
              return notes.type === 'first_interview' || notes.source === 'manager_portal';
            } catch {
              return false;
            }
          });

          if (firstInterview) {
            // Update existing First Interview record
            const existingNotes = JSON.parse(firstInterview.notes || '{}');
            await supabase
              .from("interviews")
              .update({
                status: 'completed',
                result: isPassed ? 'passed' : 'rejected',
                score: data.totalScore,
                notes: JSON.stringify({
                  ...existingNotes,
                  evaluation: {
                    interviewDate: data.interviewDate,
                    scores: data.scores,
                    totalScore: data.totalScore,
                    result: data.result,
                    feedback: data.feedback,
                  },
                  ...(isPassed ? {} : { rejection_reason: 'ไม่ผ่านการประเมิน First Interview (คะแนน < 45)' }),
                }),
              })
              .eq("id", firstInterview.id);
          }
          // Note: For First Interview, Final Interview is created via SendToFinalInterviewDialog
          // Do NOT auto-create Final Interview here to avoid duplicates
        }
      }

      // Update local state
      setCandidates(prev =>
        prev.map(c =>
          c.id === selectedCandidate.id
            ? { ...c, manager_response: 'evaluated', interview_evaluation_data: data }
            : c
        )
      );

      // Show appropriate success message
      let resultMessage: string;
      if (isFinalInterview) {
        resultMessage = data.result === 'passed'
          ? `ผ่าน Final Interview - พร้อมรับเข้าทำงาน`
          : `ไม่ผ่าน Final Interview`;
      } else {
        resultMessage = data.result === 'passed'
          ? `ผ่านการประเมิน First Interview`
          : `ไม่ผ่านการประเมิน First Interview`;
      }

      toast({
        title: "ส่งผลการประเมินสำเร็จ",
        description: `${selectedCandidate.candidate?.name || 'ผู้สมัคร'}: ${resultMessage}`,
      });
    } catch (err: any) {
      console.error("Error submitting evaluation:", err);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งข้อมูลได้",
        variant: "destructive",
      });
    }
  };

  // Filter candidates by response status
  const pendingCandidates = candidates.filter(c => c.manager_response === 'pending');
  const interestedCandidates = candidates.filter(c => c.manager_response === 'interested');
  const evaluatedCandidates = candidates.filter(c => c.manager_response === 'evaluated');
  const rejectedCandidates = candidates.filter(c => c.manager_response === 'not_interested');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">ไม่สามารถเข้าถึงได้</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Manager Portal</h1>
                <p className="text-sm text-muted-foreground">
                  สวัสดี, {invitation?.manager_name}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              หมดอายุ: {new Date(invitation?.expires_at || '').toLocaleDateString('th-TH')}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              ผู้สมัครที่รอการพิจารณา ({candidates.length} คน)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="h-4 w-4" />
                  รอพิจารณา ({pendingCandidates.length})
                </TabsTrigger>
                <TabsTrigger value="interested" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  สนใจ ({interestedCandidates.length})
                </TabsTrigger>
                <TabsTrigger value="evaluated" className="gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  ประเมินแล้ว ({evaluatedCandidates.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="gap-2">
                  <XCircle className="h-4 w-4" />
                  ไม่สนใจ ({rejectedCandidates.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <CandidateList
                  candidates={pendingCandidates}
                  onView={handleViewDetail}
                  onSchedule={handleScheduleInterview}
                  onReject={handleReject}
                  showActions
                />
              </TabsContent>

              <TabsContent value="interested">
                <CandidateList
                  candidates={interestedCandidates}
                  onView={handleViewDetail}
                  onEvaluate={handleEvaluateInterview}
                  showTimeSlots
                  showEvaluateButton
                />
              </TabsContent>

              <TabsContent value="evaluated">
                <CandidateList
                  candidates={evaluatedCandidates}
                  onView={handleViewDetail}
                  showTimeSlots
                  showEvaluationResult
                />
              </TabsContent>

              <TabsContent value="rejected">
                <CandidateList
                  candidates={rejectedCandidates}
                  onView={handleViewDetail}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      {selectedCandidate && (
        <>
          <ManagerCandidateDetailDialog
            open={showDetailDialog}
            onOpenChange={setShowDetailDialog}
            candidate={selectedCandidate}
          />
          <ManagerTimeSlotDialog
            open={showTimeSlotDialog}
            onOpenChange={setShowTimeSlotDialog}
            candidateName={selectedCandidate.candidate?.name || 'ผู้สมัคร'}
            onSubmit={handleTimeSlotSubmit}
          />
          {selectedCandidate.interview_type === 'final_interview' ? (
            <ManagerFinalInterviewDialog
              open={showEvaluationDialog}
              onOpenChange={setShowEvaluationDialog}
              candidateName={selectedCandidate.candidate?.name || 'ผู้สมัคร'}
              position={selectedCandidate.position}
              firstInterviewScore={selectedCandidate.ai_score}
              existingData={selectedCandidate.interview_evaluation_data || undefined}
              onSave={handleSaveEvaluation}
              onSubmitAndSend={handleSubmitEvaluation}
            />
          ) : (
            <ManagerFirstInterviewDialog
              open={showEvaluationDialog}
              onOpenChange={setShowEvaluationDialog}
              candidateName={selectedCandidate.candidate?.name || 'ผู้สมัคร'}
              position={selectedCandidate.position}
              existingData={selectedCandidate.interview_evaluation_data || undefined}
              onSave={handleSaveEvaluation}
              onSubmitAndSend={handleSubmitEvaluation}
            />
          )}
        </>
      )}
    </div>
  );
}

// Candidate List Component
function CandidateList({
  candidates,
  onView,
  onSchedule,
  onReject,
  onEvaluate,
  showActions = false,
  showTimeSlots = false,
  showEvaluateButton = false,
  showEvaluationResult = false,
}: {
  candidates: InvitationCandidate[];
  onView: (c: InvitationCandidate) => void;
  onSchedule?: (c: InvitationCandidate) => void;
  onReject?: (c: InvitationCandidate) => void;
  onEvaluate?: (c: InvitationCandidate) => void;
  showActions?: boolean;
  showTimeSlots?: boolean;
  showEvaluateButton?: boolean;
  showEvaluationResult?: boolean;
}) {
  if (candidates.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>ไม่มีผู้สมัครในหมวดนี้</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <div
          key={candidate.id}
          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Avatar className="h-14 w-14">
            <AvatarImage src={candidate.candidate?.photo_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {candidate.candidate?.name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{candidate.candidate?.name || 'ไม่ระบุชื่อ'}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {candidate.position}
            </p>
            {candidate.pre_screen_comment && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                Pre-Screen: {candidate.pre_screen_comment}
              </p>
            )}
            {showTimeSlots && candidate.time_slot_1 && (
              <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                <Calendar className="h-3 w-3" />
                <span>
                  ช่วง 1: {new Date(candidate.time_slot_1).toLocaleString('th-TH')}
                </span>
                {candidate.time_slot_2 && (
                  <span>
                    | ช่วง 2: {new Date(candidate.time_slot_2).toLocaleString('th-TH')}
                  </span>
                )}
              </div>
            )}
            {showEvaluationResult && candidate.interview_evaluation_data && (
              <div className="mt-2 p-2 bg-muted/50 rounded-md">
                <div className="flex items-center gap-2 text-xs">
                  <Badge
                    variant={candidate.interview_evaluation_data.result === 'passed' ? 'default' : candidate.interview_evaluation_data.result === 'pending' ? 'secondary' : 'destructive'}
                    className={candidate.interview_evaluation_data.result === 'passed' ? 'bg-green-500' : candidate.interview_evaluation_data.result === 'pending' ? 'bg-yellow-500' : ''}
                  >
                    {candidate.interview_evaluation_data.result === 'passed' ? 'ผ่านเกณฑ์' : candidate.interview_evaluation_data.result === 'pending' ? 'สำรองพิจารณา' : 'ไม่ผ่าน'}
                  </Badge>
                  <span className="text-muted-foreground">
                    คะแนน: {candidate.interview_evaluation_data.totalScore}/70
                  </span>
                </div>
                {candidate.interview_evaluation_data.feedback && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {candidate.interview_evaluation_data.feedback}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary font-bold"
            >
              {candidate.ai_score}%
            </Badge>

            <Button variant="outline" size="sm" onClick={() => onView(candidate)}>
              <Eye className="h-4 w-4 mr-1" />
              ดูรายละเอียด
            </Button>

            {showEvaluateButton && onEvaluate && (
              <Button
                size="sm"
                onClick={() => onEvaluate(candidate)}
                className="gap-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <ClipboardCheck className="h-4 w-4" />
                ประเมินผล
              </Button>
            )}

            {showActions && onSchedule && onReject && (
              <>
                <Button
                  size="sm"
                  onClick={() => onSchedule(candidate)}
                  className="gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  นัดสัมภาษณ์
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(candidate)}
                  className="text-destructive hover:text-destructive gap-1"
                >
                  <XCircle className="h-4 w-4" />
                  ไม่สนใจ
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
