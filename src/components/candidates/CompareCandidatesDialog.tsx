import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, Trophy, Medal, Award, CheckCircle2, XCircle, Star } from "lucide-react";
import { CandidateData } from "@/hooks/useCandidatesData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CompareCandidatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: CandidateData[];
}

interface ComparisonResult {
  ranking: {
    candidateId: string;
    candidateName: string;
    rank: number;
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
  }[];
  recommendation: string;
  summary: string;
  detailedAnalysis: string;
}

export function CompareCandidatesDialog({
  open,
  onOpenChange,
  candidates,
}: CompareCandidatesDialogProps) {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [step, setStep] = useState<"select" | "result">("select");

  const toggleCandidate = (candidateId: string) => {
    setSelectedIds((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const selectedCandidates = candidates.filter((c) => selectedIds.includes(c.id));

  const handleCompare = async () => {
    if (selectedIds.length < 2) {
      toast({
        title: "เลือกผู้สมัครอย่างน้อย 2 คน",
        description: "กรุณาเลือกผู้สมัครที่ต้องการเปรียบเทียบอย่างน้อย 2 คน",
        variant: "destructive",
      });
      return;
    }

    setIsComparing(true);

    try {
      // Fetch detailed candidate data
      const candidateDetails = await Promise.all(
        selectedCandidates.map(async (c) => {
          // Get candidate details
          const { data: details } = await supabase
            .from("candidate_details")
            .select("*")
            .eq("candidate_id", c.id)
            .maybeSingle();

          // Get interview data
          const { data: application } = await supabase
            .from("applications")
            .select("id, ai_fit_score, ai_fit_reasoning, notes")
            .eq("candidate_id", c.id)
            .maybeSingle();

          let interviews: any[] = [];
          if (application) {
            const { data: interviewData } = await supabase
              .from("interviews")
              .select("*")
              .eq("application_id", application.id);
            interviews = interviewData || [];
          }

          return {
            ...c,
            details,
            application,
            interviews,
          };
        })
      );

      // Call AI comparison function
      const { data, error } = await supabase.functions.invoke("compare-candidates", {
        body: {
          candidates: candidateDetails.map((c) => ({
            id: c.id,
            name: c.name,
            position: c.position_title,
            email: c.email,
            ai_fit_score: c.ai_fit_score,
            ai_reasoning: c.application?.ai_fit_reasoning,
            ai_breakdown: (() => {
              try {
                return c.application?.notes ? JSON.parse(c.application.notes) : null;
              } catch {
                return null;
              }
            })(),
            details: c.details,
            interviews: c.interviews.map((i: any) => {
              try {
                const notes = i.notes ? JSON.parse(i.notes) : {};
                return {
                  type: notes.type,
                  result: i.result,
                  score: i.score || notes.evaluation?.totalScore,
                  feedback: notes.feedback || notes.evaluation?.feedback,
                };
              } catch {
                return { result: i.result, score: i.score };
              }
            }),
          })),
        },
      });

      if (error) throw error;

      setComparisonResult(data);
      setStep("result");
    } catch (error: any) {
      console.error("Error comparing candidates:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถเปรียบเทียบผู้สมัครได้",
        variant: "destructive",
      });
    } finally {
      setIsComparing(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedIds([]);
    setComparisonResult(null);
    setStep("select");
  };

  const handleBack = () => {
    setStep("select");
    setComparisonResult(null);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200";
      default:
        return "bg-muted/30 border-border";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {step === "select" ? "เปรียบเทียบผู้สมัคร" : "ผลการเปรียบเทียบ"}
          </DialogTitle>
          <DialogDescription>
            {step === "select"
              ? "เลือกผู้สมัครที่ต้องการเปรียบเทียบ (อย่างน้อย 2 คน) แล้ว AI จะวิเคราะห์และจัดอันดับให้"
              : "AI ได้วิเคราะห์และจัดอันดับผู้สมัครตามคุณสมบัติและความเหมาะสม"}
          </DialogDescription>
        </DialogHeader>

        {step === "select" ? (
          <>
            <ScrollArea className="flex-1 max-h-[50vh] pr-4">
              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedIds.includes(candidate.id)
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    }`}
                    onClick={() => toggleCandidate(candidate.id)}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedIds.includes(candidate.id)}
                        onCheckedChange={() => toggleCandidate(candidate.id)}
                      />
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={candidate.photo_url || undefined} alt={candidate.name} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {candidate.position_title || "ไม่ระบุตำแหน่ง"}
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold ${
                            candidate.ai_fit_score
                              ? candidate.ai_fit_score >= 80
                                ? "bg-green-500"
                                : candidate.ai_fit_score >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                              : "bg-gray-400"
                          }`}
                        >
                          {candidate.ai_fit_score || "-"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">AI Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                เลือกแล้ว {selectedIds.length} คน
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleCompare}
                  disabled={selectedIds.length < 2 || isComparing}
                  className="gap-2"
                >
                  {isComparing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      กำลังวิเคราะห์...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      เปรียบเทียบด้วย AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <ScrollArea className="flex-1 max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Ranking */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    อันดับผู้สมัคร
                  </h3>
                  {comparisonResult?.ranking.map((item) => {
                    const candidate = candidates.find((c) => c.id === item.candidateId);
                    return (
                      <div
                        key={item.candidateId}
                        className={`p-4 border rounded-lg ${getRankBgColor(item.rank)}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-10 h-10">
                            {getRankIcon(item.rank)}
                          </div>
                          <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarImage
                              src={candidate?.photo_url || undefined}
                              alt={item.candidateName}
                            />
                            <AvatarFallback>{item.candidateName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{item.candidateName}</span>
                              {item.rank === 1 && (
                                <Badge className="bg-yellow-500 hover:bg-yellow-600">
                                  <Star className="h-3 w-3 mr-1" />
                                  แนะนำ
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              คะแนนรวม: <span className="font-semibold text-primary">{item.overallScore}</span>/100
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div>
                                <div className="text-xs font-medium text-green-600 mb-1 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  จุดแข็ง
                                </div>
                                <ul className="text-xs text-muted-foreground space-y-0.5">
                                  {item.strengths.map((s, i) => (
                                    <li key={i}>• {s}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="text-xs font-medium text-orange-600 mb-1 flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  ข้อควรพิจารณา
                                </div>
                                <ul className="text-xs text-muted-foreground space-y-0.5">
                                  {item.weaknesses.map((w, i) => (
                                    <li key={i}>• {w}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Summary */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">สรุปการเปรียบเทียบ</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {comparisonResult?.summary}
                  </p>
                </div>

                <Separator />

                {/* Recommendation */}
                <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    คำแนะนำจาก AI
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {comparisonResult?.recommendation}
                  </p>
                </div>

                {/* Detailed Analysis */}
                {comparisonResult?.detailedAnalysis && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">การวิเคราะห์เชิงลึก</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {comparisonResult.detailedAnalysis}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>

            <DialogFooter className="pt-4 border-t">
              <Button variant="outline" onClick={handleBack}>
                กลับไปเลือกใหม่
              </Button>
              <Button onClick={handleClose}>ปิด</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
