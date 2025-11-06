import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Requisition {
  id: string;
  position: string;
  department: string;
  quantity: number;
  urgency: "High" | "Medium" | "Low";
  justification: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected";
  requestedBy: string;
}

const JobRequisitions = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [requisitions, setRequisitions] = useState<Requisition[]>([
    {
      id: "REQ-001",
      position: "Senior Software Engineer",
      department: "Engineering",
      quantity: 2,
      urgency: "High",
      justification: "ขยายทีมพัฒนาผลิตภัณฑ์ใหม่",
      requestDate: "2024-01-15",
      status: "Approved",
      requestedBy: "สมชาย ใจดี",
    },
    {
      id: "REQ-002",
      position: "Marketing Manager",
      department: "Marketing",
      quantity: 1,
      urgency: "Medium",
      justification: "เตรียมความพร้อมสำหรับแคมเปญใหม่",
      requestDate: "2024-01-20",
      status: "Pending",
      requestedBy: "สมหญิง รักงาน",
    },
  ]);

  const [formData, setFormData] = useState({
    position: "",
    department: "",
    quantity: "1",
    urgency: "Medium" as "High" | "Medium" | "Low",
    justification: "",
    requestedBy: "",
  });

  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "Human Resources",
    "Finance",
    "Operations",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.position || !formData.department || !formData.justification || !formData.requestedBy) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "กรุณากรอกข้อมูลทุกช่องที่มีเครื่องหมาย *",
        variant: "destructive",
      });
      return;
    }

    const newRequisition: Requisition = {
      id: `REQ-${String(requisitions.length + 1).padStart(3, "0")}`,
      position: formData.position,
      department: formData.department,
      quantity: parseInt(formData.quantity),
      urgency: formData.urgency,
      justification: formData.justification,
      requestDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      requestedBy: formData.requestedBy,
    };

    setRequisitions([newRequisition, ...requisitions]);
    setOpen(false);
    
    toast({
      title: "ส่งคำขออนุมัติสำเร็จ",
      description: `คำขออัตรากำลังสำหรับตำแหน่ง ${formData.position} ถูกส่งให้ CEO พิจารณาแล้ว`,
    });

    // Reset form
    setFormData({
      position: "",
      department: "",
      quantity: "1",
      urgency: "Medium",
      justification: "",
      requestedBy: "",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: "secondary",
      Approved: "default",
      Rejected: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="gap-1">
        {getStatusIcon(status)}
        {status === "Pending" ? "รออนุมัติ" : status === "Approved" ? "อนุมัติ" : "ไม่อนุมัติ"}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const colors = {
      High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };

    return (
      <Badge variant="outline" className={colors[urgency as keyof typeof colors]}>
        {urgency === "High" ? "สูง" : urgency === "Medium" ? "กลาง" : "ต่ำ"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">คำขออนุมัติอัตรากำลัง</h1>
          <p className="text-muted-foreground mt-2">
            จัดการคำขออนุมัติตำแหน่งงานใหม่
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              สร้างคำขอใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>สร้างคำขออนุมัติอัตรากำลัง</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลเพื่อขออนุมัติเปิดตำแหน่งงานใหม่
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">
                    ชื่อตำแหน่ง <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="เช่น Senior Software Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">
                    แผนก <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData({ ...formData, department: value })
                    }
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="เลือกแผนก" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">
                    จำนวนที่ต้องการ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">
                    ความเร่งด่วน <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value: "High" | "Medium" | "Low") =>
                      setFormData({ ...formData, urgency: value })
                    }
                  >
                    <SelectTrigger id="urgency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">สูง</SelectItem>
                      <SelectItem value="Medium">กลาง</SelectItem>
                      <SelectItem value="Low">ต่ำ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestedBy">
                  ผู้ขออนุมัติ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="requestedBy"
                  value={formData.requestedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, requestedBy: e.target.value })
                  }
                  placeholder="ชื่อ-นามสกุล"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="justification">
                  เหตุผลในการขออนุมัติ <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="justification"
                  value={formData.justification}
                  onChange={(e) =>
                    setFormData({ ...formData, justification: e.target.value })
                  }
                  placeholder="อธิบายเหตุผลความจำเป็นในการเปิดรับตำแหน่งนี้..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  ยกเลิก
                </Button>
                <Button type="submit">ส่งคำขออนุมัติ</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการคำขออนุมัติ</CardTitle>
          <CardDescription>
            ติดตามสถานะคำขออนุมัติอัตรากำลังทั้งหมด
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัส</TableHead>
                <TableHead>ตำแหน่ง</TableHead>
                <TableHead>แผนก</TableHead>
                <TableHead>จำนวน</TableHead>
                <TableHead>ความเร่งด่วน</TableHead>
                <TableHead>วันที่ขอ</TableHead>
                <TableHead>ผู้ขอ</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requisitions.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.id}</TableCell>
                  <TableCell>{req.position}</TableCell>
                  <TableCell>{req.department}</TableCell>
                  <TableCell>{req.quantity}</TableCell>
                  <TableCell>{getUrgencyBadge(req.urgency)}</TableCell>
                  <TableCell>{new Date(req.requestDate).toLocaleDateString("th-TH")}</TableCell>
                  <TableCell>{req.requestedBy}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobRequisitions;
