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
import { useToast } from "@/hooks/use-toast";
import { addSparkleEffect } from "@/lib/sparkle";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Copy, Check, Link, Mail, User, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Interview } from "./InterviewFormDialog";

interface SendToFinalInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: Interview;
  onSent: () => void;
}

// Generate a secure random token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function SendToFinalInterviewDialog({
  open,
  onOpenChange,
  interview,
  onSent,
}: SendToFinalInterviewDialogProps) {
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast({
      title: "คัดลอก URL แล้ว",
      description: "URL ถูกคัดลอกไปยังคลิปบอร์ดแล้ว",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    addSparkleEffect(e);

    // Validate inputs
    if (!managerName.trim()) {
      toast({
        title: "กรุณากรอกชื่อ",
        description: "กรุณากรอกชื่อ Manager ที่จะนัด Final Interview",
        variant: "destructive",
      });
      return;
    }

    if (!managerEmail.trim() || !isValidEmail(managerEmail)) {
      toast({
        title: "อีเมลไม่ถูกต้อง",
        description: "กรุณากรอกอีเมลให้ถูกต้อง",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // Generate unique token
      const token = generateToken();

      // Set expiration to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Get application_id from the interview
      const { data: interviewData, error: fetchError } = await supabase
        .from('interviews')
        .select('application_id, notes')
        .eq('id', interview.id)
        .single();

      if (fetchError) throw fetchError;

      // Parse existing notes to get candidate info
      let candidateId = '';
      let candidateName = interview.name;
      let position = interview.position;

      if (interviewData?.notes) {
        try {
          const notesData = JSON.parse(interviewData.notes);
          candidateId = notesData.candidate_id || '';
          candidateName = notesData.candidate_name || interview.name;
          position = notesData.position || interview.position;
        } catch {
          // notes is plain text
        }
      }

      // Create invitation record for Final Interview
      const { data: invitation, error: invitationError } = await supabase
        .from('manager_invitations')
        .insert({
          token,
          manager_id: user?.id,
          manager_email: managerEmail.trim(),
          manager_name: managerName.trim(),
          sent_by: user?.id,
          expires_at: expiresAt.toISOString(),
          status: 'pending',
        })
        .select()
        .single();

      if (invitationError) throw invitationError;

      // Create invitation candidate record
      const { error: candidateError } = await supabase
        .from('manager_invitation_candidates')
        .insert({
          invitation_id: invitation.id,
          candidate_id: candidateId,
          position: position,
          ai_score: interview.score || 0,
          pre_screen_comment: `ผ่าน First Interview แล้ว - คะแนน: ${interview.score}/70`,
          manager_response: 'pending',
          interview_type: 'final_interview', // Mark as final interview
        });

      if (candidateError) throw candidateError;

      // Create Final Interview record immediately (status: pending, waiting for Manager to select time)
      // This will move the profile to Final Interview section
      const { error: finalInterviewError } = await supabase
        .from('interviews')
        .insert({
          application_id: interviewData.application_id,
          interviewer_id: null,
          scheduled_at: null,
          status: 'scheduled', // Show in Final Interview section immediately
          notes: JSON.stringify({
            candidate_id: candidateId,
            candidate_name: candidateName,
            position: position,
            type: 'final_interview',
            source: 'sent_from_first_interview',
            first_interview_id: interview.id,
            first_interview_score: interview.score,
            first_interview_evaluation: interview.evaluationData,
            invitation_id: invitation.id,
            manager_name: managerName.trim(),
            manager_email: managerEmail.trim(),
            waiting_for_manager: true, // Flag to show waiting status
          }),
        });

      if (finalInterviewError) {
        console.warn('Could not create final interview record:', finalInterviewError);
      }

      // Update the First Interview to mark it as sent to final
      const existingNotes = interviewData?.notes ? JSON.parse(interviewData.notes) : {};
      await supabase
        .from('interviews')
        .update({
          notes: JSON.stringify({
            ...existingNotes,
            sent_to_final: true,
            final_interview_invitation_id: invitation.id,
            sent_to_final_at: new Date().toISOString(),
          }),
        })
        .eq('id', interview.id);

      // Generate portal URL - same URL but system will detect it's for final interview
      const portalUrl = `${window.location.origin}/manager-portal?token=${token}`;
      setGeneratedUrl(portalUrl);

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke(
        'send-email-with-attachments',
        {
          body: {
            to: managerEmail.trim(),
            toName: managerName.trim(),
            department: 'HR',
            senderRole: 'HR',
            candidates: [{
              id: candidateId,
              name: candidateName,
              position: position,
              ai_score: interview.score || 0,
              pre_screen_comment: `ผ่าน First Interview แล้ว - คะแนน: ${interview.score}/70`,
            }],
            positions: position,
            portalUrl,
            isFinalInterview: true, // Flag for final interview email template
          },
        }
      );

      if (emailError) {
        console.warn('Email sending failed, but invitation was created:', emailError);
        toast({
          title: "สร้าง URL สำเร็จ",
          description: "URL ถูกสร้างแล้ว แต่ไม่สามารถส่งอีเมลได้ กรุณาคัดลอก URL และส่งเอง",
          variant: "default",
        });
      } else {
        toast({
          title: "ส่งอีเมลสำเร็จ",
          description: `ส่งคำเชิญ Final Interview ไปยัง ${managerName} แล้ว`,
        });
      }

      onSent();
    } catch (error: any) {
      console.error('Error sending final interview invitation:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถสร้างคำเชิญได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setManagerName("");
    setManagerEmail("");
    setGeneratedUrl("");
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-secondary to-secondary-glow bg-clip-text text-transparent flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            ส่งต่อ Final Interview
          </DialogTitle>
          <DialogDescription>
            ส่งคำเชิญให้ Manager ท่านอื่นเพื่อนัดสัมภาษณ์รอบสุดท้าย
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Candidate Info */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-md">
                {interview.score}
              </div>
              <div>
                <p className="font-semibold text-green-800">{interview.name}</p>
                <p className="text-sm text-green-600">{interview.position}</p>
                <p className="text-xs text-green-500 mt-1">
                  ผ่าน First Interview แล้ว (คะแนน {interview.score}/70)
                </p>
              </div>
            </div>
          </div>

          {/* Manual Input Fields */}
          {!generatedUrl && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="managerName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  ชื่อ Manager <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="managerName"
                  placeholder="เช่น คุณสมชาย ใจดี"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="border-border/50 focus:border-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  อีเมล <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="managerEmail"
                  type="email"
                  placeholder="example@company.com"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  className="border-border/50 focus:border-secondary"
                />
              </div>
            </div>
          )}

          {/* Generated URL Display */}
          {generatedUrl && (
            <div className="space-y-2 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 text-secondary">
                <Link className="h-4 w-4" />
                <span className="text-sm font-medium">URL สำหรับ Final Interview (หมดอายุใน 7 วัน)</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={generatedUrl}
                  readOnly
                  className="text-xs bg-white"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-secondary/80">
                URL นี้ถูกส่งไปยังอีเมล {managerEmail} แล้ว หรือคุณสามารถคัดลอกและส่งเองได้
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSending}
          >
            {generatedUrl ? "ปิด" : "ยกเลิก"}
          </Button>
          {!generatedUrl && (
            <Button
              onClick={handleSend}
              disabled={!managerName.trim() || !managerEmail.trim() || isSending}
              className="gap-2 bg-gradient-to-r from-secondary to-secondary-glow hover:opacity-90"
            >
              {isSending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSending ? "กำลังส่ง..." : (
                <>
                  <Mail className="h-4 w-4" />
                  ส่งคำเชิญ Final Interview
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
