import { Card } from '@/components/ui/card';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface SourceTreemapProps {
  data: Array<{ source: string; count: number }>;
  onSourceClick?: (source: string) => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

export function SourceTreemap({ data, onSourceClick }: SourceTreemapProps) {
  const chartData = data.map((item, idx) => ({
    name: item.source,
    size: item.count,
    fill: COLORS[idx % COLORS.length]
  }));

  const CustomContent = (props: any) => {
    const { x, y, width, height, name, size } = props;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: props.fill,
            stroke: '#fff',
            strokeWidth: 2,
            cursor: 'pointer'
          }}
          onClick={() => onSourceClick?.(name)}
        />
        {width > 60 && height > 40 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 10}
              textAnchor="middle"
              fill="#fff"
              fontSize={14}
              fontWeight="bold"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 10}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
            >
              {size}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <Card className="p-6" id="source-treemap">
      <h3 className="text-xl font-semibold mb-6">แหล่งที่มาของผู้สมัคร (Source of Hire)</h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <Treemap
          data={chartData}
          dataKey="size"
          stroke="#fff"
          fill="#8884d8"
          content={<CustomContent />}
        >
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            formatter={(value: number) => [`${value} คน`, 'จำนวน']}
          />
        </Treemap>
      </ResponsiveContainer>
    </Card>
  );
}
