import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Gift, UserCheck, UserX } from "lucide-react";
import { Interview } from "./InterviewFormDialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OfferBoxProps {
  candidates: Interview[];
  onHire: (candidateId: string) => void;
  onNotHire: (candidateId: string) => void;
  compact?: boolean;
}

export function OfferBox({ candidates, onHire, onNotHire, compact = false }: OfferBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (compact) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="glow-on-hover hover:-translate-y-1 transition-all duration-300 border-green-500/30">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-accent/5 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-green-500" />
                  <span>Offer</span>
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
                  ไม่มีผู้สมัครที่รอ Offer
                </p>
              ) : (
                candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-3 rounded-lg border border-green-200 bg-green-50/50 dark:bg-green-950/20 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.position}</p>
                      </div>
                      {candidate.score && (
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                          คะแนน: {candidate.score}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onHire(candidate.id)}
                        className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700"
                      >
                        <UserCheck className="h-3 w-3 mr-1" />
                        จ้างงาน
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onNotHire(candidate.id)}
                        className="flex-1 text-xs text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                      >
                        <UserX className="h-3 w-3 mr-1" />
                        ไม่จ้าง
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
    <Card className="glow-on-hover hover:-translate-y-1 transition-all duration-300 border-green-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Gift className="h-4 w-4 text-green-500" />
          Offer
          <Badge variant="secondary" className="ml-auto">{candidates.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {candidates.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            ไม่มีผู้สมัครที่รอ Offer
          </p>
        ) : (
          candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="p-3 rounded-lg border border-green-200 bg-green-50/50 dark:bg-green-950/20 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">{candidate.position}</p>
                </div>
                {candidate.score && (
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    คะแนน: {candidate.score}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onHire(candidate.id)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  จ้างงาน
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNotHire(candidate.id)}
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  ไม่จ้าง
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
