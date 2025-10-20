import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { UserManagementDialog } from "@/components/settings/UserManagementDialog";
import { useToast } from "@/hooks/use-toast";

const initialUsers = [
  { id: 1, name: "สมชาย ใจดี", department: "HR", email: "somchai@company.com", role: "admin", status: "active" as const },
  { id: 2, name: "สมหญิง รักงาน", department: "HR", email: "somying@company.com", role: "hr_manager", status: "active" as const },
  { id: 3, name: "วิชัย คิดดี", department: "IT", email: "wichai@company.com", role: "recruiter", status: "active" as const },
  { id: 4, name: "มานี พักร้อน", department: "Finance", email: "manee@company.com", role: "interviewer", status: "inactive" as const },
];

const roleNames = {
  admin: "Admin",
  hr_manager: "HR Manager",
  recruiter: "Recruiter",
  interviewer: "Interviewer",
};

export default function Settings() {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<typeof initialUsers[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: typeof initialUsers[0]) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleSaveUser = (userData: any) => {
    if (userData.id) {
      // Edit existing user
      setUsers(users.map(u => u.id === userData.id ? { ...userData, id: userData.id } : u));
      toast({
        title: "บันทึกข้อมูลแล้ว",
        description: "แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว",
      });
    } else {
      // Add new user
      const newUser = { ...userData, id: Math.max(...users.map(u => u.id)) + 1 };
      setUsers([...users, newUser]);
      toast({
        title: "เพิ่มผู้ใช้แล้ว",
        description: "เพิ่มผู้ใช้ใหม่เรียบร้อยแล้ว",
      });
    }
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "ลบผู้ใช้แล้ว",
      description: `ลบผู้ใช้ ${user?.name} เรียบร้อยแล้ว`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">ตั้งค่า</h1>
        <p className="text-muted-foreground">จัดการการตั้งค่าระบบและบัญชี</p>
      </div>

      <div className="grid gap-4">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>User Management</CardTitle>
            <Button onClick={handleAddUser}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{roleNames[user.role as keyof typeof roleNames]}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <UserManagementDialog
        user={editingUser}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveUser}
      />
    </div>
  );
}
