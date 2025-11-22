import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CostBreakdownChartProps {
  data: {
    onboarding: number;
    training: number;
    supervision: number;
    otj: number;
    laborProportion: number;
  };
}

export function CostBreakdownChart({ data }: CostBreakdownChartProps) {
  const chartData = [
    {
      category: 'Cost to OPL',
      'Onboarding': data.onboarding,
      'Training': data.training,
      'Supervision': data.supervision,
      'On-the-Job': data.otj,
      'Labor Proportion': data.laborProportion
    }
  ];

  return (
    <Card className="p-6" id="cost-breakdown-chart">
      <h3 className="text-xl font-semibold mb-6">องค์ประกอบต้นทุน Cost to OPL</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            type="number"
            className="text-sm"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            type="category"
            dataKey="category"
            className="text-sm"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            formatter={(value: number) => `฿${value.toLocaleString()}`}
          />
          <Legend />
          <Bar dataKey="Onboarding" stackId="a" fill="#3B82F6" />
          <Bar dataKey="Training" stackId="a" fill="#10B981" />
          <Bar dataKey="Supervision" stackId="a" fill="#F59E0B" />
          <Bar dataKey="On-the-Job" stackId="a" fill="#8B5CF6" />
          <Bar dataKey="Labor Proportion" stackId="a" fill="#EC4899" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Cost to OPL รวม: <span className="font-bold text-foreground">
            ฿{Object.values(data).reduce((a, b) => a + b, 0).toLocaleString()}
          </span>
        </p>
      </div>
    </Card>
  );
}
