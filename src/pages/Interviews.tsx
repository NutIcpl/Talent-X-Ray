import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { InterviewFormDialog, Interview } from "@/components/interviews/InterviewFormDialog";
import { PendingScheduleBox } from "@/components/interviews/PendingScheduleBox";
import { StatusBox } from "@/components/interviews/StatusBox";
import { OfferBox } from "@/components/interviews/OfferBox";
import { InterviewSection } from "@/components/interviews/InterviewSection";
import { toast } from "sonner";
import { addSparkleEffect } from "@/lib/sparkle";
import { useInterviews } from "@/hooks/useInterviews";
import { useCandidatesData } from "@/hooks/useCandidatesData";

export default function Interviews() {
  const {
    interviews: dbInterviews,
    isLoading,
    scheduleInterview,
    updateInterview,
    createInterview,
    rejectInterview,
    hireCandidate,
    notHireCandidate,
    refetch,
  } = useInterviews();

  const { candidates, isLoading: candidatesLoading } = useCandidatesData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | undefined>();

  // Transform database interviews to the Interview format
  // Filter out pre_screen interviews - they should not appear in the Interview page
  const interviews: Interview[] = dbInterviews
    .filter((interview) => {
      // Exclude pre_screen interviews
      if (interview.notes) {
        try {
          const notesData = JSON.parse(interview.notes);
          if (notesData.type === "pre_screen") {
            return false;
          }
        } catch {
          // notes is plain text, include it
        }
      }
      return true;
    })
    .map((interview) => {
    // Parse notes to get proposed slots and time
    let proposedSlots: string[] | undefined;
    let scheduledTime = "";
    let interviewRound: "first" | "final" = "first";
    let schedulingStatus: "pending" | "scheduled" | "not_interested" | "rejected" = "scheduled";
    let evaluationData: Interview["evaluationData"] = null;
    let sentToFinal = false;
    let firstInterviewScore: number | undefined;
    let firstInterviewEvaluation: Interview["firstInterviewEvaluation"] = null;
    let waitingForManager = false;

    if (interview.notes) {
      try {
        const notesData = JSON.parse(interview.notes);
        if (notesData.proposedSlots) {
          // Handle both formats: array of objects {time: string} or array of strings
          proposedSlots = notesData.proposedSlots.map((slot: any) =>
            typeof slot === 'string' ? slot : slot.time
          );
        }
        if (notesData.scheduledTime) {
          scheduledTime = notesData.scheduledTime;
        }
        // Determine interview round from notes.type
        if (notesData.type === "final_interview") {
          interviewRound = "final";
        } else if (notesData.type === "first_interview") {
          interviewRound = "first";
        }
        // Check source for legacy data
        if (notesData.source === "manager_portal_final" || notesData.source === "sent_from_first_interview") {
          interviewRound = "final";
        } else if (notesData.source === "manager_portal" || notesData.source === "manager_portal_passed") {
          // Only set to first if type is not explicitly final
          if (notesData.type !== "final_interview") {
            interviewRound = "first";
          }
        }
        // Extract evaluation data if present
        if (notesData.evaluation) {
          evaluationData = {
            interviewDate: notesData.evaluation.interviewDate || "",
            scores: notesData.evaluation.scores || {
              skill: null,
              communication: null,
              creativity: null,
              motivation: null,
              teamwork: null,
              problemSolving: null,
              culture: null,
            },
            totalScore: notesData.evaluation.totalScore || interview.score || 0,
            result: notesData.evaluation.result || "pending",
            feedback: notesData.evaluation.feedback || "",
          };
        }
        // Check if sent to final (for First Interview)
        if (notesData.sent_to_final) {
          sentToFinal = true;
        }
        // Extract First Interview data (for Final Interview)
        if (notesData.first_interview_score) {
          firstInterviewScore = notesData.first_interview_score;
        }
        if (notesData.first_interview_evaluation) {
          firstInterviewEvaluation = notesData.first_interview_evaluation;
        }
        // Check if waiting for manager
        if (notesData.waiting_for_manager) {
          waitingForManager = true;
        }
      } catch {
        // Notes is plain text
      }
    }

    // Determine scheduling status based on interview result first, then status
    // Check result first since rejected/not_interested interviews have status = "completed"
    if (interview.result === "not_interested") {
      schedulingStatus = "not_interested";
    } else if (interview.result === "rejected") {
      schedulingStatus = "rejected";
    } else if (interview.status === "pending") {
      schedulingStatus = "pending";
    } else if (interview.status === "scheduled" || interview.status === "completed" || interview.status === "pre_screen") {
      schedulingStatus = "scheduled";
    }

    return {
      id: interview.id,
      name: interview.candidate_name,
      position: interview.position_title,
      date: interview.scheduled_at ? new Date(interview.scheduled_at) : new Date(),
      time: scheduledTime,
      type: "ออนไลน์",
      interviewer: "",
      status: interview.status === "completed" ? "completed" : "upcoming",
      score: interview.score || undefined,
      interviewRound,
      schedulingStatus,
      candidateEmail: interview.candidate_email,
      managerEmail: "",
      proposedSlots,
      evaluationData,
      sentToFinal,
      firstInterviewScore,
      firstInterviewEvaluation,
      waitingForManager,
    } as Interview;
  });

  // Filter candidates by status
  const pendingCandidates = interviews.filter(i => i.schedulingStatus === "pending");
  const notInterestedCandidates = interviews.filter(i => i.schedulingStatus === "not_interested");
  const rejectedCandidates = interviews.filter(i => i.schedulingStatus === "rejected");

  // Filter scheduled interviews by round
  // First Interviews: exclude those that have been sent to Final Interview
  const firstInterviews = interviews.filter(
    i => i.schedulingStatus === "scheduled" && i.interviewRound === "first" && !i.sentToFinal
  );
  const finalInterviews = interviews.filter(
    i => i.schedulingStatus === "scheduled" && i.interviewRound === "final"
  );

  // Get offer candidates from candidates data
  const offerCandidates: Interview[] = candidates
    .filter(c => c.stage === "Offer")
    .map(c => ({
      id: c.id,
      name: c.name,
      position: c.position_title || "ไม่ระบุตำแหน่ง",
      date: new Date(),
      time: "",
      type: "ออนไลน์",
      interviewer: "",
      status: "completed" as const,
      score: c.ai_fit_score || undefined,
      interviewRound: "final" as const,
      schedulingStatus: "scheduled" as const,
      candidateEmail: c.email,
      managerEmail: "",
    }));

  // Track booked time slots to prevent double-booking
  const bookedSlots = new Set<string>(
    interviews
      .filter(i => i.schedulingStatus === "scheduled" && i.time)
      .map(i => i.time)
  );

  const handleSchedule = (candidateId: string, timeSlot: string) => {
    const interview = dbInterviews.find(i => i.id === candidateId);
    if (interview) {
      const scheduledAt = new Date();
      // Parse time slot to set scheduled time
      scheduleInterview({
        interviewId: candidateId,
        scheduledAt: scheduledAt.toISOString(),
        timeSlot,
      });
    }
  };

  const handleReject = (candidateId: string) => {
    rejectInterview({ interviewId: candidateId });
  };

  const handleHire = (candidateId: string) => {
    hireCandidate({ candidateId });
  };

  const handleNotHire = (candidateId: string) => {
    notHireCandidate({ candidateId });
  };

  const handleSaveInterview = (interviewData: Omit<Interview, "id">) => {
    if (editingInterview) {
      const dbInterview = dbInterviews.find(i => i.id === editingInterview.id);
      if (dbInterview) {
        updateInterview({
          interviewId: editingInterview.id,
          updates: {
            scheduled_at: interviewData.date.toISOString(),
            status: interviewData.status === "completed" ? "completed" : "scheduled",
            score: interviewData.score,
          },
        });
      }
      toast.success("แก้ไขการสัมภาษณ์สำเร็จ");
    } else {
      toast.success("เพิ่มการสัมภาษณ์สำเร็จ - กรุณาเลือกผู้สมัครจากหน้า Candidates");
    }
    setEditingInterview(undefined);
  };

  const handleNewInterview = (e: React.MouseEvent) => {
    addSparkleEffect(e);
    setEditingInterview(undefined);
    setIsFormOpen(true);
  };

  const handleInterviewClick = (interview: Interview) => {
    setEditingInterview(interview);
    setIsFormOpen(true);
  };

  if (isLoading || candidatesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-luxury bg-clip-text text-transparent">การสัมภาษณ์</h1>
          <p className="text-muted-foreground mt-1">จัดการตารางสัมภาษณ์และติดตามสถานะ</p>
        </div>
        <Button 
          onClick={handleNewInterview}
          className="shadow-sm hover:shadow-glow transition-all hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          นัดสัมภาษณ์ใหม่
        </Button>
      </div>

      {/* Compact Status Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <PendingScheduleBox
          candidates={pendingCandidates}
          bookedSlots={bookedSlots}
          onSchedule={handleSchedule}
          onReject={handleReject}
          compact
        />
        <OfferBox
          candidates={offerCandidates}
          onHire={handleHire}
          onNotHire={handleNotHire}
          compact
        />
        <StatusBox
          title="ไม่สนใจ"
          candidates={notInterestedCandidates}
          icon={XCircle}
          colorClass="text-orange-500"
          bgClass="bg-orange-500/10"
          compact
        />
        <StatusBox
          title="ปฏิเสธการสัมภาษณ์"
          candidates={rejectedCandidates}
          icon={AlertCircle}
          colorClass="text-destructive"
          bgClass="bg-destructive/10"
          compact
        />
      </div>

      {/* Interview Sections - Clear Separation */}
      <div className="space-y-8">
        <div className="border-t-4 border-primary/30 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary-glow rounded-full" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-vibrant bg-clip-text text-transparent">
              First Interview
            </h2>
          </div>
          <InterviewSection
            title="First Interview"
            interviews={firstInterviews}
            onInterviewClick={handleInterviewClick}
            onRefresh={refetch}
            gradientClass="from-primary/5 to-transparent"
          />
        </div>
        
        <div className="border-t-4 border-secondary/30 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-gradient-to-b from-secondary to-secondary-glow rounded-full" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-secondary-glow bg-clip-text text-transparent">
              Final Interview
            </h2>
          </div>
          <InterviewSection
            title="Final Interview"
            interviews={finalInterviews}
            onInterviewClick={handleInterviewClick}
            onRefresh={refetch}
            gradientClass="from-secondary/5 to-transparent"
          />
        </div>
      </div>

      <InterviewFormDialog
        interview={editingInterview}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveInterview}
      />
    </div>
  );
}
