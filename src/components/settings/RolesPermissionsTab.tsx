import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, UserCheck, Crown } from "lucide-react";

const roles = [
  {
    name: "Admin",
    value: "admin",
    icon: Crown,
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "สิทธิ์เต็มในการจัดการระบบทั้งหมด",
    permissions: [
      "จัดการผู้ใช้และบทบาท",
      "ดูและแก้ไขข้อมูลทั้งหมด",
      "จัดการตำแหน่งงาน",
      "จัดการผู้สมัคร",
      "ดูรายงานและสถิติ",
      "ตั้งค่าระบบ",
    ],
  },
  {
    name: "HR Manager",
    value: "hr_manager",
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "จัดการกระบวนการสรรหาและคัดเลือกบุคลากร",
    permissions: [
      "จัดการตำแหน่งงาน",
      "จัดการผู้สมัครทั้งหมด",
      "อนุมัติและปฏิเสธผู้สมัคร",
      "ดูรายงานและสถิติ",
      "จัดการ Recruiter",
    ],
  },
  {
    name: "Recruiter",
    value: "recruiter",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "ดำเนินการสรรหาและคัดกรองผู้สมัคร",
    permissions: [
      "ดูตำแหน่งงาน",
      "จัดการผู้สมัคร",
      "คัดกรองและประเมินผู้สมัคร",
      "ส่งผู้สมัครให้ Manager",
      "ดูรายงานของตนเอง",
    ],
  },
  {
    name: "Manager",
    value: "manager",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "สัมภาษณ์และประเมินผู้สมัครในแผนกของตน",
    permissions: [
      "ดูผู้สมัครที่ส่งมาให้",
      "สัมภาษณ์และประเมินผู้สมัคร",
      "อนุมัติหรือปฏิเสธผู้สมัคร",
      "ดูรายงานของแผนก",
    ],
  },
];

export function RolesPermissionsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>
            บทบาทและสิทธิ์การเข้าถึงในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card key={role.value} className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${role.bgColor}`}>
                        <Icon className={`h-6 w-6 ${role.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl">{role.name}</CardTitle>
                          <Badge variant="outline">{role.value}</Badge>
                        </div>
                        <CardDescription className="mt-1">
                          {role.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold mb-3">สิทธิ์การเข้าถึง:</h4>
                      <ul className="space-y-2">
                        {role.permissions.map((permission, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span className="text-sm">{permission}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>สรุปบทบาท</CardTitle>
          <CardDescription>ตารางเปรียบเทียบสิทธิ์การเข้าถึง</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ฟีเจอร์</TableHead>
                <TableHead className="text-center">Admin</TableHead>
                <TableHead className="text-center">HR Manager</TableHead>
                <TableHead className="text-center">Recruiter</TableHead>
                <TableHead className="text-center">Manager</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>จัดการผู้ใช้</TableCell>
                <TableCell className="text-center">✅</TableCell>
                <TableCell className="text-center">❌</TableCell>
                <TableCell className="text-center">❌</TableCell>
                <TableCell className="text-center">❌</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>จัดการตำแหน่งงาน</TableCell>
                <TableCell className="text-center">✅</TableCell>
                <TableCell className="text-center">✅</TableCell>
                <TableCell className="text-center">👁️</TableCell>
                <TableCell className="text-center">❌</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>จัดการผู้สมัคร</TableCell>
                <TableCell className="text-center">✅</TableCell>
                <TableCell className="text-center">✅</TableCell>
                <TableCell className="text-center">✅</TableCell>
                <TableCell className="text-center">👁️</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>สัมภาษณ์ผู้สมัคร</TableCell>
                <TableCell className="text-center">✅</TableCell>
                <TableCell className="text-center">✅</TableCell>
                <TableCell className="text-center">✅</TableCell>
                <TableCell className="text-center">✅</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ดูรายงานทั้งหมด</TableCell>
                <TableCell className="text-center">✅</TableCell>
                <TableCell className="text-center">✅</TableCell>
                <TableCell className="text-center">📊</TableCell>
                <TableCell className="text-center">📊</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ตั้งค่าระบบ</TableCell>
                <TableCell className="text-center">✅</TableCell>
                <TableCell className="text-center">❌</TableCell>
                <TableCell className="text-center">❌</TableCell>
                <TableCell className="text-center">❌</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>✅ = เข้าถึงได้เต็มรูปแบบ</p>
            <p>👁️ = ดูได้อย่างเดียว</p>
            <p>📊 = ดูได้เฉพาะของตนเอง/แผนก</p>
            <p>❌ = ไม่สามารถเข้าถึงได้</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
