import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface YieldRatioHeatmapProps {
  data: Array<{
    position: string;
    department: string;
    applyToScreen: number;
    screenToInterview: number;
    interviewToOffer: number;
    offerToHire: number;
  }>;
  onCellClick?: (position: string, stage: string) => void;
}

export function YieldRatioHeatmap({ data, onCellClick }: YieldRatioHeatmapProps) {
  const getColorForRate = (rate: number): string => {
    if (rate >= 0.7) return 'bg-green-500';
    if (rate >= 0.5) return 'bg-green-400';
    if (rate >= 0.3) return 'bg-yellow-400';
    if (rate >= 0.1) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const stages = [
    { key: 'applyToScreen', label: 'Apply→Screen' },
    { key: 'screenToInterview', label: 'Screen→Interview' },
    { key: 'interviewToOffer', label: 'Interview→Offer' },
    { key: 'offerToHire', label: 'Offer→Hire' }
  ];

  return (
    <Card className="p-6" id="yield-ratio-heatmap">
      <h3 className="text-xl font-semibold mb-6">Yield Ratio Heatmap</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border border-border">ตำแหน่ง</th>
              <th className="text-left p-2 border border-border">แผนก</th>
              {stages.map(stage => (
                <th key={stage.key} className="text-center p-2 border border-border text-sm">
                  {stage.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border border-border font-medium text-sm">{row.position}</td>
                <td className="p-2 border border-border text-sm">{row.department}</td>
                {stages.map(stage => {
                  const value = row[stage.key as keyof typeof row] as number;
                  return (
                    <td 
                      key={stage.key} 
                      className="p-2 border border-border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onCellClick?.(row.position, stage.label)}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`w-full h-10 rounded flex items-center justify-center text-white font-medium ${getColorForRate(value)}`}>
                              {(value * 100).toFixed(0)}%
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{row.position} - {stage.label}</p>
                            <p className="font-bold">{(value * 100).toFixed(1)}%</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm">
        <span className="text-muted-foreground">อัตราการผ่าน:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-400" />
          <span>&lt;10%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-400" />
          <span>10-30%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-400" />
          <span>30-50%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-400" />
          <span>50-70%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span>&gt;70%</span>
        </div>
      </div>
    </Card>
  );
}
