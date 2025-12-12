import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, List, CheckCircle, XCircle, Clock, Hourglass } from "lucide-react";
import { Interview } from "./InterviewFormDialog";
import { InterviewCard } from "./InterviewCard";
import { InterviewCalendarView } from "./InterviewCalendarView";

interface InterviewSectionProps {
  title: string;
  interviews: Interview[];
  onInterviewClick: (interview: Interview) => void;
  onRefresh?: () => void;
  gradientClass?: string;
}

type StatusFilter = "all" | "waiting" | "passed" | "failed";

export function InterviewSection({
  title,
  interviews,
  onInterviewClick,
  onRefresh,
  gradientClass = "from-primary/5 to-transparent"
}: InterviewSectionProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Filter interviews by status
  const waitingInterviews = interviews.filter(
    i => i.status === "upcoming" || i.waitingForManager
  );
  const passedInterviews = interviews.filter(
    i => i.status === "completed" && i.score && i.score >= 45
  );
  const failedInterviews = interviews.filter(
    i => i.status === "completed" && (!i.score || i.score < 45)
  );

  // Get filtered interviews based on selected filter
  const getFilteredInterviews = () => {
    switch (statusFilter) {
      case "waiting":
        return waitingInterviews;
      case "passed":
        return passedInterviews;
      case "failed":
        return failedInterviews;
      default:
        return interviews;
    }
  };

  const filteredInterviews = getFilteredInterviews();
  const sortedInterviews = [...filteredInterviews].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-4">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={statusFilter === "all" ? "default" : "outline"}
          className={`cursor-pointer transition-all hover:scale-105 ${
            statusFilter === "all" ? "bg-primary" : "hover:bg-primary/10"
          }`}
          onClick={() => setStatusFilter("all")}
        >
          ทั้งหมด ({interviews.length})
        </Badge>
        <Badge
          variant={statusFilter === "waiting" ? "default" : "outline"}
          className={`cursor-pointer transition-all hover:scale-105 ${
            statusFilter === "waiting"
              ? "bg-amber-500 hover:bg-amber-600"
              : "text-amber-600 border-amber-300 hover:bg-amber-50"
          }`}
          onClick={() => setStatusFilter("waiting")}
        >
          <Clock className="h-3 w-3 mr-1" />
          รอสัมภาษณ์ ({waitingInterviews.length})
        </Badge>
        <Badge
          variant={statusFilter === "passed" ? "default" : "outline"}
          className={`cursor-pointer transition-all hover:scale-105 ${
            statusFilter === "passed"
              ? "bg-green-500 hover:bg-green-600"
              : "text-green-600 border-green-300 hover:bg-green-50"
          }`}
          onClick={() => setStatusFilter("passed")}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          ผ่าน ({passedInterviews.length})
        </Badge>
        <Badge
          variant={statusFilter === "failed" ? "default" : "outline"}
          className={`cursor-pointer transition-all hover:scale-105 ${
            statusFilter === "failed"
              ? "bg-red-500 hover:bg-red-600"
              : "text-red-600 border-red-300 hover:bg-red-50"
          }`}
          onClick={() => setStatusFilter("failed")}
        >
          <XCircle className="h-3 w-3 mr-1" />
          ไม่ผ่าน ({failedInterviews.length})
        </Badge>
      </div>

      {/* View Mode Tabs */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            รายการ
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            ปฏิทิน
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-3 mt-4">
          {sortedInterviews.length > 0 ? (
            sortedInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onClick={onInterviewClick}
                onRefresh={onRefresh}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  {statusFilter === "all"
                    ? "ยังไม่มีการสัมภาษณ์ที่กำหนดไว้"
                    : statusFilter === "waiting"
                    ? "ไม่มีการสัมภาษณ์ที่รอดำเนินการ"
                    : statusFilter === "passed"
                    ? "ยังไม่มีผู้สมัครที่ผ่านการสัมภาษณ์"
                    : "ยังไม่มีผู้สมัครที่ไม่ผ่านการสัมภาษณ์"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <InterviewCalendarView
            interviews={filteredInterviews}
            onInterviewClick={onInterviewClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
