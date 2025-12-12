import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const interviewSchema = z.object({
  date: z.date({
    required_error: "กรุณาเลือกวันที่สัมภาษณ์",
  }),
  passed: z.string().min(1, "กรุณาเลือกผลการสัมภาษณ์"),
  feedback: z.string().optional(),
});

type InterviewFormValues = z.infer<typeof interviewSchema>;

interface SingleInterviewDialogProps {
  title: string;
  interview?: { date: string; passed: boolean; feedback: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (interview: { date: string; passed: boolean; feedback: string }) => void;
}

export function SingleInterviewDialog({ title, interview, open, onOpenChange, onSave }: SingleInterviewDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      date: undefined,
      passed: "",
      feedback: "",
    },
  });

  useEffect(() => {
    if (interview) {
      // Parse date string (format: DD/MM/YYYY)
      const dateParts = interview.date?.split('/');
      let parsedDate: Date | undefined;
      if (dateParts && dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(dateParts[2], 10);
        parsedDate = new Date(year, month, day);
      }
      
      setSelectedDate(parsedDate);
      form.reset({
        date: parsedDate,
        passed: interview.passed !== undefined ? (interview.passed ? "true" : "false") : "",
        feedback: interview.feedback || "",
      });
    } else {
      setSelectedDate(undefined);
      form.reset({
        date: undefined,
        passed: "",
        feedback: "",
      });
    }
  }, [interview, form, open]);

  const handleSubmit = (values: InterviewFormValues) => {
    const interviewData = {
      date: format(values.date, "dd/MM/yyyy"),
      passed: values.passed === "true",
      feedback: values.feedback || "",
    };
    
    onSave(interviewData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>บันทึกวันที่สัมภาษณ์และผลการสัมภาษณ์</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>วันที่สัมภาษณ์</FormLabel>
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

            <FormField
              control={form.control}
              name="passed"
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
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ข้อคิดเห็น</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ใส่ข้อคิดเห็นจากการสัมภาษณ์" rows={4} {...field} />
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
                บันทึก
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
