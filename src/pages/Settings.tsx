import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "@/components/settings/UsersTab";
import { RolesPermissionsTab } from "@/components/settings/RolesPermissionsTab";

export default function Settings() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">ตั้งค่า</h1>
        <p className="text-muted-foreground">จัดการการตั้งค่าระบบและบัญชี</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">ทั่วไป</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="permissions">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลบริษัท</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">ชื่อบริษัท</Label>
                <Input id="company" placeholder="บริษัท ABC จำกัด" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input id="email" type="email" placeholder="hr@company.com" />
              </div>
              <Button>บันทึกการเปลี่ยนแปลง</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>การเชื่อมต่อ Microsoft 365</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                เชื่อมต่อกับ Microsoft 365 เพื่อซิงค์อีเมลและปฏิทิน
              </p>
              <Button variant="outline">เชื่อมต่อ Microsoft 365</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Fit Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                ปรับน้ำหนักการคำนวณคะแนน AI Fit Score
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">ทักษะ</span>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ประสบการณ์</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">โครงการ</span>
                  <span className="text-sm font-medium">15%</span>
                </div>
              </div>
              <Button variant="outline">ปรับแต่งน้ำหนัก</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        <TabsContent value="permissions">
          <RolesPermissionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
