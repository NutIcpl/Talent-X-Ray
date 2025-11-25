import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, XCircle, AlertCircle } from "lucide-react";
import { InterviewFormDialog, Interview } from "@/components/interviews/InterviewFormDialog";
import { PendingScheduleBox } from "@/components/interviews/PendingScheduleBox";
import { StatusBox } from "@/components/interviews/StatusBox";
import { InterviewSection } from "@/components/interviews/InterviewSection";
import { toast } from "sonner";
import { addSparkleEffect } from "@/lib/sparkle";

const initialInterviews: Interview[] = [
  {
    id: "1",
    name: "อรุณ สว่างไสว",
    position: "Senior Developer",
    date: new Date(),
    time: "10:00 - 11:00",
    type: "ออนไลน์",
    interviewer: "คุณสมชาย",
    status: "completed",
    score: 88,
    interviewRound: "first",
    schedulingStatus: "scheduled",
    candidateEmail: "arun@example.com",
    managerEmail: "manager@example.com",
  },
  {
    id: "2",
    name: "ธนพล มั่งคั่ง",
    position: "UX Designer",
    date: new Date(),
    time: "14:00 - 15:00",
    type: "ออนไลน์",
    interviewer: "คุณสมหญิง",
    status: "upcoming",
    interviewRound: "first",
    schedulingStatus: "scheduled",
    candidateEmail: "thanapol@example.com",
    managerEmail: "manager@example.com",
  },
  {
    id: "3",
    name: "ศิริพร แสงจันทร์",
    position: "Data Scientist",
    date: new Date(),
    time: "15:30 - 16:30",
    type: "ออนไซต์",
    interviewer: "คุณประเสริฐ",
    status: "upcoming",
    interviewRound: "final",
    schedulingStatus: "scheduled",
    candidateEmail: "siriporn@example.com",
    managerEmail: "manager@example.com",
  },
  {
    id: "4",
    name: "วิชัย สุขใจ",
    position: "Product Manager",
    date: new Date(Date.now() + 86400000),
    time: "10:00 - 11:00",
    type: "ออนไลน์",
    interviewer: "คุณนภา",
    status: "upcoming",
    interviewRound: "final",
    schedulingStatus: "scheduled",
    candidateEmail: "wichai@example.com",
    managerEmail: "manager@example.com",
  },
  {
    id: "5",
    name: "นิภา วรรณา",
    position: "Frontend Developer",
    date: new Date(Date.now() + 86400000),
    time: "13:00 - 14:00",
    type: "ออนไลน์",
    interviewer: "คุณวิชัย",
    status: "upcoming",
    interviewRound: "first",
    schedulingStatus: "scheduled",
    candidateEmail: "nipa@example.com",
    managerEmail: "manager@example.com",
  },
  // Pending candidates
  {
    id: "p1",
    name: "สมชาย ใจดี",
    position: "Backend Developer",
    date: new Date(),
    time: "",
    type: "ออนไลน์",
    interviewer: "คุณสมชาย",
    status: "upcoming",
    interviewRound: "first",
    schedulingStatus: "pending",
    candidateEmail: "somchai@example.com",
    managerEmail: "manager@example.com",
    proposedSlots: ["10:00 - 11:00", "14:00 - 15:00"],
  },
  {
    id: "p2",
    name: "วันดี สุขสันต์",
    position: "Marketing Manager",
    date: new Date(),
    time: "",
    type: "ออนไซต์",
    interviewer: "คุณนภา",
    status: "upcoming",
    interviewRound: "final",
    schedulingStatus: "pending",
    candidateEmail: "wandee@example.com",
    managerEmail: "manager@example.com",
    proposedSlots: ["13:00 - 14:00", "15:00 - 16:00"],
  },
  // Not interested
  {
    id: "n1",
    name: "ประเสริฐ มีชัย",
    position: "Sales Executive",
    date: new Date(),
    time: "",
    type: "ออนไลน์",
    interviewer: "",
    status: "upcoming",
    interviewRound: "first",
    schedulingStatus: "not_interested",
  },
  // Rejected
  {
    id: "r1",
    name: "สุดา ปรีดา",
    position: "HR Coordinator",
    date: new Date(),
    time: "",
    type: "ออนไลน์",
    interviewer: "",
    status: "upcoming",
    interviewRound: "first",
    schedulingStatus: "rejected",
  },
];

export default function Interviews() {
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | undefined>();

  // Filter candidates by status
  const pendingCandidates = interviews.filter(i => i.schedulingStatus === "pending");
  const notInterestedCandidates = interviews.filter(i => i.schedulingStatus === "not_interested");
  const rejectedCandidates = interviews.filter(i => i.schedulingStatus === "rejected");

  // Filter scheduled interviews by round
  const firstInterviews = interviews.filter(
    i => i.schedulingStatus === "scheduled" && i.interviewRound === "first"
  );
  const finalInterviews = interviews.filter(
    i => i.schedulingStatus === "scheduled" && i.interviewRound === "final"
  );

  // Track booked time slots to prevent double-booking
  const bookedSlots = new Set<string>(
    interviews
      .filter(i => i.schedulingStatus === "scheduled" && i.time)
      .map(i => i.time)
  );

  const handleSchedule = (candidateId: string, timeSlot: string) => {
    setInterviews(interviews.map(i => 
      i.id === candidateId
        ? { 
            ...i, 
            schedulingStatus: "scheduled" as const,
            time: timeSlot,
            date: new Date() // Set to today or selected date
          }
        : i
    ));
  };

  const handleSaveInterview = (interviewData: Omit<Interview, "id">) => {
    if (editingInterview) {
      setInterviews(interviews.map(i => 
        i.id === editingInterview.id 
          ? { ...interviewData, id: editingInterview.id }
          : i
      ));
      toast.success("แก้ไขการสัมภาษณ์สำเร็จ");
    } else {
      const newInterview: Interview = {
        ...interviewData,
        id: Date.now().toString(),
        interviewRound: "first",
        schedulingStatus: "scheduled",
      };
      setInterviews([...interviews, newInterview]);
      toast.success("เพิ่มการสัมภาษณ์สำเร็จ");
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <PendingScheduleBox 
          candidates={pendingCandidates}
          bookedSlots={bookedSlots}
          onSchedule={handleSchedule}
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
