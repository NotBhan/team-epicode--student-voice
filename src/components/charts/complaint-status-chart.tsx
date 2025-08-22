'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Complaint, ProblemStatus } from '@/lib/types';

const COLORS: Record<ProblemStatus, string> = {
    'Solved': 'hsl(var(--chart-2))',
    'Unsolved': 'hsl(var(--chart-4))',
    'Rejected': 'hsl(var(--chart-1))',
    'Approved and Under Investigation': 'hsl(var(--chart-5))',
    'Pending Verification': 'hsl(var(--chart-4))',
};

const chartConfig = {
  complaints: {
    label: 'Complaints',
  },
  'Solved': {
    label: 'Solved',
    color: 'hsl(var(--chart-2))',
  },
  'Unsolved': {
    label: 'Unsolved',
    color: 'hsl(var(--chart-4))',
  },
  'Rejected': {
    label: 'Rejected',
    color: 'hsl(var(--chart-1))',
  },
  'Approved and Under Investigation': {
    label: 'Under Investigation',
    color: 'hsl(var(--chart-5))',
  },
  'Pending Verification': {
    label: 'Pending Verification',
    color: 'hsl(var(--chart-4))',
  }
} satisfies ChartConfig;

interface ComplaintStatusChartProps {
  data: Complaint[];
}

export function ComplaintStatusChart({ data }: ComplaintStatusChartProps) {
    const statusCounts = data.reduce((acc, complaint) => {
        acc[complaint.status] = (acc[complaint.status] || 0) + 1;
        return acc;
    }, {} as Record<ProblemStatus, number>);

    const chartData = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        fill: COLORS[status as ProblemStatus] || 'hsl(var(--muted))'
    }));


  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="status"
          innerRadius={60}
          strokeWidth={5}
        >
            {chartData.map((entry) => (
                <Cell key={`cell-${entry.status}`} fill={entry.fill} />
            ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
