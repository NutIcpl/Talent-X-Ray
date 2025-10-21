import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const stats = [
  {
    title: "ผู้สมัครทั้งหมด",
    value: "1,234",
    icon: Users,
    trend: "+12.5%",
    trendUp: true,
    color: "from-blue-500 to-blue-600",
  },
];

const recentCandidates = [
  { name: "สมชาย ใจดี", position: "Senior Developer", score: 89, time: "5 นาทีที่แล้ว" },
  { name: "สมหญิง รักดี", position: "UX Designer", score: 92, time: "15 นาทีที่แล้ว" },
  { name: "ประเสริฐ วงศ์ดี", position: "Data Scientist", score: 87, time: "1 ชั่วโมงที่แล้ว" },
  { name: "วิชัย สุขใจ", position: "Product Manager", score: 84, time: "2 ชั่วโมงที่แล้ว" },
  { name: "นภา ใจงาม", position: "Frontend Developer", score: 91, time: "3 ชั่วโมงที่แล้ว" },
];

const todayInterviews = [
  { name: "อรุณ สว่างไสว", position: "Senior Developer", time: "10:00 - 11:00", status: "completed" },
  { name: "ธนพล มั่งคั่ง", position: "UX Designer", time: "14:00 - 15:00", status: "upcoming" },
  { name: "ศิริพร แสงจันทร์", position: "Data Scientist", time: "15:30 - 16:30", status: "upcoming" },
];

const initialOpenPositions = [
  { id: 1, title: "Senior Developer", positions: 3, status: "Interview", applicants: 45 },
  { id: 2, title: "UX Designer", positions: 2, status: "Screening", applicants: 32 },
  { id: 3, title: "Data Scientist", positions: 1, status: "Offer", applicants: 18 },
  { id: 4, title: "Product Manager", positions: 2, status: "Interview", applicants: 28 },
  { id: 5, title: "Frontend Developer", positions: 4, status: "Screening", applicants: 52 },
];

export default function Dashboard() {
  const [openPositions, setOpenPositions] = useState(initialOpenPositions);

  const handleStatusChange = (id: number, newStatus: string) => {
    setOpenPositions(openPositions.map(position => 
      position.id === id ? { ...position, status: newStatus } : position
    ));
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Today hiring Overview
        </h1>
        <p className="text-muted-foreground">
          ภาพรวมระบบจัดการผู้สมัครและการสัมภาษณ์
        </p>
      </div>

      <div className="grid gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="flex items-center text-xs">
                <span className="text-green-500">
                  {stat.trend}
                </span>
                <span className="text-muted-foreground ml-1">จากเดือนที่แล้ว</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ตำแหน่งที่เปิดรับ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {openPositions.map((position) => (
                <div key={position.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{position.title}</p>
                    <p className="text-sm text-muted-foreground">{position.positions} อัตรา • {position.applicants} ผู้สมัคร</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="outline-none">
                        <Badge 
                          variant="outline"
                          className={
                            position.status === "Screening" 
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20 cursor-pointer hover:bg-blue-500/20" 
                              : position.status === "Interview"
                              ? "bg-orange-500/10 text-orange-600 border-orange-500/20 cursor-pointer hover:bg-orange-500/20"
                              : "bg-green-500/10 text-green-600 border-green-500/20 cursor-pointer hover:bg-green-500/20"
                          }
                        >
                          {position.status}
                        </Badge>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange(position.id, "Screening")}>
                        Screening
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(position.id, "Interview")}>
                        Interview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(position.id, "Offer")}>
                        Offer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              ผู้สมัครล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCandidates.map((candidate, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-shadow">
                      {candidate.score}
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{candidate.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              การสัมภาษณ์วันนี้
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayInterviews.map((interview, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div>
                    <p className="font-medium">{interview.name}</p>
                    <p className="text-sm text-muted-foreground">{interview.position}</p>
                    <p className="text-xs text-muted-foreground mt-1">{interview.time}</p>
                  </div>
                  <Badge 
                    variant={interview.status === "completed" ? "secondary" : "default"}
                    className={interview.status === "upcoming" ? "bg-primary/10 text-primary border-primary/20" : ""}
                  >
                    {interview.status === "completed" ? "เสร็จสิ้น" : "กำลังจะถึง"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
