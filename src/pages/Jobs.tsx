import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Jobs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">ตำแหน่งงาน</h1>
          <p className="text-muted-foreground">จัดการตำแหน่งงานที่เปิดรับสมัคร</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มตำแหน่งงาน
        </Button>
      </div>

      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Senior Full-Stack Developer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ผู้สมัคร: 24 คน</p>
                  <p className="text-sm text-muted-foreground">เปิดรับ: 15 มี.ค. 2025</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">ดูรายละเอียด</Button>
                  <Button>ดูผู้สมัคร</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
