'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';

const chartData = [
  { rating: 'Buy', value: 70, fill: 'hsl(var(--chart-1))' },
  { rating: 'Hold', value: 20, fill: 'hsl(var(--chart-2))' },
  { rating: 'Sell', value: 10, fill: 'hsl(var(--destructive))' },
];

const chartConfig = {
  value: {
    label: 'Value',
  },
  Buy: {
    label: 'Buy',
    color: 'hsl(var(--chart-1))',
  },
  Hold: {
    label: 'Hold',
    color: 'hsl(var(--chart-2))',
  },
  Sell: {
    label: 'Sell',
    color: 'hsl(var(--destructive))',
  },
};

export default function AnalystRatings() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Analyst Ratings</CardTitle>
        <CardDescription>Consensus ratings from top analysts.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="rating"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.rating}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="flex flex-col items-center gap-2 p-6 text-sm">
         <div className="flex items-center gap-2 font-medium leading-none">
          Strong Buy Consensus <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Based on 32 analyst ratings
        </div>
      </div>
    </Card>
  );
}
