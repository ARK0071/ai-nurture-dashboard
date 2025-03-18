
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HistoricalChartProps {
  data: { date: string; value: number }[];
  title: string;
  dataKey: string;
  unit: string;
  color: string;
  minValue?: number;
  maxValue?: number;
}

const HistoricalChart = ({ 
  data, 
  title, 
  dataKey, 
  unit, 
  color,
  minValue,
  maxValue 
}: HistoricalChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[minValue || 'auto', maxValue || 'auto']} 
                tick={{ fontSize: 12 }} 
                unit={unit}
              />
              <Tooltip
                formatter={(value) => [`${value} ${unit}`, dataKey]}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalChart;
