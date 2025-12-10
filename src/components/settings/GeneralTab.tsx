import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function GeneralTab() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "บันทึกสำเร็จ",
      description: "การตั้งค่าของคุณถูกบันทึกแล้ว",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลส่วนตัว</CardTitle>
          <CardDescription>จัดการข้อมูลบัญชีของคุณ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อ-นามสกุล</Label>
            <Input
              id="name"
              placeholder="ชื่อ นามสกุล"
            />
          </div>
          <Button onClick={handleSave}>บันทึกการเปลี่ยนแปลง</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>เปลี่ยนรหัสผ่าน</CardTitle>
          <CardDescription>อัปเดตรหัสผ่านของคุณ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">รหัสผ่านปัจจุบัน</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">รหัสผ่านใหม่</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">ยืนยันรหัสผ่านใหม่</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button onClick={handleSave}>เปลี่ยนรหัสผ่าน</Button>
        </CardContent>
      </Card>
    </div>
  );
}
