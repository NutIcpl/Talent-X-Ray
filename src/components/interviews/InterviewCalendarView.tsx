import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Interview } from "./InterviewFormDialog";
import { format, isSameDay } from "date-fns";
import { Clock, MapPin, Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface InterviewCalendarViewProps {
  interviews: Interview[];
  onInterviewClick?: (interview: Interview) => void;
}

export function InterviewCalendarView({ interviews, onInterviewClick }: InterviewCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const interviewDates = interviews.map(i => i.date);
  
  const selectedDateInterviews = selectedDate
    ? interviews.filter(interview => isSameDay(interview.date, selectedDate))
    : [];

  const modifiers = {
    hasInterview: interviewDates,
  };

  const modifiersClassNames = {
    hasInterview: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>ปฏิทินการสัมภาษณ์</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-md border pointer-events-auto"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, "dd MMMM yyyy") : "เลือกวันที่"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateInterviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>ไม่มีการสัมภาษณ์ในวันนี้</p>
              <p className="text-sm mt-2">วันนี้ยังว่างอยู่</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all group cursor-pointer",
                    interview.status === "completed" 
                      ? "bg-accent/30 border-border/50" 
                      : "bg-card hover:shadow-md border-border/50 hover:border-primary/30"
                  )}
                  onClick={() => onInterviewClick?.(interview)}
                >
                  <div className="flex items-center gap-4">
                    {interview.status === "completed" && interview.score ? (
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-md">
                        {interview.score}
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-md">
                        <Video className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {interview.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{interview.position}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {interview.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {interview.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {interview.interviewer}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {interview.status === "completed" ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        เสร็จสิ้น
                      </Badge>
                    ) : (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        กำลังจะถึง
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
