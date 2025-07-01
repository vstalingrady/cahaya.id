'use client';

import * as React from 'react';
import { Wallet } from "lucide-react";
import NoiseOverlay from "../noise-overlay";
import { Line, LineChart, Area, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "../ui/chart";
import { type Transaction } from "@/lib/data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { format } from 'date-fns';


type TotalBalanceProps = {
  amount: number;
  transactions: Transaction[];
};

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


export default function TotalBalance({ amount, transactions }: TotalBalanceProps) {
  const [chartData, setChartData] = React.useState<any[]>([]);

  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  React.useEffect(() => {
    const generateChartData = (currentBalance: number, allTransactions: Transaction[], days: number) => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (days - 1));
        startDate.setHours(0, 0, 0, 0);

        const relevantTransactions = allTransactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= startDate && tDate <= today;
        });

        const totalChangeInPeriod = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
        let startOfPeriodNetWorth = currentBalance - totalChangeInPeriod;

        const data = [];
        let runningBalance = startOfPeriodNetWorth;
        
        for (let i = 0; i < days; i++) {
            const loopDate = new Date(startDate);
            loopDate.setDate(startDate.getDate() + i);

            const dailyTransactions = allTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getFullYear() === loopDate.getFullYear() &&
                       tDate.getMonth() === loopDate.getMonth() &&
                       tDate.getDate() === loopDate.getDate();
            });

            const dailyChange = dailyTransactions.reduce((sum, t) => sum + t.amount, 0);
            runningBalance += dailyChange;

            data.push({
                date: loopDate,
                netWorth: runningBalance,
                transactions: dailyTransactions,
            });
        }

        if(data.length > 0) {
          data[data.length - 1].netWorth = currentBalance;
        }
        
        return data;
    };
    
    setChartData(generateChartData(amount, transactions, 14));
  }, [amount, transactions]);
  
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
    <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-red-700/30 relative overflow-hidden">
      <NoiseOverlay opacity={0.1} />
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"></div>
      <div className="relative z-10">
        <div className="flex flex-col gap-4">
            <div>
                 <h2 className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wide flex items-center gap-2"><Wallet className="w-4 h-4" /> Total Net Worth</h2>
                <div className="text-3xl font-black mb-2 text-white">{formattedAmount}</div>
                <div className="flex items-center text-green-400 text-sm font-semibold">
                    <span className="text-base mr-1">↗</span>
                    <span>+ Rp 1.200.000 today</span>
                </div>
            </div>
            <div className="h-24 relative">
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
            </div>
        </div>
      </div>
    </div>
  );
}
