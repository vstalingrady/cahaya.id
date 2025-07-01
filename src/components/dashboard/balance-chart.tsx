'use client';

import * as React from 'react';
import { Line, LineChart, Area, XAxis, YAxis } from "recharts";
import { format } from 'date-fns';
import { type Transaction } from "@/lib/data";
import { ChartConfig, ChartContainer, ChartTooltip } from "../ui/chart";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


const chartConfig = {
  netWorth: {
    label: "Net Worth",
    color: "hsl(var(--primary))",
  },
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
        return <circle cx={cx} cy={cy} r={3} fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth={1.5} />;
    }

    const netChange = transactions.reduce((acc, t) => acc + t.amount, 0);
    let dotColorClass = "fill-primary";
    if (netChange > 0) dotColorClass = "fill-green-400";
    if (netChange < 0) dotColorClass = "fill-red-400";

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <circle cx={cx} cy={cy} r={5} stroke="hsl(var(--background))" strokeWidth={1.5} className={dotColorClass} />
                </TooltipTrigger>
                <TooltipContent>
                    <div className="flex flex-col gap-1">
                        {transactions.map((t: Transaction) => (
                            <div key={t.id} className="text-xs">
                                <p className="font-bold">{t.description}</p>
                                <p className={t.amount > 0 ? "text-green-400" : "text-red-400"}>
                                    {formatCurrency(t.amount)}
                                </p>
                            </div>
                        ))}
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
                const buffer = Math.abs(min * 0.1) || 1;
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
        if (tick >= 1_000_000) {
            return `${(tick / 1_000_000).toFixed(1)}M`;
        }
        if (tick >= 1_000) {
            return `${(tick / 1_000).toFixed(0)}K`;
        }
        return tick.toString();
    };

    return (
        <ChartContainer config={chartConfig} className="min-h-0 w-full h-full">
            <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
                </defs>
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    tickMargin={8}
                    tickFormatter={(value) => format(new Date(value), 'd')}
                    interval="preserveStartEnd"
                    minTickGap={20}
                />
                <YAxis
                    dataKey="netWorth"
                    domain={yAxisDomain}
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    tickMargin={5}
                    width={35}
                    tickFormatter={formatYAxisTick}
                    tickCount={4}
                />
                <ChartTooltip
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1.5, strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                        return (
                            <div className="rounded-lg border bg-background/80 backdrop-blur-sm p-2 shadow-sm">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                            {format(new Date(payload[0].payload.date), 'eeee, d MMM yyyy')}
                                        </span>
                                        <span className="font-bold text-foreground">
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
                    fillOpacity={1}
                    stroke="none"
                    connectNulls
                />
                <Line
                    type="monotone"
                    dataKey="netWorth"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={<CustomTransactionDot />}
                    activeDot={{
                        r: 6,
                        strokeWidth: 2,
                        fill: 'hsl(var(--background))',
                        stroke: 'hsl(var(--primary))',
                    }}
                    connectNulls
                />
            </LineChart>
        </ChartContainer>
    );
}
