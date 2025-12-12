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
import { Loader2, Copy, Check, Link, Mail, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SendToManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: Array<{
    id: string;
    name: string;
    position: string;
    resumeFile?: string;
    score?: number | null;
    preScreenComment?: string | null;
  }>;
  onSent: () => void;
}

// Generate a secure random token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function SendToManagerDialog({
  open,
  onOpenChange,
  candidates,
  onSent,
}: SendToManagerDialogProps) {
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerDepartment, setManagerDepartment] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Get unique positions from candidates
  const positions = [...new Set(candidates.map((c) => c.position))].join(", ");

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
        description: "กรุณากรอกชื่อผู้รับ",
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

      // Create invitation record (manager_id is now optional for manual entry)
      const { data: invitation, error: invitationError } = await supabase
        .from('manager_invitations')
        .insert({
          token,
          manager_id: user?.id, // Use current user as fallback
          manager_email: managerEmail.trim(),
          manager_name: managerName.trim(),
          sent_by: user?.id,
          expires_at: expiresAt.toISOString(),
          status: 'pending',
        })
        .select()
        .single();

      if (invitationError) throw invitationError;

      // Create invitation candidates records
      const candidateRecords = candidates.map(c => ({
        invitation_id: invitation.id,
        candidate_id: c.id,
        position: c.position,
        ai_score: c.score || 0,
        pre_screen_comment: c.preScreenComment || null,
        manager_response: 'pending',
      }));

      const { error: candidatesError } = await supabase
        .from('manager_invitation_candidates')
        .insert(candidateRecords);

      if (candidatesError) throw candidatesError;

      // Generate portal URL
      const portalUrl = `${window.location.origin}/manager-portal?token=${token}`;
      setGeneratedUrl(portalUrl);

      // Send email with the portal URL
      const { error } = await supabase.functions.invoke(
        'send-email-with-attachments',
        {
          body: {
            to: managerEmail.trim(),
            toName: managerName.trim(),
            department: managerDepartment.trim() || 'แผนก',
            senderRole: 'HR',
            candidates: candidates.map(c => ({
              id: c.id,
              name: c.name,
              position: c.position,
              resume_url: c.resumeFile,
              ai_score: c.score || 0,
              pre_screen_comment: c.preScreenComment || '-',
            })),
            positions,
            portalUrl,
          },
        }
      );

      if (error) {
        console.warn('Email sending failed, but invitation was created:', error);
        toast({
          title: "สร้าง URL สำเร็จ",
          description: "URL ถูกสร้างแล้ว แต่ไม่สามารถส่งอีเมลได้ กรุณาคัดลอก URL และส่งเอง",
          variant: "default",
        });
      } else {
        toast({
          title: "ส่งอีเมลสำเร็จ",
          description: `ส่ง Resume ของผู้สมัคร ${candidates.length} คนไปยัง ${managerName} แล้ว`,
        });
      }

      onSent();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
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
    setManagerDepartment("");
    setGeneratedUrl("");
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ส่ง Resume ไปยังผู้จัดการ
          </DialogTitle>
          <DialogDescription>
            เลือกผู้จัดการที่ต้องการส่ง Resume ของผู้สมัคร {candidates.length} คน
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto flex-1">
          {/* Manual Input Fields */}
          {!generatedUrl && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="managerName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  ชื่อผู้รับ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="managerName"
                  placeholder="เช่น คุณสมชาย ใจดี"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="border-border/50 focus:border-primary"
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
                  className="border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerDepartment">แผนก (ไม่บังคับ)</Label>
                <Input
                  id="managerDepartment"
                  placeholder="เช่น ฝ่ายขาย, IT, บัญชี"
                  value={managerDepartment}
                  onChange={(e) => setManagerDepartment(e.target.value)}
                  className="border-border/50 focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Generated URL Display */}
          {generatedUrl && (
            <div className="space-y-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Link className="h-4 w-4" />
                <span className="text-sm font-medium">URL สำหรับผู้จัดการ (หมดอายุใน 7 วัน)</span>
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
              <p className="text-xs text-green-600">
                URL นี้ถูกส่งไปยังอีเมล {managerEmail} แล้ว หรือคุณสามารถคัดลอกและส่งเองได้
              </p>
            </div>
          )}

          {/* Email Preview - Modern Card Design */}
          {managerName && managerEmail && !generatedUrl && (
            <div className="space-y-3">
              <label className="text-sm font-medium">ตัวอย่างอีเมล</label>
              <div className="border rounded-xl overflow-hidden shadow-sm">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 p-4 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl mx-auto mb-2 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-base">ผู้สมัครรอพิจารณา</h3>
                  <p className="text-white/80 text-xs mt-1">
                    {candidates.length} คน | ตำแหน่ง {positions}
                  </p>
                </div>

                {/* Content */}
                <div className="bg-white p-4 space-y-4">
                  {/* Greeting */}
                  <div>
                    <p className="text-sm text-gray-700">
                      สวัสดีค่ะ <span className="font-semibold text-indigo-600">{managerName}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ฝ่าย <span className="font-medium text-indigo-600">HR</span> ขอส่งรายชื่อผู้สมัครที่ผ่านการ Pre-Screen เบื้องต้น
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-lg p-3">
                    <div className="text-center">
                      <p className="text-xl font-bold text-indigo-600">{candidates.length}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">ผู้สมัครทั้งหมด</p>
                    </div>
                    <div className="text-center border-l border-slate-200">
                      <p className="text-xl font-bold text-emerald-500">
                        {candidates.filter(c => c.resumeFile).length}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Resume แนบ</p>
                    </div>
                  </div>

                  {/* Candidate Cards */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">รายชื่อผู้สมัคร</p>
                    {candidates.slice(0, 3).map((candidate) => {
                      const score = candidate.score ?? 0;
                      const scoreColor = score >= 80 ? 'text-emerald-500 bg-emerald-50' : score >= 60 ? 'text-amber-500 bg-amber-50' : 'text-red-500 bg-red-50';
                      return (
                        <div key={candidate.id} className="border rounded-lg p-3 bg-white">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                              {candidate.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{candidate.name}</p>
                              <p className="text-xs text-gray-500 truncate">{candidate.position}</p>
                            </div>
                            <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${scoreColor}`}>
                              {score}%
                            </div>
                          </div>
                          {candidate.preScreenComment && (
                            <div className="mt-2 pl-12">
                              <div className="text-[10px] bg-slate-50 rounded p-2 border-l-2 border-indigo-400">
                                <p className="text-[9px] font-semibold text-indigo-600 uppercase mb-0.5">Pre-Screen Comment</p>
                                <p className="text-gray-600 line-clamp-2">{candidate.preScreenComment}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {candidates.length > 3 && (
                      <p className="text-xs text-center text-gray-400">
                        และอีก {candidates.length - 3} คน...
                      </p>
                    )}
                  </div>

                  {/* CTA Button Preview */}
                  <div className="text-center pt-2">
                    <div className="inline-block px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg shadow-md">
                      ดูรายละเอียดและนัดสัมภาษณ์
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">ลิงก์นี้จะหมดอายุใน 7 วัน</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-4 py-2 text-center border-t">
                  <p className="text-[10px] text-gray-400">
                    ส่งจากระบบ <span className="font-medium text-indigo-500">Core-Fit</span> HR Recruitment
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0">
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
              className="gap-2"
            >
              {isSending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSending ? "กำลังส่ง..." : (
                <>
                  <Mail className="h-4 w-4" />
                  ส่งอีเมล
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
