import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  roles: string[];
}

export function UsersTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ email: "", name: "", role: "recruiter", password: "" });

  // Fetch all users with their roles
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      // Get all user roles first
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, profiles(id, email, name)");

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        throw rolesError;
      }

      console.log("User roles data:", userRoles);

      // Group roles by user
      const usersMap = new Map<string, User>();
      
      userRoles?.forEach((ur: any) => {
        const userId = ur.user_id;
        const profile = ur.profiles;
        
        if (!usersMap.has(userId)) {
          usersMap.set(userId, {
            id: userId,
            email: profile?.email || "Unknown",
            name: profile?.name || null,
            roles: [],
          });
        }
        
        usersMap.get(userId)!.roles.push(ur.role);
      });

      return Array.from(usersMap.values());
    },
  });

  // Add/Update user role
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      // Remove existing roles
      await supabase.from("user_roles").delete().eq("user_id", userId);
      
      // Add new role (cast to proper type)
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: role as any });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast({ title: "อัปเดตสำเร็จ", description: "บทบาทผู้ใช้ถูกอัปเดตแล้ว" });
      setEditingUser(null);
    },
    onError: (error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add new user
  const addUserMutation = useMutation({
    mutationFn: async ({ email, password, name, role }: { email: string; password: string; name: string; role: string }) => {
      // Sign up new user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Failed to create user");

      // Add role (cast to proper type)
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: authData.user.id, role: role as any });

      if (roleError) throw roleError;

      return authData.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast({ title: "เพิ่มผู้ใช้สำเร็จ", description: "ผู้ใช้ใหม่ถูกสร้างแล้ว" });
      setIsAddUserOpen(false);
      setNewUser({ email: "", name: "", role: "recruiter", password: "" });
    },
    onError: (error: any) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateRole = (userId: string, role: string) => {
    updateUserRoleMutation.mutate({ userId, role });
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-700",
      hr_manager: "bg-blue-100 text-blue-700",
      recruiter: "bg-green-100 text-green-700",
      manager: "bg-purple-100 text-purple-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Admin",
      hr_manager: "HR Manager",
      recruiter: "Recruiter",
      manager: "Manager",
    };
    return labels[role] || role;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>จัดการผู้ใช้และบทบาทในระบบ</CardDescription>
          </div>
          <Button onClick={() => setIsAddUserOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            เพิ่มผู้ใช้
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อ</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>บทบาท</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  กำลังโหลด...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  ไม่มีผู้ใช้
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name || "-"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <Badge
                            key={role}
                            className={getRoleBadgeColor(role)}
                          >
                            {getRoleLabel(role)}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">ไม่มีบทบาท</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>แก้ไขบทบาทผู้ใช้</DialogTitle>
              <DialogDescription>
                เลือกบทบาทสำหรับ {editingUser?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>บทบาท</Label>
                <Select
                  defaultValue={editingUser?.roles[0] || "recruiter"}
                  onValueChange={(value) => {
                    if (editingUser) {
                      handleUpdateRole(editingUser.id, value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="hr_manager">HR Manager</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add User Dialog */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มผู้ใช้ใหม่</DialogTitle>
              <DialogDescription>
                สร้างบัญชีผู้ใช้ใหม่ในระบบ
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>อีเมล</Label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>ชื่อ-นามสกุล</Label>
                <Input
                  placeholder="ชื่อ นามสกุล"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>รหัสผ่าน</Label>
                <Input
                  type="password"
                  placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>บทบาท</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="hr_manager">HR Manager</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                ยกเลิก
              </Button>
              <Button
                onClick={() => {
                  if (!newUser.email || !newUser.password || newUser.password.length < 6) {
                    toast({
                      title: "ข้อมูลไม่ครบถ้วน",
                      description: "กรุณากรอกอีเมลและรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)",
                      variant: "destructive",
                    });
                    return;
                  }
                  addUserMutation.mutate({
                    email: newUser.email,
                    password: newUser.password,
                    name: newUser.name,
                    role: newUser.role,
                  });
                }}
                disabled={addUserMutation.isPending}
              >
                {addUserMutation.isPending ? "กำลังเพิ่ม..." : "เพิ่มผู้ใช้"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
