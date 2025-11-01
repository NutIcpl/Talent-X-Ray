import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Video, MapPin, Clock, Users, List } from "lucide-react";
import { InterviewFormDialog, Interview } from "@/components/interviews/InterviewFormDialog";
import { InterviewCalendarView } from "@/components/interviews/InterviewCalendarView";
import { toast } from "sonner";

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
  },
  {
    id: "6",
    name: "สุรชัย ดีงาม",
    position: "Backend Developer",
    date: new Date(Date.now() + 86400000),
    time: "15:00 - 16:00",
    type: "ออนไซต์",
    interviewer: "คุณธนพล",
    status: "upcoming",
  },
];

export default function Interviews() {
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | undefined>();

  const todayInterviews = interviews.filter(i => {
    const today = new Date();
    return i.date.toDateString() === today.toDateString();
  });

  const upcomingInterviews = interviews.filter(i => {
    const today = new Date();
    return i.date > today;
  });

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
      };
      setInterviews([...interviews, newInterview]);
      toast.success("เพิ่มการสัมภาษณ์สำเร็จ");
    }
    setEditingInterview(undefined);
  };

  const handleNewInterview = () => {
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
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            การสัมภาษณ์
          </h1>
          <p className="text-muted-foreground">
            จัดการและติดตามการสัมภาษณ์ทั้งหมด
          </p>
        </div>
        <Button 
          className="shadow-primary hover:shadow-lg transition-all"
          onClick={handleNewInterview}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          นัดสัมภาษณ์ใหม่
        </Button>
      </div>

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

        <TabsContent value="list" className="space-y-6 mt-6">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                สัมภาษณ์วันนี้
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-card hover:shadow-md transition-all group border border-border/50 cursor-pointer"
                    onClick={() => handleInterviewClick(interview)}
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
                        <>
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            กำลังจะถึง
                          </Badge>
                          <Button size="sm" className="shadow-sm hover:shadow-md transition-all">
                            เข้าร่วม
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {upcomingInterviews.length > 0 && (
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>การสัมภาษณ์ที่กำลังจะมาถึง</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-accent/50 transition-colors border border-transparent hover:border-border cursor-pointer"
                      onClick={() => handleInterviewClick(interview)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                          <CalendarIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{interview.name}</h3>
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
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        กำลังจะถึง
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <InterviewCalendarView 
            interviews={interviews}
            onInterviewClick={handleInterviewClick}
          />
        </TabsContent>
      </Tabs>

      <InterviewFormDialog
        interview={editingInterview}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveInterview}
      />
    </div>
  );
}
