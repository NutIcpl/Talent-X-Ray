import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";

const candidateFormSchema = z.object({
  name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  position: z.string().min(1, "กรุณาระบุตำแหน่งที่สมัคร"),
  experience: z.string().min(1, "กรุณาระบุประสบการณ์"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  phone: z.string().min(9, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
  location: z.string().optional(),
  education: z.string().optional(),
  previousCompany: z.string().optional(),
  summary: z.string().optional(),
  skills: z.string().min(1, "กรุณาระบุทักษะ"),
  status: z.enum(["screening", "interview", "shortlisted", "rejected", "hired"]),
  score: z.number().min(0).max(100),
});

type CandidateFormValues = z.infer<typeof candidateFormSchema>;

interface CandidateFormDialogProps {
  candidate?: {
    id: number;
    name: string;
    position: string;
    experience: string;
    score: number;
    skills: string[];
    appliedDate: string;
    status: string;
    email: string;
    phone: string;
    location?: string;
    education?: string;
    summary?: string;
    previousCompany?: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (candidate: any) => void;
}

export function CandidateFormDialog({ candidate, open, onOpenChange, onSave }: CandidateFormDialogProps) {
  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      name: "",
      position: "",
      experience: "",
      email: "",
      phone: "",
      location: "",
      education: "",
      previousCompany: "",
      summary: "",
      skills: "",
      status: "screening",
      score: 0,
    },
  });

  useEffect(() => {
    if (candidate) {
      form.reset({
        name: candidate.name,
        position: candidate.position,
        experience: candidate.experience,
        email: candidate.email,
        phone: candidate.phone,
        location: candidate.location,
        education: candidate.education,
        previousCompany: candidate.previousCompany || "",
        summary: candidate.summary,
        skills: candidate.skills.join(", "),
        status: candidate.status as any,
        score: candidate.score,
      });
    } else {
      form.reset({
        name: "",
        position: "",
        experience: "",
        email: "",
        phone: "",
        location: "",
        education: "",
        previousCompany: "",
        summary: "",
        skills: "",
        status: "screening",
        score: 0,
      });
    }
  }, [candidate, form]);

  const handleSubmit = (data: CandidateFormValues) => {
    const candidateData = {
      ...data,
      skills: data.skills.split(",").map(s => s.trim()),
      appliedDate: candidate?.appliedDate || "วันนี้",
    };
    
    onSave(candidate ? { ...candidateData, id: candidate.id } : candidateData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{candidate ? "แก้ไขข้อมูลผู้สมัคร" : "เพิ่มผู้สมัครใหม่"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อ-นามสกุล</FormLabel>
                    <FormControl>
                      <Input placeholder="สมชาย ใจดี" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="somchai@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เบอร์โทรศัพท์</FormLabel>
                    <FormControl>
                      <Input placeholder="081-234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ที่อยู่</FormLabel>
                    <FormControl>
                      <Input placeholder="กรุงเทพมหานคร" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ตำแหน่งที่สมัคร</FormLabel>
                    <FormControl>
                      <Input placeholder="Senior Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ประสบการณ์</FormLabel>
                    <FormControl>
                      <Input placeholder="5 ปี" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>การศึกษา</FormLabel>
                    <FormControl>
                      <Input placeholder="ปริญญาตรี วิทยาการคอมพิวเตอร์" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="previousCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>บริษัทเดิม (ถ้ามี)</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>สถานะ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกสถานะ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="screening">กำลังคัดกรอง</SelectItem>
                        <SelectItem value="interview">รอสัมภาษณ์</SelectItem>
                        <SelectItem value="shortlisted">รายชื่อสั้น</SelectItem>
                        <SelectItem value="rejected">ไม่ผ่านคัดเลือก</SelectItem>
                        <SelectItem value="hired">รับเข้าทำงาน</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Fit Score (0-100)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="85" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ทักษะ (คั่นด้วยเครื่องหมายจุลภาค)</FormLabel>
                  <FormControl>
                    <Input placeholder="React, Node.js, TypeScript" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ข้อมูลสรุป</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="ข้อมูลประวัติและประสบการณ์โดยสรุป..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                ยกเลิก
              </Button>
              <Button type="submit">
                {candidate ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มผู้สมัคร"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
