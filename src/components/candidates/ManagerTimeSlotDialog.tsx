import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ManagerTimeSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  onSubmit: (timeSlot1: Date, timeSlot2: Date) => Promise<void>;
}

export function ManagerTimeSlotDialog({
  open,
  onOpenChange,
  candidateName,
  onSubmit,
}: ManagerTimeSlotDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time slot 1
  const [date1, setDate1] = useState("");
  const [time1, setTime1] = useState("");

  // Time slot 2
  const [date2, setDate2] = useState("");
  const [time2, setTime2] = useState("");

  const handleSubmit = async () => {
    // Validate inputs
    if (!date1 || !time1 || !date2 || !time2) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบ",
        description: "ต้องระบุวันและเวลาทั้ง 2 ช่วง",
        variant: "destructive",
      });
      return;
    }

    const timeSlot1 = new Date(`${date1}T${time1}`);
    const timeSlot2 = new Date(`${date2}T${time2}`);

    // Validate dates are in the future
    const now = new Date();
    if (timeSlot1 <= now || timeSlot2 <= now) {
      toast({
        title: "เวลาไม่ถูกต้อง",
        description: "กรุณาเลือกเวลาที่อยู่ในอนาคต",
        variant: "destructive",
      });
      return;
    }

    // Validate time slots are different
    if (timeSlot1.getTime() === timeSlot2.getTime()) {
      toast({
        title: "เวลาซ้ำกัน",
        description: "กรุณาเลือกเวลาที่ต่างกัน",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(timeSlot1, timeSlot2);
      // Reset form
      setDate1("");
      setTime1("");
      setDate2("");
      setTime2("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      setDate1("");
      setTime1("");
      setDate2("");
      setTime2("");
    }
  };

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            นัดหมายสัมภาษณ์
          </DialogTitle>
          <DialogDescription>
            เลือกช่วงเวลาที่สะดวกสัมภาษณ์ <strong>{candidateName}</strong>
            <br />
            <span className="text-orange-600">* ต้องเลือก 2 ช่วงเวลาเพื่อเป็นทางเลือก</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Time Slot 1 */}
          <div className="space-y-3 p-4 border rounded-lg bg-primary/5">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Clock className="h-4 w-4" />
              ช่วงเวลาที่ 1 (หลัก)
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="date1">วันที่</Label>
                <Input
                  id="date1"
                  type="date"
                  min={today}
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  className="border-primary/30 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time1">เวลา</Label>
                <Input
                  id="time1"
                  type="time"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  className="border-primary/30 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Time Slot 2 */}
          <div className="space-y-3 p-4 border rounded-lg bg-secondary/30">
            <div className="flex items-center gap-2 text-secondary-foreground font-medium">
              <Clock className="h-4 w-4" />
              ช่วงเวลาที่ 2 (สำรอง)
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="date2">วันที่</Label>
                <Input
                  id="date2"
                  type="date"
                  min={today}
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time2">เวลา</Label>
                <Input
                  id="time2"
                  type="time"
                  value={time2}
                  onChange={(e) => setTime2(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {date1 && time1 && date2 && time2 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
              <p className="font-medium text-green-700 mb-2">สรุปการนัดหมาย:</p>
              <ul className="space-y-1 text-green-600">
                <li>
                  ช่วง 1: {new Date(`${date1}T${time1}`).toLocaleString('th-TH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </li>
                <li>
                  ช่วง 2: {new Date(`${date2}T${time2}`).toLocaleString('th-TH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </li>
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                ยืนยันนัดหมาย
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
