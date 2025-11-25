import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react";
import { Interview } from "./InterviewFormDialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface StatusBoxProps {
  title: string;
  candidates: Interview[];
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  compact?: boolean;
}

export function StatusBox({ title, candidates, icon: Icon, colorClass, bgClass, compact = false }: StatusBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (compact) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className={`glow-on-hover hover:-translate-y-1 transition-all duration-300 border-border/30`}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-accent/5 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${colorClass}`} />
                  <span>{title}</span>
                  <Badge variant="secondary" className="ml-2">{candidates.length}</Badge>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-2 pt-0">
              {candidates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  ไม่มีรายการ
                </p>
              ) : (
                candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`p-2 rounded-lg border border-border/50 ${bgClass} hover:shadow-sm transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.position}</p>
                      </div>
                      <div className={`h-2 w-2 rounded-full ${colorClass.replace('text-', 'bg-')}`} />
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
          <Icon className={`h-4 w-4 ${colorClass}`} />
          {title}
          <Badge variant="secondary" className="ml-auto">{candidates.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {candidates.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            ไม่มีรายการ
          </p>
        ) : (
          candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`p-2 rounded-lg border border-border/50 ${bgClass} hover:shadow-sm transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{candidate.name}</p>
                  <p className="text-xs text-muted-foreground">{candidate.position}</p>
                </div>
                <div className={`h-2 w-2 rounded-full ${colorClass.replace('text-', 'bg-')}`} />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
