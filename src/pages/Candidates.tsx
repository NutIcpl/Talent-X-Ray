import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star } from "lucide-react";

const candidates = [
  {
    name: "สมชาย ใจดี",
    position: "Senior Developer",
    experience: "5 ปี",
    score: 89,
    skills: ["React", "Node.js", "TypeScript"],
    appliedDate: "2 วันที่แล้ว",
    status: "screening",
  },
  {
    name: "สมหญิง รักดี",
    position: "UX Designer",
    experience: "3 ปี",
    score: 92,
    skills: ["Figma", "UI/UX", "Design Systems"],
    appliedDate: "1 วันที่แล้ว",
    status: "interview",
  },
  {
    name: "ประเสริฐ วงศ์ดี",
    position: "Data Scientist",
    experience: "6 ปี",
    score: 87,
    skills: ["Python", "Machine Learning", "SQL"],
    appliedDate: "3 วันที่แล้ว",
    status: "screening",
  },
  {
    name: "วิชัย สุขใจ",
    position: "Product Manager",
    experience: "4 ปี",
    score: 84,
    skills: ["Product Strategy", "Agile", "Analytics"],
    appliedDate: "4 วันที่แล้ว",
    status: "shortlisted",
  },
  {
    name: "นภา ใจงาม",
    position: "Frontend Developer",
    experience: "3 ปี",
    score: 91,
    skills: ["Vue.js", "CSS", "JavaScript"],
    appliedDate: "5 วันที่แล้ว",
    status: "interview",
  },
  {
    name: "ธนพล มั่งคั่ง",
    position: "Backend Developer",
    experience: "7 ปี",
    score: 86,
    skills: ["Java", "Spring Boot", "Microservices"],
    appliedDate: "1 สัปดาห์ที่แล้ว",
    status: "screening",
  },
];

const statusColors = {
  screening: "bg-blue-100 text-blue-700 border-blue-200",
  interview: "bg-orange-100 text-orange-700 border-orange-200",
  shortlisted: "bg-green-100 text-green-700 border-green-200",
};

const statusLabels = {
  screening: "กำลังคัดกรอง",
  interview: "รอสัมภาษณ์",
  shortlisted: "รายชื่อสั้น",
};

export default function Candidates() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          ผู้สมัคร
        </h1>
        <p className="text-muted-foreground">
          จัดการและติดตามสถานะผู้สมัครทั้งหมด
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="ค้นหาผู้สมัคร..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          ตัวกรอง
        </Button>
      </div>

      <div className="grid gap-4">
        {candidates.map((candidate, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-xl shadow-primary">
                      {candidate.score}
                    </div>
                    {candidate.score >= 90 && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {candidate.name}
                      </h3>
                      <Badge className={statusColors[candidate.status as keyof typeof statusColors]}>
                        {statusLabels[candidate.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="font-medium text-foreground">{candidate.position}</span>
                      <span>•</span>
                      <span>{candidate.experience}</span>
                      <span>•</span>
                      <span>สมัครเมื่อ: {candidate.appliedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {candidate.skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="hover:bg-accent transition-colors">
                    ดูรายละเอียด
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
