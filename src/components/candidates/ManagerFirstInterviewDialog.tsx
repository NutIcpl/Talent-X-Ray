import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Send, Save, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// 7 evaluation criteria
const evaluationCriteria = [
  { key: "skill", label: "1. ทักษะและความรู้ในงาน – ความรู้และประสบการณ์ตรงกับตำแหน่ง" },
  { key: "communication", label: "2. การสื่อสาร – ชัดเจน เข้าใจง่าย ตอบคำถามตรงประเด็น" },
  { key: "creativity", label: "3. ความคิดสร้างสรรค์ – นำเสนอความคิดในตำแหน่งเอง และเป็นจริง" },
  { key: "motivation", label: "4. แรงจูงใจ – แสดงความสนใจและตั้งใจอยากทำงานจริง ๆ" },
  { key: "teamwork", label: "5. การทำงานร่วมกับคนอื่น – ร่วมงานกับผู้อื่น เปิดใจและ Teamwork" },
  { key: "problemSolving", label: "6. การคิดวิเคราะห์และแก้ปัญหา – สามารถคิดเป็นระบบรับมือกับสถานการณ์ได้ดี" },
  { key: "culture", label: "7. วัฒนธรรมองค์กร – ทัศนคติและพฤติกรรมเข้ากับค่านิยมขององค์กร" },
];

const interviewSchema = z.object({
  interviewDate: z.date({
    required_error: "กรุณาเลือกวันที่สัมภาษณ์",
  }),
  skill: z.string().optional(),
  communication: z.string().optional(),
  creativity: z.string().optional(),
  motivation: z.string().optional(),
  teamwork: z.string().optional(),
  problemSolving: z.string().optional(),
  culture: z.string().optional(),
  feedback: z.string().optional(),
});

type InterviewFormValues = z.infer<typeof interviewSchema>;

export interface FirstInterviewEvaluationData {
  interviewDate: string;
  scores: {
    skill: number | null;
    communication: number | null;
    creativity: number | null;
    motivation: number | null;
    teamwork: number | null;
    problemSolving: number | null;
    culture: number | null;
  };
  totalScore: number;
  result: 'passed' | 'pending' | 'failed';
  feedback: string;
}

interface ManagerFirstInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  position: string;
  existingData?: FirstInterviewEvaluationData;
  onSave: (data: FirstInterviewEvaluationData) => Promise<void>;
  onSubmitAndSend: (data: FirstInterviewEvaluationData) => Promise<void>;
}

function getResultBadge(totalScore: number) {
  if (totalScore >= 45) {
    return <Badge className="bg-green-500">ผ่านเกณฑ์ (≥45)</Badge>;
  } else {
    return <Badge variant="destructive">ไม่ผ่าน (&lt;45)</Badge>;
  }
}

function getResult(totalScore: number): 'passed' | 'failed' {
  if (totalScore >= 45) return 'passed';
  return 'failed';
}

export function ManagerFirstInterviewDialog({
  open,
  onOpenChange,
  candidateName,
  position,
  existingData,
  onSave,
  onSubmitAndSend,
}: ManagerFirstInterviewDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      interviewDate: new Date(),
      skill: "",
      communication: "",
      creativity: "",
      motivation: "",
      teamwork: "",
      problemSolving: "",
      culture: "",
      feedback: "",
    },
  });

  // Watch all score fields to calculate total
  const watchedValues = form.watch();
  const totalScore = evaluationCriteria.reduce((sum, criterion) => {
    const value = watchedValues[criterion.key as keyof InterviewFormValues];
    const numValue = typeof value === 'string' ? parseInt(value, 10) : 0;
    return sum + (isNaN(numValue) ? 0 : numValue);
  }, 0);

  useEffect(() => {
    if (existingData) {
      form.reset({
        interviewDate: existingData.interviewDate ? new Date(existingData.interviewDate) : new Date(),
        skill: existingData.scores.skill?.toString() || "",
        communication: existingData.scores.communication?.toString() || "",
        creativity: existingData.scores.creativity?.toString() || "",
        motivation: existingData.scores.motivation?.toString() || "",
        teamwork: existingData.scores.teamwork?.toString() || "",
        problemSolving: existingData.scores.problemSolving?.toString() || "",
        culture: existingData.scores.culture?.toString() || "",
        feedback: existingData.feedback || "",
      });
    } else {
      form.reset({
        interviewDate: new Date(),
        skill: "",
        communication: "",
        creativity: "",
        motivation: "",
        teamwork: "",
        problemSolving: "",
        culture: "",
        feedback: "",
      });
    }
  }, [existingData, form, open]);

  const prepareData = (values: InterviewFormValues): FirstInterviewEvaluationData => {
    const scores = {
      skill: values.skill ? parseInt(values.skill, 10) : null,
      communication: values.communication ? parseInt(values.communication, 10) : null,
      creativity: values.creativity ? parseInt(values.creativity, 10) : null,
      motivation: values.motivation ? parseInt(values.motivation, 10) : null,
      teamwork: values.teamwork ? parseInt(values.teamwork, 10) : null,
      problemSolving: values.problemSolving ? parseInt(values.problemSolving, 10) : null,
      culture: values.culture ? parseInt(values.culture, 10) : null,
    };

    const total = Object.values(scores).reduce((sum, val) => sum + (val || 0), 0);

    return {
      interviewDate: values.interviewDate.toISOString(),
      scores,
      totalScore: total,
      result: getResult(total),
      feedback: values.feedback || "",
    };
  };

  const handleSave = async (values: InterviewFormValues) => {
    setIsSaving(true);
    try {
      await onSave(prepareData(values));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitAndSend = async (values: InterviewFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmitAndSend(prepareData(values));
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ประเมินผล First Interview
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 pr-2">
          <Form {...form}>
            <form className="space-y-6">
              {/* Candidate Info */}
              <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <h3 className="font-semibold text-sm">1. ข้อมูลทั่วไปของผู้สมัครงาน</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">ชื่อผู้สมัคร:</span>{" "}
                    <span className="font-medium">{candidateName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ตำแหน่งที่สมัคร:</span>{" "}
                    <span className="font-medium">{position}</span>
                  </div>
                </div>
              </div>

              {/* Interview Date */}
              <FormField
                control={form.control}
                name="interviewDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>วันที่สัมภาษณ์ (First Interview)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>เลือกวันที่</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Evaluation Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">2. การประเมิน</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    • ระดับการประเมินแต่ละหัวข้อ คะแนน 1-10 (น้อยที่สุด = 1, มากที่สุด = 10)<br />
                    • คะแนนประเมินอย่างน้อย 50 คะแนน จากคะแนนเต็ม 70 คะแนน ถือว่าสามารถผ่านเกณฑ์รับเข้าทำงาน
                  </p>
                </div>

                {/* Evaluation Table */}
                <div className="border rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_100px] gap-2 bg-yellow-100 p-3 font-semibold text-xs border-b-2 border-black">
                    <div>หัวข้อการประเมินผลการสัมภาษณ์</div>
                    <div className="text-center">First Interview</div>
                  </div>

                  {/* Criteria Rows */}
                  <div className="p-3 space-y-1">
                    {evaluationCriteria.map((criterion) => (
                      <div key={criterion.key} className="grid grid-cols-[1fr_100px] gap-2 items-center py-2 border-b">
                        <div className="text-xs">{criterion.label}</div>
                        <FormField
                          control={form.control}
                          name={criterion.key as keyof InterviewFormValues}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  placeholder="0-10"
                                  className="text-center h-9"
                                  {...field}
                                  value={field.value as string}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Total Score */}
                  <div className="grid grid-cols-[1fr_100px] gap-2 bg-yellow-50 p-3 border-t-2 border-black">
                    <div className="text-xs font-semibold">
                      รวมคะแนน<br />
                      <span className="text-[10px] font-normal">
                        [ เกณฑ์คะแนน ≥ 50 ผ่านเกณฑ์รับเข้าทำงาน, 45-49 สำรองไว้พิจารณา, &lt; 45 ไม่ผ่านการสัมภาษณ์ ]
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="text-2xl font-bold text-primary">{totalScore}</span>
                      <span className="text-xs text-muted-foreground">/ 70</span>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="grid grid-cols-[1fr_100px] gap-2 p-3 bg-muted/10">
                    <div className="text-xs font-semibold">ผลการประเมิน:</div>
                    <div className="flex justify-center">
                      {getResultBadge(totalScore)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">ความคิดเห็นเพิ่มเติมของผู้สัมภาษณ์</h3>
                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Interview</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="ใส่ข้อคิดเห็นเพิ่มเติมจากการสัมภาษณ์"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="flex-shrink-0 gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving || isSubmitting}
          >
            ปิด
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={form.handleSubmit(handleSave)}
            disabled={isSaving || isSubmitting}
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            บันทึก
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmitAndSend)}
            disabled={isSaving || isSubmitting}
            className="gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            บันทึกและส่งต่อ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
