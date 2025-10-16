import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">รายงาน</h1>
          <p className="text-muted-foreground">รายงานและข้อมูลเชิงลึก</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          ส่งออกรายงาน
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ประสิทธิภาพการจ้างงาน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">เวลาเฉลี่ยในการจ้างงาน</span>
                <span className="font-bold">21 วัน</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">อัตราการยอมรับ</span>
                <span className="font-bold">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ต้นทุนต่อการจ้าง</span>
                <span className="font-bold">฿45,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>คุณภาพผู้สมัคร</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">AI Fit Score เฉลี่ย</span>
                <span className="font-bold">78/100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ผ่านการสัมภาษณ์</span>
                <span className="font-bold">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ความพึงพอใจ HR</span>
                <span className="font-bold">4.5/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
