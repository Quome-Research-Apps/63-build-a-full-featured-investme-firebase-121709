'use client';

import * as React from 'react';
import type { Holding } from '@/app/page';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, Label } from 'recharts';
import { cn } from '@/lib/utils';

type PortfolioOverviewProps = {
  holdings: Holding[];
};

const chartConfig = {
  value: { label: 'USD' },
};

export default function PortfolioOverview({ holdings }: PortfolioOverviewProps) {
  const { totalValue, totalReturn, chartData, colors } = React.useMemo(() => {
    const totalValue = holdings.reduce((acc, h) => acc + h.currentPrice * h.shares, 0);
    const totalCost = holdings.reduce((acc, h) => acc + h.purchasePrice * h.shares, 0);
    const totalReturn = totalValue - totalCost;

    const colors = holdings.map((_, i) => `hsl(var(--chart-${(i % 5) + 1}))`);
    
    const chartData = holdings.map((h, i) => ({
      ticker: h.ticker,
      value: h.currentPrice * h.shares,
      fill: colors[i],
    }));

    return { totalValue, totalReturn, chartData, colors };
  }, [holdings]);
  
  const totalReturnPercentage = totalValue > 0 ? (totalReturn / (totalValue - totalReturn)) * 100 : 0;
  const isProfit = totalReturn >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    <span>Total Value</span>
                </div>
                <p className="text-xl font-semibold mt-1">
                    {totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
            </div>
             <div className="p-4 bg-muted/50 rounded-lg">
                <div className={cn("flex items-center gap-2", isProfit ? "text-green-600" : "text-red-600")}>
                    {isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>Total Return</span>
                </div>
                <p className={cn("text-xl font-semibold mt-1", isProfit ? "text-green-600" : "text-red-600")}>
                    {totalReturn.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    <span className="text-xs ml-2 font-normal">({totalReturnPercentage.toFixed(2)}%)</span>
                </p>
            </div>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-2 text-center">Portfolio Allocation</h3>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="ticker"
                innerRadius="60%"
                outerRadius="80%"
                strokeWidth={2}
                paddingAngle={2}
              >
                 <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-foreground text-sm font-semibold"
                        >
                          Value
                        </text>
                      );
                    }
                  }}
                />
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-xs">
            {chartData.map((entry, index) => (
              <div key={entry.ticker} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span>{entry.ticker}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
