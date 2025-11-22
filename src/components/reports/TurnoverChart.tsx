import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TurnoverChartProps {
  trendData: Array<{ period: string; rate: number }>;
  departmentData: Array<{ department: string; rate: number }>;
  title: string;
}

export function TurnoverChart({ trendData, departmentData, title }: TurnoverChartProps) {
  return (
    <Card className="p-6" id={`turnover-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3 className="text-xl font-semibold mb-6">{title}</h3>
      
      <Tabs defaultValue="trend" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="trend">แนวโน้ม</TabsTrigger>
          <TabsTrigger value="department">ตามแผนก</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="period" 
                className="text-sm"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-sm"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'อัตราการลาออก']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Turnover Rate"
                dot={{ fill: '#EF4444', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="department">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="department" 
                className="text-sm"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-sm"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'อัตราการลาออก']}
              />
              <Legend />
              <Bar dataKey="rate" fill="#EF4444" name="Turnover Rate" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
