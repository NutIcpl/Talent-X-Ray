import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Calendar, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "ผู้สมัครทั้งหมด",
    value: "1,234",
    icon: Users,
    trend: "+12.5%",
  },
  {
    title: "ตำแหน่งเปิดรับ",
    value: "45",
    icon: Briefcase,
    trend: "+5.2%",
  },
  {
    title: "สัมภาษณ์วันนี้",
    value: "8",
    icon: Calendar,
    trend: "+2",
  },
  {
    title: "อัตราจ้างงาน",
    value: "85%",
    icon: TrendingUp,
    trend: "+3.1%",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          ภาพรวมระบบจัดการผู้สมัครและการสัมภาษณ์
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{stat.trend}</span> จากเดือนที่แล้ว
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ผู้สมัครล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">ผู้สมัคร #{i}</p>
                    <p className="text-sm text-muted-foreground">Senior Developer</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                        {85 + i}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>การสัมภาษณ์วันนี้</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">สัมภาษณ์ #{i}</p>
                    <p className="text-sm text-muted-foreground">14:00 - 15:00 น.</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    กำลังจะถึง
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
