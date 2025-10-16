import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Video, MapPin, Clock, Users } from "lucide-react";

const todayInterviews = [
  {
    name: "อรุณ สว่างไสว",
    position: "Senior Developer",
    time: "10:00 - 11:00",
    type: "ออนไลน์",
    interviewer: "คุณสมชาย",
    status: "completed",
    score: 88,
  },
  {
    name: "ธนพล มั่งคั่ง",
    position: "UX Designer",
    time: "14:00 - 15:00",
    type: "ออนไลน์",
    interviewer: "คุณสมหญิง",
    status: "upcoming",
  },
  {
    name: "ศิริพร แสงจันทร์",
    position: "Data Scientist",
    time: "15:30 - 16:30",
    type: "ออนไซต์",
    interviewer: "คุณประเสริฐ",
    status: "upcoming",
  },
];

const upcomingInterviews = [
  {
    date: "พรุ่งนี้",
    interviews: [
      {
        name: "วิชัย สุขใจ",
        position: "Product Manager",
        time: "10:00 - 11:00",
        type: "ออนไลน์",
        interviewer: "คุณนภา",
      },
      {
        name: "นิภา วรรณา",
        position: "Frontend Developer",
        time: "13:00 - 14:00",
        type: "ออนไลน์",
        interviewer: "คุณวิชัย",
      },
      {
        name: "สุรชัย ดีงาม",
        position: "Backend Developer",
        time: "15:00 - 16:00",
        type: "ออนไซต์",
        interviewer: "คุณธนพล",
      },
    ],
  },
];

export default function Interviews() {
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
        <Button className="shadow-primary hover:shadow-lg transition-all">
          <CalendarIcon className="h-4 w-4 mr-2" />
          นัดสัมภาษณ์ใหม่
        </Button>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            สัมภาษณ์วันนี้
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayInterviews.map((interview, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-card hover:shadow-md transition-all group border border-border/50"
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

      {upcomingInterviews.map((day, idx) => (
        <Card key={idx} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>{day.date}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {day.interviews.map((interview, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-accent/50 transition-colors border border-transparent hover:border-border"
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
                  <Button size="sm" variant="outline" className="hover:bg-accent transition-colors">
                    รายละเอียด
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
