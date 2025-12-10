import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useJobPositions } from "@/hooks/useJobPositions";
import { Loader2 } from "lucide-react";

interface JobEditDialogProps {
  job: {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    salaryRange: string;
    numberOfPositions: string;
    jobGrade: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function JobEditDialog({ job, open, onOpenChange, onSuccess }: JobEditDialogProps) {
  const { updatePosition } = useJobPositions();
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    employment_type: "",
    salary: "",
    required_count: "",
    job_grade: "",
    description: "",
    requirements: "",
    responsibilities: "",
  });

  useEffect(() => {
    if (job) {
      // Parse required count
      const countMatch = job.numberOfPositions.match(/(\d+)/);
      const requiredCount = countMatch ? countMatch[1] : "1";

      setFormData({
        title: job.title,
        department: job.department,
        location: job.location,
        employment_type: job.type,
        salary: job.salaryRange,
        required_count: requiredCount,
        job_grade: job.jobGrade,
        description: job.description,
        requirements: job.requirements.join("\n"),
        responsibilities: job.responsibilities.join("\n"),
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    try {
      await updatePosition.mutateAsync({
        id: job.id,
        title: formData.title,
        department: formData.department,
        location: formData.location,
        employment_type: formData.employment_type,
        salary: formData.salary || null,
        required_count: parseInt(formData.required_count),
        job_grade: formData.job_grade || null,
        description: formData.description || null,
        requirements: formData.requirements || null,
        responsibilities: formData.responsibilities || null,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">แก้ไขตำแหน่งงาน</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ชื่อตำแหน่ง *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>แผนก *</Label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>สถานที่ *</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>ประเภทการจ้าง *</Label>
              <Select
                value={formData.employment_type}
                onValueChange={(v) => setFormData({ ...formData, employment_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Replacement">Replacement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>เงินเดือน</Label>
              <Input
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="เช่น 25,000-30,000 บาท หรือ ตามตกลง"
              />
            </div>

            <div className="space-y-2">
              <Label>จำนวนอัตรา *</Label>
              <Input
                type="number"
                value={formData.required_count}
                onChange={(e) => setFormData({ ...formData, required_count: e.target.value })}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Job Grade</Label>
              <Input
                value={formData.job_grade}
                onChange={(e) => setFormData({ ...formData, job_grade: e.target.value })}
                placeholder="JG 1.1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>รายละเอียดงาน</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="อธิบายรายละเอียดของตำแหน่งงาน..."
            />
          </div>

          <div className="space-y-2">
            <Label>หน้าที่ความรับผิดชอบ (แยกแต่ละข้อด้วย Enter)</Label>
            <Textarea
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              rows={4}
              placeholder="- หน้าที่ข้อที่ 1&#10;- หน้าที่ข้อที่ 2"
            />
          </div>

          <div className="space-y-2">
            <Label>คุณสมบัติที่ต้องการ (แยกแต่ละข้อด้วย Enter)</Label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={4}
              placeholder="- คุณสมบัติข้อที่ 1&#10;- คุณสมบัติข้อที่ 2"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updatePosition.isPending}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={updatePosition.isPending}>
              {updatePosition.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              บันทึก
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
