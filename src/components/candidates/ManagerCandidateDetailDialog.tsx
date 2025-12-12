import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  FileText,
  Briefcase,
  GraduationCap,
  User,
  ExternalLink,
  Loader2,
  MapPin,
  Calendar,
  Star,
  Download,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InvitationCandidate {
  id: string;
  candidate_id: string;
  position: string;
  ai_score: number;
  pre_screen_comment: string | null;
  manager_response: string;
  candidate: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    resume_url: string | null;
    photo_url: string | null;
  };
}

interface CandidateDetails {
  educations?: any[];
  work_experiences?: any[];
  language_skills?: any[];
  other_skills?: string | null;
  expected_salary?: string | null;
  // Additional fields from candidate_details table
  position?: string | null;
  birth_date?: string | null;
  age?: string | null;
  id_card?: string | null;
  mobile_phone?: string | null;
  present_address?: string | null;
  district?: string | null;
  province?: string | null;
  zip_code?: string | null;
  training_curriculums?: string | null;
  employment_records?: any[] | null;
  hr_test_score?: number | null;
  department_test_score?: number | null;
}

interface ManagerCandidateDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: InvitationCandidate;
}

export function ManagerCandidateDetailDialog({
  open,
  onOpenChange,
  candidate,
}: ManagerCandidateDetailDialogProps) {
  const [details, setDetails] = useState<CandidateDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!open || !candidate.candidate_id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("candidate_details")
          .select("*")
          .eq("candidate_id", candidate.candidate_id)
          .maybeSingle();

        if (!error && data) {
          setDetails(data as CandidateDetails);
        }
      } catch (err) {
        console.error("Error fetching candidate details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [open, candidate.candidate_id]);

  const handleViewResume = () => {
    if (candidate.candidate?.resume_url) {
      window.open(candidate.candidate.resume_url, "_blank");
    }
  };

  // AI Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-amber-500";
    return "from-red-500 to-orange-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Candidate Photo */}
              <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-lg">
                <AvatarImage src={candidate.candidate?.photo_url || undefined} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-white">
                  {candidate.candidate?.name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>

              {/* Candidate Info */}
              <div className="flex-1">
                <DialogTitle className="text-2xl mb-2">{candidate.candidate?.name || 'ไม่ระบุชื่อ'}</DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {candidate.position}
                  </Badge>
                  {candidate.manager_response === 'interested' && (
                    <Badge className="bg-green-100 text-green-700">นัดสัมภาษณ์แล้ว</Badge>
                  )}
                  {candidate.manager_response === 'not_interested' && (
                    <Badge className="bg-red-100 text-red-700">ไม่สนใจ</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Score Badge */}
            <div className="relative flex-shrink-0">
              <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${getScoreColor(candidate.ai_score)} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                {candidate.ai_score}
              </div>
              {candidate.ai_score >= 90 && (
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="h-3 w-3 text-white fill-white" />
                </div>
              )}
              <div className="text-xs text-center mt-1 text-muted-foreground">AI Score</div>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                ข้อมูลติดต่อ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.candidate?.email || '-'}</span>
                </div>
                {(candidate.candidate?.phone || details?.mobile_phone) && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.candidate?.phone || details?.mobile_phone}</span>
                  </div>
                )}
                {details?.present_address && (
                  <div className="flex items-center gap-3 text-sm col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {details.present_address}
                      {details.district && `, ${details.district}`}
                      {details.province && `, ${details.province}`}
                      {details.zip_code && ` ${details.zip_code}`}
                    </span>
                  </div>
                )}
                {details?.birth_date && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>วันเกิด: {new Date(details.birth_date).toLocaleDateString('th-TH')}</span>
                  </div>
                )}
                {details?.id_card && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>บัตรประชาชน: {details.id_card}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Resume File */}
            {candidate.candidate?.resume_url && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3">เอกสารประกอบการสมัคร</h3>
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium">Resume / CV</div>
                      <div className="text-sm text-muted-foreground">คลิกเพื่อดูไฟล์ Resume ฉบับเต็ม</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleViewResume}>
                      <Download className="h-4 w-4 mr-2" />
                      เปิดดู
                    </Button>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Position & Expected Salary */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                ตำแหน่งที่สมัคร
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium">{details?.position || candidate.position}</span>
                  {details?.expected_salary && (
                    <span className="text-muted-foreground">• เงินเดือนที่คาดหวัง: {Number(details.expected_salary).toLocaleString()} บาท</span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Pre-Screen Comment */}
            {candidate.pre_screen_comment && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Comment Pre-Screen จาก HR</h3>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">{candidate.pre_screen_comment}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Employment Records */}
            {details?.employment_records && details.employment_records.length > 0 && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    ประวัติการทำงาน
                  </h3>
                  <div className="space-y-4">
                    {details.employment_records.map((record: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-base">{record.position || 'ไม่ระบุตำแหน่ง'}</div>
                            <div className="text-sm text-primary font-medium">{record.company || 'ไม่ระบุบริษัท'}</div>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            ประสบการณ์ที่ {index + 1}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                          {record.period_time && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">ระยะเวลา:</span>
                              <span className="font-medium">{record.period_time}</span>
                            </div>
                          )}
                          {record.salary && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">เงินเดือน:</span>
                              <span className="font-medium">{record.salary.toLocaleString()} บาท</span>
                            </div>
                          )}
                        </div>

                        {record.responsibilities && (
                          <div className="mb-3">
                            <div className="text-sm text-muted-foreground mb-1">หน้าที่รับผิดชอบ:</div>
                            <div className="text-sm whitespace-pre-wrap bg-background/50 p-3 rounded border">
                              {record.responsibilities}
                            </div>
                          </div>
                        )}

                        {record.reason_for_leaving && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">เหตุผลที่ลาออก:</div>
                            <div className="text-sm text-muted-foreground italic">
                              {record.reason_for_leaving}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Work Experience (legacy format) */}
            {details?.work_experiences && details.work_experiences.length > 0 && !details.employment_records?.length && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    ประสบการณ์ทำงาน
                  </h3>
                  <div className="space-y-3">
                    {(details.work_experiences as any[]).map((exp, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-muted/20">
                        <p className="font-medium">{exp.position || exp.title}</p>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-xs text-muted-foreground">{exp.duration || exp.period}</p>
                        {exp.responsibilities && (
                          <p className="mt-2 text-sm">{exp.responsibilities}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Education */}
            {details?.educations && details.educations.length > 0 && (() => {
              // Filter out education entries that have no meaningful data
              const educationsWithData = (details.educations as any[]).filter(edu => {
                const hasInstitution = edu.institution || edu.school;
                const hasMajor = edu.major || edu.field;
                const hasGpa = edu.gpa;
                // Show only if has at least institution or major
                return hasInstitution || hasMajor || hasGpa;
              });

              if (educationsWithData.length === 0) return null;

              return (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      การศึกษา
                    </h3>
                    <div className="space-y-3">
                      {educationsWithData.map((edu, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-muted/20">
                          {(edu.level || edu.degree) && (
                            <p className="font-medium">{edu.level || edu.degree}</p>
                          )}
                          {(edu.institution || edu.school) && (
                            <p className="text-sm text-muted-foreground">{edu.institution || edu.school}</p>
                          )}
                          {(edu.major || edu.field) && (
                            <p className="text-sm text-muted-foreground">{edu.major || edu.field}</p>
                          )}
                          {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              );
            })()}

            {/* Training Curriculums */}
            {details?.training_curriculums && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3">การฝึกอบรม / หลักสูตร</h3>
                  <p className="text-sm whitespace-pre-wrap">{details.training_curriculums}</p>
                </div>
                <Separator />
              </>
            )}

            {/* Language Skills */}
            {details?.language_skills && details.language_skills.length > 0 && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3">ทักษะภาษา</h3>
                  <div className="flex flex-wrap gap-2">
                    {(details.language_skills as any[]).map((lang, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {lang.language}: {lang.level || `พูด ${lang.speaking}, อ่าน ${lang.reading}, เขียน ${lang.writing}`}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Other Skills */}
            {details?.other_skills && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3">ทักษะอื่นๆ</h3>
                  <p className="text-sm whitespace-pre-wrap">{details.other_skills}</p>
                </div>
                <Separator />
              </>
            )}

            {/* Test Scores */}
            {(details?.hr_test_score || details?.department_test_score) && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4">คะแนนแบบทดสอบ</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <div className="text-sm text-muted-foreground mb-1">แบบทดสอบส่วนกลาง (HR)</div>
                      <div className="text-3xl font-bold text-primary">
                        {details?.hr_test_score ?? "-"}
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <div className="text-sm text-muted-foreground mb-1">แบบทดสอบเฉพาะแผนก</div>
                      <div className="text-3xl font-bold text-primary">
                        {details?.department_test_score ?? "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* View Resume Button at bottom */}
            {candidate.candidate?.resume_url && (
              <div className="pt-4 border-t">
                <Button onClick={handleViewResume} className="w-full gap-2">
                  <FileText className="h-4 w-4" />
                  ดู Resume ฉบับเต็ม
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
