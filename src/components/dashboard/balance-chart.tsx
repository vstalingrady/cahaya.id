'use client';

import * as React from 'react';
import { Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ComposedChart } from "recharts";
import { format } from 'date-fns';
import { type Transaction } from "@/lib/data";
import { ChartConfig, ChartContainer } from "../ui/chart";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from '@/lib/utils';


const chartConfig = {
  netWorth: {
    label: "Net Worth",
    color: "hsl(var(--chart-1))",
  },
  transactions: {
    label: "Transactions",
    color: "hsl(var(--chart-2))",
  }
} satisfies ChartConfig;

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const CustomTransactionDot = (props: any) => {
    const { cx, cy, payload } = props;
    const { transactions } = payload as { transactions: Transaction[], date: Date, netWorth: number };

    if (!transactions || transactions.length === 0) {
        return <circle cx={cx} cy={cy} r={2} fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth={1} />;
    }

    const netChange = transactions.reduce((acc, t) => acc + t.amount, 0);
    const dotColorClass = netChange > 0 ? "fill-green-400 stroke-green-300" : "fill-destructive stroke-red-400";
    const dotRadius = 5;

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <g>
                        <circle cx={cx} cy={cy} r={dotRadius+3} fill="hsl(var(--primary) / 0.3)" className="animate-pulse" />
                        <circle cx={cx} cy={cy} r={dotRadius} strokeWidth={2} className={cn("transition-all", dotColorClass)} />
                    </g>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-popover text-popover-foreground border-border rounded-xl p-0">
                    <div className="flex flex-col gap-2 p-3">
                        <div className="flex justify-between items-center font-bold">
                            <span className="text-white">{format(payload.date, 'eeee, d MMM')}</span>
                            <span className={cn('text-sm font-mono', netChange > 0 ? "text-green-400" : "text-destructive")}>
                                {netChange > 0 ? '+' : ''}{formatCurrency(netChange)}
                            </span>
                        </div>
                        <div className="border-t border-border/50 my-1"></div>
                        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                          {transactions.map((t: Transaction) => (
                              <div key={t.id} className="text-xs flex justify-between items-center">
                                  <div>
                                      <p className="font-semibold text-white">{t.description}</p>
                                      <p className="text-muted-foreground">{t.category}</p>
                                  </div>
                                  <p className={cn("font-mono ml-4", t.amount > 0 ? "text-green-400" : "text-destructive")}>
                                      {formatCurrency(t.amount)}
                                  </p>
                              </div>
                          ))}
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

type BalanceChartProps = {
    chartData: any[];
};

export default function BalanceChart({ chartData }: BalanceChartProps) {
    const yAxisDomain = React.useMemo(() => {
        if (!chartData || chartData.length === 0) {
          return ['auto', 'auto'];
        }
        const netWorthValues = chartData.map(d => d.netWorth);
        const yMin = Math.min(...netWorthValues);
        const yMax = Math.max(...netWorthValues);

        const getNiceDomain = (min: number, max: number, tickCount: number = 4) => {
            const range = max - min;
            if (range <= 0) {
                const buffer = Math.abs(min * 0.1) || 1000;
                return [min - buffer, max + buffer];
            }

            const tempStep = range / (tickCount - 1);
            const magnitude = Math.pow(10, Math.floor(Math.log10(tempStep)));
            const tempStepNormalized = tempStep / magnitude;

            let niceStep;
            if (tempStepNormalized < 1.5) niceStep = 1 * magnitude;
            else if (tempStepNormalized < 3) niceStep = 2 * magnitude;
            else if (tempStepNormalized < 7) niceStep = 5 * magnitude;
            else niceStep = 10 * magnitude;
            
            const niceMin = Math.floor(min / niceStep) * niceStep;
            const niceMax = Math.ceil(max / niceStep) * niceStep;
            
            return [niceMin, niceMax];
        };
        
        return getNiceDomain(yMin, yMax);
    }, [chartData]);

    const formatYAxisTick = (tick: number) => {
        if (Math.abs(tick) >= 1_000_000_000) {
            return `${(tick / 1_000_000_000).toFixed(1)}B`;
        }
        if (Math.abs(tick) >= 1_000_000) {
            return `${(tick / 1_000_000).toFixed(1)}M`;
        }
        if (Math.abs(tick) >= 1_000) {
            return `${Math.round(tick / 1_000)}K`;
        }
        return tick.toString();
    };

    return (
        <ChartContainer config={chartConfig} className="min-h-0 w-full h-full">
            <ComposedChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="fillNetWorth" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.4}
                        />
                        <stop
                            offset="95%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.05}
                        />
                    </linearGradient>
                    <linearGradient id="strokeNetWorth" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={1} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.5} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    tickMargin={8}
                    tickFormatter={(value) => format(new Date(value), 'd MMM')}
                    interval="preserveStartEnd"
                    minTickGap={40}
                />
                <YAxis
                    dataKey="netWorth"
                    domain={yAxisDomain}
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    tickMargin={5}
                    width={60}
                    tickFormatter={formatYAxisTick}
                    tickCount={4}
                />
                <RechartsTooltip
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1.5, strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                        return (
                            <div className="rounded-xl border border-border bg-popover/80 backdrop-blur-sm p-2 shadow-lg">
                                <div className="grid grid-cols-1 gap-1">
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase text-muted-foreground">
                                            {format(new Date(payload[0].payload.date), 'eeee, d MMM yyyy')}
                                        </span>
                                        <span className="font-bold text-lg text-foreground">
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                        }).format(payload[0].value as number)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                        }
                        return null
                    }}
                />
                <Area
                    dataKey="netWorth"
                    type="monotone"
                    fill="url(#fillNetWorth)"
                    stroke="url(#strokeNetWorth)"
                    strokeWidth={2}
                    dot={<CustomTransactionDot />}
                    activeDot={false}
                    connectNulls
                />
            </ComposedChart>
        </ChartContainer>
    );
}
