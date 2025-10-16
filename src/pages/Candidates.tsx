import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Candidates() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">ผู้สมัคร</h1>
        <p className="text-muted-foreground">จัดการและติดตามสถานะผู้สมัครทั้งหมด</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="ค้นหาผู้สมัคร..." className="pl-10" />
        </div>
        <Button variant="outline">ตัวกรอง</Button>
      </div>

      <div className="grid gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                    {85 + i}
                  </div>
                  <div>
                    <h3 className="font-semibold">สมชาย ใจดี</h3>
                    <p className="text-sm text-muted-foreground">Senior Developer • 5 ปี</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Senior Full-Stack Developer</p>
                    <p className="text-sm text-muted-foreground">สมัครเมื่อ: 2 วันที่แล้ว</p>
                  </div>
                  <Button>ดูรายละเอียด</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
