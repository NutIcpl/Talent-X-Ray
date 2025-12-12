import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FirstInterviewEvaluationData } from "@/components/candidates/ManagerFirstInterviewDialog";

// 7 evaluation criteria
const evaluationCriteria = [
  { key: "skill", label: "1. ทักษะและความรู้ในงาน" },
  { key: "communication", label: "2. การสื่อสาร" },
  { key: "creativity", label: "3. ความคิดสร้างสรรค์" },
  { key: "motivation", label: "4. แรงจูงใจ" },
  { key: "teamwork", label: "5. การทำงานร่วมกับคนอื่น" },
  { key: "problemSolving", label: "6. การคิดวิเคราะห์และแก้ปัญหา" },
  { key: "culture", label: "7. วัฒนธรรมองค์กร" },
];

interface InterviewScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  position: string;
  interviewRound: "first" | "final";
  evaluationData: FirstInterviewEvaluationData | null;
  totalScore?: number;
  firstInterviewScore?: number;
  firstInterviewEvaluation?: FirstInterviewEvaluationData | null;
}

function getResultBadge(totalScore: number) {
  if (totalScore >= 45) {
    return <Badge className="bg-green-500 text-white">ผ่านเกณฑ์</Badge>;
  } else {
    return <Badge variant="destructive">ไม่ผ่าน</Badge>;
  }
}

function getScoreColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 8) return "text-green-600 font-bold";
  if (score >= 6) return "text-blue-600";
  if (score >= 4) return "text-yellow-600";
  return "text-red-600";
}

export function InterviewScoreDialog({
  open,
  onOpenChange,
  candidateName,
  position,
  interviewRound,
  evaluationData,
  totalScore: propTotalScore,
  firstInterviewScore,
  firstInterviewEvaluation,
}: InterviewScoreDialogProps) {
  const totalScore = evaluationData?.totalScore ?? propTotalScore ?? 0;
  const interviewTitle = interviewRound === "first" ? "First Interview" : "Final Interview";
  const isFinalInterview = interviewRound === "final";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            รายละเอียดคะแนน {interviewTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 pr-2 space-y-6">
          {/* Candidate Info */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm">ข้อมูลผู้สมัคร</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ชื่อผู้สมัคร:</span>{" "}
                <span className="font-medium">{candidateName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">ตำแหน่งที่สมัคร:</span>{" "}
                <span className="font-medium">{position}</span>
              </div>
              {evaluationData?.interviewDate && (
                <div>
                  <span className="text-muted-foreground">วันที่สัมภาษณ์:</span>{" "}
                  <span className="font-medium">
                    {format(new Date(evaluationData.interviewDate), "d MMMM yyyy", { locale: th })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Score Summary */}
          <div className={`flex items-center justify-center gap-6 p-6 rounded-xl border ${
            isFinalInterview
              ? 'bg-gradient-to-r from-secondary/5 to-secondary-glow/5'
              : 'bg-gradient-to-r from-primary/5 to-secondary/5'
          }`}>
            {/* First Interview Score (for Final Interview) */}
            {isFinalInterview && firstInterviewScore && (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{firstInterviewScore}</div>
                  <div className="text-xs text-muted-foreground">First Interview</div>
                </div>
                <div className="h-16 w-px bg-border" />
              </>
            )}
            <div className="text-center">
              <div className={`text-5xl font-bold ${isFinalInterview ? 'text-secondary' : 'text-primary'}`}>
                {totalScore}
              </div>
              <div className="text-sm text-muted-foreground">
                {isFinalInterview ? 'Final Interview' : '/ 70 คะแนน'}
              </div>
            </div>
            <div className="h-16 w-px bg-border" />
            <div className="text-center">
              <div className="text-lg font-semibold mb-1">ผลการประเมิน</div>
              {getResultBadge(totalScore)}
            </div>
          </div>

          {/* Score Details - For Final Interview show both rounds */}
          {isFinalInterview ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">รายละเอียดคะแนนแต่ละหัวข้อ</h3>
              <div className="border rounded-lg overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[1fr_80px_80px] gap-2 bg-secondary/10 p-3 font-semibold text-xs">
                  <div>หัวข้อการประเมิน</div>
                  <div className="text-center text-primary">First</div>
                  <div className="text-center text-secondary">Final</div>
                </div>

                {/* Score Rows */}
                <div className="divide-y">
                  {evaluationCriteria.map((criterion) => {
                    const firstScore = firstInterviewEvaluation?.scores?.[criterion.key as keyof typeof firstInterviewEvaluation.scores] ?? null;
                    const finalScore = evaluationData?.scores?.[criterion.key as keyof typeof evaluationData.scores] ?? null;
                    return (
                      <div key={criterion.key} className="grid grid-cols-[1fr_80px_80px] gap-2 items-center p-3">
                        <div className="text-sm">{criterion.label}</div>
                        <div className={`text-center text-lg ${getScoreColor(firstScore)}`}>
                          {firstScore !== null ? firstScore : "-"}
                        </div>
                        <div className={`text-center text-lg ${getScoreColor(finalScore)}`}>
                          {finalScore !== null ? finalScore : "-"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="grid grid-cols-[1fr_80px_80px] gap-2 bg-secondary/5 p-3 border-t-2">
                  <div className="font-semibold text-sm">รวมคะแนน</div>
                  <div className="text-center text-xl font-bold text-primary">
                    {firstInterviewScore || firstInterviewEvaluation?.totalScore || "-"}
                  </div>
                  <div className="text-center text-xl font-bold text-secondary">
                    {totalScore}
                  </div>
                </div>

                {/* Result Row */}
                <div className="grid grid-cols-[1fr_80px_80px] gap-2 bg-muted/30 p-3">
                  <div className="font-semibold text-sm">ผลการประเมิน</div>
                  <div className="text-center">
                    {(firstInterviewScore || firstInterviewEvaluation?.totalScore) ?
                      getResultBadge(firstInterviewScore || firstInterviewEvaluation?.totalScore || 0) : "-"}
                  </div>
                  <div className="text-center">
                    {getResultBadge(totalScore)}
                  </div>
                </div>
              </div>
            </div>
          ) : evaluationData?.scores && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">รายละเอียดคะแนนแต่ละหัวข้อ</h3>
              <div className="border rounded-lg overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[1fr_80px] gap-2 bg-primary/10 p-3 font-semibold text-xs">
                  <div>หัวข้อการประเมิน</div>
                  <div className="text-center">คะแนน</div>
                </div>

                {/* Score Rows */}
                <div className="divide-y">
                  {evaluationCriteria.map((criterion) => {
                    const score = evaluationData.scores[criterion.key as keyof typeof evaluationData.scores];
                    return (
                      <div key={criterion.key} className="grid grid-cols-[1fr_80px] gap-2 items-center p-3">
                        <div className="text-sm">{criterion.label}</div>
                        <div className={`text-center text-lg ${getScoreColor(score)}`}>
                          {score !== null ? score : "-"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="grid grid-cols-[1fr_80px] gap-2 bg-primary/5 p-3 border-t-2">
                  <div className="font-semibold text-sm">รวมคะแนน</div>
                  <div className="text-center text-xl font-bold text-primary">
                    {totalScore}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback - For Final Interview show both */}
          {isFinalInterview ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">ความคิดเห็นจากผู้สัมภาษณ์</h3>
              {firstInterviewEvaluation?.feedback && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-xs font-semibold text-primary mb-2">First Interview</div>
                  <p className="text-sm whitespace-pre-wrap">{firstInterviewEvaluation.feedback}</p>
                </div>
              )}
              {evaluationData?.feedback && (
                <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                  <div className="text-xs font-semibold text-secondary mb-2">Final Interview</div>
                  <p className="text-sm whitespace-pre-wrap">{evaluationData.feedback}</p>
                </div>
              )}
              {!firstInterviewEvaluation?.feedback && !evaluationData?.feedback && (
                <div className="p-4 bg-muted/30 rounded-lg text-center text-muted-foreground text-sm">
                  ไม่มีความคิดเห็นเพิ่มเติม
                </div>
              )}
            </div>
          ) : evaluationData?.feedback && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">ความคิดเห็นจากผู้สัมภาษณ์</h3>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{evaluationData.feedback}</p>
              </div>
            </div>
          )}

          {/* No evaluation data */}
          {!evaluationData && (
            <div className="text-center py-8 text-muted-foreground">
              <p>ยังไม่มีรายละเอียดคะแนนจากผู้สัมภาษณ์</p>
              <p className="text-sm mt-1">คะแนนรวม: {totalScore}</p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            ปิด
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
