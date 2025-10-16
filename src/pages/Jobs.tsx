import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Clock, Users, TrendingUp, Briefcase } from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "กรุงเทพฯ",
    type: "Full-time",
    applicants: 24,
    postedDate: "15 มี.ค. 2025",
    status: "active",
    avgScore: 78,
  },
  {
    id: 2,
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    applicants: 18,
    postedDate: "12 มี.ค. 2025",
    status: "active",
    avgScore: 82,
  },
  {
    id: 3,
    title: "Data Scientist",
    department: "Data & Analytics",
    location: "กรุงเทพฯ",
    type: "Full-time",
    applicants: 31,
    postedDate: "10 มี.ค. 2025",
    status: "active",
    avgScore: 85,
  },
  {
    id: 4,
    title: "Product Manager",
    department: "Product",
    location: "Hybrid",
    type: "Full-time",
    applicants: 15,
    postedDate: "8 มี.ค. 2025",
    status: "active",
    avgScore: 75,
  },
];

export default function Jobs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ตำแหน่งงาน
          </h1>
          <p className="text-muted-foreground">
            จัดการตำแหน่งงานที่เปิดรับสมัครทั้งหมด
          </p>
        </div>
        <Button className="shadow-primary hover:shadow-lg transition-all">
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มตำแหน่งงาน
        </Button>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {job.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="font-normal">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {job.department}
                    </Badge>
                    <Badge variant="outline" className="font-normal">
                      <MapPin className="h-3 w-3 mr-1" />
                      {job.location}
                    </Badge>
                    <Badge variant="outline" className="font-normal">
                      {job.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-lg shadow-primary">
                    {job.avgScore}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Avg Score</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium text-foreground">{job.applicants}</span>
                    <span>ผู้สมัคร</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>เปิดรับ: {job.postedDate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="hover:bg-accent transition-colors">
                    ดูรายละเอียด
                  </Button>
                  <Button className="shadow-sm hover:shadow-md transition-all">
                    ดูผู้สมัคร
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">สร้างตำแหน่งงานใหม่</h3>
          <p className="text-muted-foreground mb-4 text-center max-w-md">
            เพิ่มตำแหน่งงานใหม่และเริ่มต้นรับสมัครผู้สมัครที่มีคุณสมบัติเหมาะสม
          </p>
          <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
            เพิ่มตำแหน่งงาน
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
