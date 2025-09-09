'use client';

import * as React from 'react';
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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--chart-1))',
  },
};

export default function PriceChart({ ticker }: { ticker: string }) {
  const chartData = React.useMemo(() => {
    const data = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    let currentDate = startDate;
    let currentPrice = Math.random() * 100 + 50; // Start price between 50 and 150

    while (currentDate <= endDate) {
      data.push({
        date: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        price: parseFloat(currentPrice.toFixed(2)),
      });
      currentPrice += (Math.random() - 0.49) * 5; // Fluctuate price
      if(currentPrice < 10) currentPrice = 10;
      currentDate.setDate(currentDate.getDate() + 7); // ~Weekly data points
    }
    return data;
  }, [ticker]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg">Price History (1Y)</CardTitle>
        <CardDescription>
          Historical price movement for {ticker}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0.1}/>
                </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value, index) => {
                  if (chartData.length > 12 && index % Math.floor(chartData.length/6) !== 0) return "";
                  return value;
              }}
            />
            <YAxis
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value}`}
             />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillPrice)"
              stroke="var(--color-price)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
