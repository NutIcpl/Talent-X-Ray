import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const interviewSchema = z.object({
  hrDate: z.string().optional(),
  hrPassed: z.string().optional(),
  hrFeedback: z.string().optional(),
  managerDate: z.string().optional(),
  managerPassed: z.string().optional(),
  managerFeedback: z.string().optional(),
  isTeamDate: z.string().optional(),
  isTeamPassed: z.string().optional(),
  isTeamFeedback: z.string().optional(),
});

type InterviewFormValues = z.infer<typeof interviewSchema>;

interface CandidateInterviewDialogProps {
  interviews?: {
    hr?: { date: string; passed: boolean; feedback: string };
    manager?: { date: string; passed: boolean; feedback: string };
    isTeam?: { date: string; passed: boolean; feedback: string };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (interviews: any) => void;
}

export function CandidateInterviewDialog({ interviews, open, onOpenChange, onSave }: CandidateInterviewDialogProps) {
  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      hrDate: "",
      hrPassed: "",
      hrFeedback: "",
      managerDate: "",
      managerPassed: "",
      managerFeedback: "",
      isTeamDate: "",
      isTeamPassed: "",
      isTeamFeedback: "",
    },
  });

  useEffect(() => {
    if (interviews) {
      form.reset({
        hrDate: interviews.hr?.date || "",
        hrPassed: interviews.hr?.passed !== undefined ? (interviews.hr.passed ? "true" : "false") : "",
        hrFeedback: interviews.hr?.feedback || "",
        managerDate: interviews.manager?.date || "",
        managerPassed: interviews.manager?.passed !== undefined ? (interviews.manager.passed ? "true" : "false") : "",
        managerFeedback: interviews.manager?.feedback || "",
        isTeamDate: interviews.isTeam?.date || "",
        isTeamPassed: interviews.isTeam?.passed !== undefined ? (interviews.isTeam.passed ? "true" : "false") : "",
        isTeamFeedback: interviews.isTeam?.feedback || "",
      });
    }
  }, [interviews, form]);

  const handleSubmit = (values: InterviewFormValues) => {
    const interviewData = {
      hr: values.hrDate ? {
        date: values.hrDate,
        passed: values.hrPassed === "true",
        feedback: values.hrFeedback || "",
      } : undefined,
      manager: values.managerDate ? {
        date: values.managerDate,
        passed: values.managerPassed === "true",
        feedback: values.managerFeedback || "",
      } : undefined,
      isTeam: values.isTeamDate ? {
        date: values.isTeamDate,
        passed: values.isTeamPassed === "true",
        feedback: values.isTeamFeedback || "",
      } : undefined,
    };
    
    onSave(interviewData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูลการสัมภาษณ์</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* HR Interview */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-sm">สัมภาษณ์โดย HR</h3>
              
              <FormField
                control={form.control}
                name="hrDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>วันที่สัมภาษณ์</FormLabel>
                    <FormControl>
                      <Input placeholder="เช่น 15/03/2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hrPassed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ผลการสัมภาษณ์</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกผลการสัมภาษณ์" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">ผ่าน</SelectItem>
                        <SelectItem value="false">ไม่ผ่าน</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hrFeedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ข้อคิดเห็น</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ใส่ข้อคิดเห็นจากการสัมภาษณ์" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Manager Interview */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-sm">สัมภาษณ์โดยหัวหน้าแผนก</h3>
              
              <FormField
                control={form.control}
                name="managerDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>วันที่สัมภาษณ์</FormLabel>
                    <FormControl>
                      <Input placeholder="เช่น 18/03/2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerPassed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ผลการสัมภาษณ์</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกผลการสัมภาษณ์" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">ผ่าน</SelectItem>
                        <SelectItem value="false">ไม่ผ่าน</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerFeedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ข้อคิดเห็น</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ใส่ข้อคิดเห็นจากการสัมภาษณ์" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* IS Team Interview */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-sm">สัมภาษณ์โดยทีม IS</h3>
              
              <FormField
                control={form.control}
                name="isTeamDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>วันที่สัมภาษณ์</FormLabel>
                    <FormControl>
                      <Input placeholder="เช่น 20/03/2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isTeamPassed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ผลการสัมภาษณ์</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกผลการสัมภาษณ์" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">ผ่าน</SelectItem>
                        <SelectItem value="false">ไม่ผ่าน</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isTeamFeedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ข้อคิดเห็น</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ใส่ข้อคิดเห็นจากการสัมภาษณ์" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                ยกเลิก
              </Button>
              <Button type="submit">
                บันทึก
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
