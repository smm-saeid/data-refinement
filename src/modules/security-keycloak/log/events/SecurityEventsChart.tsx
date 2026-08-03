
import { Paper, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { SecurityEvent } from '../../types';

interface SecurityEventsChartProps {
  data: SecurityEvent[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

export function SecurityEventsChart({ data }: SecurityEventsChartProps) {

  const activityCounts = data.reduce((acc, event) => {
    const activityType = event.type || 'UNKNOWN';
    acc[activityType] = (acc[activityType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);


  const chartData = Object.entries(activityCounts).map(([name, value], index) => ({
    name: getActivityTypeLabel(name),
    value,
    color: COLORS[index % COLORS.length],
  }));


  chartData.sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        📊 توزیع انواع فعالیت‌ها
      </Typography>
      <Box sx={{ height: 400, direction: 'ltr' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [value.toLocaleString('fa-IR'), 'تعداد']}
              labelFormatter={(label) => `نوع فعالیت: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}


function getActivityTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'LOGIN': 'ورود',
    'LOGOUT': 'خروج',
    'LOGIN_ERROR': 'خطای ورود',
    'LOGOUT_ERROR': 'خطای خروج',
    'CLIENT_LOGIN': 'ورود کلاینت',
    'PERMISSION_TOKEN': 'دسترسی توکن',
    'RESET_PASSWORD_ERROR': 'خطای بازنشانی رمز عبور',
    'CODE_TO_TOKEN_ERROR': 'خطای توکن',
    'UNKNOWN': 'نامشخص'
  };

  return labels[type] || type;
}