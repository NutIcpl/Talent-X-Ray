import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, Video, Send, Eye, BarChart3, CheckCircle, Hourglass } from "lucide-react";
import { Interview } from "./InterviewFormDialog";
import { addSparkleEffect } from "@/lib/sparkle";
import { SendToFinalInterviewDialog } from "./SendToFinalInterviewDialog";
import { InterviewScoreDialog } from "./InterviewScoreDialog";

interface InterviewCardProps {
  interview: Interview;
  onClick: (interview: Interview) => void;
  onRefresh?: () => void;
}

export function InterviewCard({ interview, onClick, onRefresh }: InterviewCardProps) {
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showScoreDialog, setShowScoreDialog] = useState(false);

  // Check if candidate passed First Interview (score >= 45) and it's a first interview and not yet sent to final
  const canSendToFinalInterview =
    interview.status === "completed" &&
    interview.score &&
    interview.score >= 45 &&
    interview.interviewRound === "first" &&
    !interview.sentToFinal;

  // Check if this is a Final Interview
  const isFinalInterview = interview.interviewRound === "final";

  const handleSendClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    addSparkleEffect(e);
    setShowSendDialog(true);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    addSparkleEffect(e);
    onClick(interview);
  };

  const handleViewScoreClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    addSparkleEffect(e);
    setShowScoreDialog(true);
  };

  return (
    <>
    <div
      className="flex items-center justify-between p-4 rounded-xl bg-card hover:shadow-md transition-all group border border-border/50 cursor-pointer glow-on-hover"
      onClick={(e) => {
        addSparkleEffect(e);
        onClick(interview);
      }}
    >
      <div className="flex items-center gap-4">
        {interview.status === "completed" && interview.score ? (
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold shadow-glow ${
            isFinalInterview ? 'bg-gradient-to-br from-secondary to-secondary-glow' : 'bg-gradient-primary'
          }`}>
            {interview.score}
          </div>
        ) : interview.waitingForManager ? (
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-glow">
            <Hourglass className="h-6 w-6" />
          </div>
        ) : (
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-glow animate-float ${
            isFinalInterview ? 'bg-gradient-to-br from-secondary to-secondary-glow' : 'bg-gradient-primary'
          }`}>
            <Video className="h-6 w-6" />
          </div>
        )}
        <div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            {interview.name}
          </h3>
          <p className="text-sm text-muted-foreground">{interview.position}</p>
          {/* Show First Interview score for Final Interview */}
          {isFinalInterview && interview.firstInterviewScore && (
            <p className="text-xs text-green-600 mt-0.5">
              First Interview: {interview.firstInterviewScore}/70
            </p>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {interview.time || (interview.waitingForManager ? 'รอ Manager เลือกเวลา' : '-')}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {interview.type}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {interview.interviewer}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {interview.status === "completed" ? (
          interview.score && interview.score >= 45 ? (
            <>
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                ผ่าน
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewScoreClick}
                className="ml-2"
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                ดูคะแนน
              </Button>
              {canSendToFinalInterview && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSendClick}
                  className="bg-gradient-to-r from-secondary/10 to-secondary-glow/10 border-secondary/30 text-secondary hover:bg-secondary/20"
                >
                  <Send className="h-3 w-3 mr-1" />
                  ส่งต่อ Final
                </Button>
              )}
              {interview.sentToFinal && interview.interviewRound === "first" && (
                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  ส่งแล้ว
                </Badge>
              )}
            </>
          ) : (
            <>
              <Badge variant="destructive">
                ไม่ผ่าน
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewScoreClick}
                className="ml-2"
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                ดูคะแนน
              </Button>
            </>
          )
        ) : interview.waitingForManager ? (
          <>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
              <Hourglass className="h-3 w-3 mr-1" />
              รอ Manager
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewClick}
              className="ml-2"
            >
              <Eye className="h-3 w-3 mr-1" />
              ดูรายละเอียด
            </Button>
          </>
        ) : (
          <>
            <Badge className={`${isFinalInterview ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
              รอสัมภาษณ์
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewClick}
              className="ml-2"
            >
              <Eye className="h-3 w-3 mr-1" />
              ดูรายละเอียด
            </Button>
          </>
        )}
      </div>
    </div>

    {/* Send to Final Interview Dialog */}
    <SendToFinalInterviewDialog
      open={showSendDialog}
      onOpenChange={setShowSendDialog}
      interview={interview}
      onSent={() => {
        setShowSendDialog(false);
        onRefresh?.();
      }}
    />

    {/* Interview Score Dialog */}
    <InterviewScoreDialog
      open={showScoreDialog}
      onOpenChange={setShowScoreDialog}
      candidateName={interview.name}
      position={interview.position}
      interviewRound={interview.interviewRound}
      evaluationData={interview.evaluationData || null}
      totalScore={interview.score}
      firstInterviewScore={interview.firstInterviewScore}
      firstInterviewEvaluation={interview.firstInterviewEvaluation}
    />
    </>
  );
}
