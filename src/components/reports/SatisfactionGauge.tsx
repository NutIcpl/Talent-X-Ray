import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SatisfactionGaugeProps {
  title: string;
  score: number;
  maxScore: number;
  trend: Array<{ period: string; score: number }>;
  description?: string;
}

export function SatisfactionGauge({ title, score, maxScore, trend, description }: SatisfactionGaugeProps) {
  const percentage = (score / maxScore) * 100;
  const lastTrend = trend.length >= 2 ? trend[trend.length - 1].score - trend[trend.length - 2].score : 0;
  
  const getColorClass = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = () => {
    if (lastTrend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (lastTrend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="p-6">
      <h4 className="text-lg font-semibold mb-4">{title}</h4>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-4xl font-bold">{score.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">/ {maxScore}</div>
        </div>

        <Progress value={percentage} className="h-3" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {percentage.toFixed(0)}% ของคะแนนเต็ม
          </span>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={lastTrend > 0 ? 'text-green-600' : lastTrend < 0 ? 'text-red-600' : 'text-muted-foreground'}>
              {lastTrend > 0 ? '+' : ''}{lastTrend.toFixed(1)}
            </span>
          </div>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {/* Mini trend chart */}
        <div className="flex items-end gap-1 h-12">
          {trend.slice(-10).map((item, i) => {
            const height = (item.score / maxScore) * 100;
            return (
              <div
                key={i}
                className={`flex-1 ${getColorClass()} rounded-sm transition-all`}
                style={{ height: `${height}%` }}
                title={`${item.period}: ${item.score}`}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}
