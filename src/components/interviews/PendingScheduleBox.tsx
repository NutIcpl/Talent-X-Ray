import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Mail, ChevronDown, ChevronUp, CalendarCheck, XCircle } from "lucide-react";
import { Interview } from "./InterviewFormDialog";
import { toast } from "sonner";
import { addSparkleEffect } from "@/lib/sparkle";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface PendingScheduleBoxProps {
  candidates: Interview[];
  onSchedule: (candidateId: string, timeSlot: string) => void;
  onReject: (candidateId: string) => void;
  bookedSlots: Set<string>;
  compact?: boolean;
}

// Format ISO date to Thai datetime string
function formatSlotTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return format(date, "d MMM yyyy HH:mm น.", { locale: th });
  } catch {
    return isoString;
  }
}

// Check if slot is an ISO date string
function isIsoDateString(str: string): boolean {
  return str.includes("T") || str.includes("-");
}

export function PendingScheduleBox({ candidates, onSchedule, onReject, bookedSlots, compact = false }: PendingScheduleBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReject = (candidate: Interview, e: React.MouseEvent) => {
    e.stopPropagation();
    onReject(candidate.id);
  };

  const handleSchedule = (candidate: Interview, timeSlot: string, e: React.MouseEvent) => {
    addSparkleEffect(e);
    onSchedule(candidate.id, timeSlot);
    
    // Simulate sending emails
    toast.success(
      <div className="space-y-1">
        <p className="font-semibold">นัดสัมภาษณ์สำเร็จ!</p>
        <p className="text-sm">ส่งอีเมลแจ้งเตือนไปยัง:</p>
        <ul className="text-xs space-y-0.5 ml-4">
          <li>✓ ผู้สมัคร: {candidate.candidateEmail || candidate.name}</li>
          <li>✓ ผู้จัดการ: {candidate.managerEmail || candidate.interviewer}</li>
          <li>✓ เพิ่มในปฏิทินแล้ว</li>
        </ul>
      </div>
    );
  };

  if (compact) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="glow-on-hover hover:-translate-y-1 transition-all duration-300 border-yellow-500/30">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-accent/5 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span>รอนัดสัมภาษณ์</span>
                  <Badge variant="secondary" className="ml-2">{candidates.length}</Badge>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3 pt-0">
              {candidates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  ไม่มีผู้สมัครที่รอนัดสัมภาษณ์
                </p>
              ) : (
                candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-3 rounded-lg border border-border/50 bg-card/50 space-y-2 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.position}</p>
                        {candidate.candidateEmail && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Mail className="h-3 w-3" />
                            {candidate.candidateEmail}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {candidate.interviewRound === "first" ? "รอบแรก" : "รอบสุดท้าย"}
                      </Badge>
                    </div>
                    
                    {candidate.proposedSlots && candidate.proposedSlots.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          เวลาที่ Manager เสนอ:
                        </p>
                        <div className="flex flex-col gap-2">
                          {candidate.proposedSlots.map((slot, index) => (
                            <Button
                              key={slot}
                              size="sm"
                              variant="outline"
                              onClick={(e) => handleSchedule(candidate, slot, e)}
                              disabled={bookedSlots.has(slot)}
                              className={cn(
                                "text-xs transition-all justify-start",
                                bookedSlots.has(slot)
                                  ? "opacity-40 cursor-not-allowed bg-muted"
                                  : "hover:bg-primary hover:text-primary-foreground hover:scale-105"
                              )}
                            >
                              <CalendarCheck className="h-3 w-3 mr-2" />
                              <span className="font-medium mr-1">ช่วง {index + 1}:</span>
                              {isIsoDateString(slot) ? formatSlotTime(slot) : slot}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reject Button */}
                    <div className="pt-2 border-t border-border/30">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleReject(candidate, e)}
                        className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start"
                      >
                        <XCircle className="h-3 w-3 mr-2" />
                        ปฏิเสธการสัมภาษณ์
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

  return (
    <Card className="glow-on-hover hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          รอนัดสัมภาษณ์
          <Badge variant="secondary" className="ml-auto">{candidates.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {candidates.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            ไม่มีผู้สมัครที่รอนัดสัมภาษณ์
          </p>
        ) : (
          candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="p-3 rounded-lg border border-border/50 bg-card/50 space-y-2 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">{candidate.position}</p>
                  {candidate.candidateEmail && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {candidate.candidateEmail}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {candidate.interviewRound === "first" ? "รอบแรก" : "รอบสุดท้าย"}
                </Badge>
              </div>
              
              {candidate.proposedSlots && candidate.proposedSlots.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    เวลาที่ Manager เสนอ:
                  </p>
                  <div className="flex flex-col gap-2">
                    {candidate.proposedSlots.map((slot, index) => (
                      <Button
                        key={slot}
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleSchedule(candidate, slot, e)}
                        disabled={bookedSlots.has(slot)}
                        className={cn(
                          "text-xs transition-all justify-start",
                          bookedSlots.has(slot)
                            ? "opacity-40 cursor-not-allowed bg-muted"
                            : "hover:bg-primary hover:text-primary-foreground hover:scale-105"
                        )}
                      >
                        <CalendarCheck className="h-3 w-3 mr-2" />
                        <span className="font-medium mr-1">ช่วง {index + 1}:</span>
                        {isIsoDateString(slot) ? formatSlotTime(slot) : slot}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reject Button */}
              <div className="pt-2 border-t border-border/30">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => handleReject(candidate, e)}
                  className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start"
                >
                  <XCircle className="h-3 w-3 mr-2" />
                  ปฏิเสธการสัมภาษณ์
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
