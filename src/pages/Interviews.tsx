import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

export default function Interviews() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">การสัมภาษณ์</h1>
          <p className="text-muted-foreground">จัดการและติดตามการสัมภาษณ์</p>
        </div>
        <Button>
          <CalendarIcon className="h-4 w-4 mr-2" />
          นัดสัมภาษณ์ใหม่
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>สัมภาษณ์วันนี้</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">สมชาย ใจดี</p>
                    <p className="text-sm text-muted-foreground">14:00 - 15:00 น.</p>
                  </div>
                  <Button size="sm" variant="outline">เข้าร่วม</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>สัมภาษณ์พรุ่งนี้</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">ผู้สมัคร #{i}</p>
                    <p className="text-sm text-muted-foreground">10:00 - 11:00 น.</p>
                  </div>
                  <Button size="sm" variant="ghost">รายละเอียด</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
