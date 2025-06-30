'use client';

import { Wallet } from "lucide-react";
import NoiseOverlay from "../noise-overlay";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "../ui/chart";
import { type Transaction } from "@/lib/data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


type TotalBalanceProps = {
  amount: number;
  transactions: Transaction[];
};

const chartConfig = {
  netWorth: {
    label: "Net Worth",
    color: "hsl(var(--foreground))",
  },
} satisfies ChartConfig;

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const CustomTransactionDot = (props: any) => {
    const { cx, cy, payload } = props;
    const { transactions } = payload as { transactions: Transaction[], day: number, netWorth: number };

    if (!transactions || transactions.length === 0) {
        return null; // Don't render a dot if there are no transactions
    }

    const netChange = transactions.reduce((acc, t) => acc + t.amount, 0);
    let dotColorClass = "fill-background";
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
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  const generateChartData = (currentBalance: number, allTransactions: Transaction[], days: number) => {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today

      const startDate = new Date(today);
      startDate.setDate(today.getDate() - (days - 1));
      startDate.setHours(0, 0, 0, 0); // Set to start of the first day

      // Filter transactions within the date range
      const relevantTransactions = allTransactions.filter(t => {
          const tDate = new Date(t.date);
          return tDate >= startDate && tDate <= today;
      });

      // Calculate the net worth at the beginning of the period
      const totalChangeInPeriod = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
      let startOfMonthNetWorth = currentBalance - totalChangeInPeriod;

      const data = [];
      let runningBalance = startOfMonthNetWorth;
      
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
              day: i + 1,
              netWorth: runningBalance,
              transactions: dailyTransactions,
          });
      }

      // Ensure the final day's balance is exactly the current balance
      if(data.length > 0) {
        data[data.length - 1].netWorth = currentBalance;
      }
      
      return data;
  };
  
  const chartData = generateChartData(amount, transactions, 14);


  return (
    <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-red-700/30 relative overflow-hidden">
      <NoiseOverlay opacity={0.1} />
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"></div>
      <div className="relative z-10">
        <div className="flex flex-col gap-8">
            <div>
                 <h2 className="text-sm text-muted-foreground mb-2 font-bold uppercase tracking-wide flex items-center gap-2"><Wallet className="w-4 h-4" /> Total Net Worth</h2>
                <div className="text-4xl font-black mb-3 text-white">{formattedAmount}</div>
                <div className="flex items-center text-green-400">
                    <span className="text-lg mr-2">↗</span>
                    <span className="font-bold">+ Rp 1.200.000 today</span>
                </div>
            </div>
            <div className="h-24 -mx-6 -mb-6 relative">
                <ChartContainer config={chartConfig} className="min-h-0 w-full h-full">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: 5, bottom: 20 }}
                    >
                         <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--foreground), 0.2)" />
                         <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--foreground))"
                            tickMargin={10}
                            tickFormatter={(value) => `D${value}`}
                            interval={3}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--foreground))"
                            width={50}
                            tickMargin={10}
                            domain={['dataMin - 500000', 'dataMax + 500000']}
                            tickFormatter={(value) => {
                                const num = value as number;
                                if (num >= 1e6) return `${(num / 1e6).toFixed(0)}M`;
                                if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
                                return num.toString();
                            }}
                        />
                        <ChartTooltip
                            cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: "3 3" }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background/80 backdrop-blur-sm p-2 shadow-sm">
                                        <div className="grid grid-cols-1 gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                    Day {payload[0].payload.day}
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
                        <Line
                            type="monotone"
                            dataKey="netWorth"
                            stroke="hsl(var(--foreground))"
                            strokeWidth={2.5}
                            dot={<CustomTransactionDot />}
                        />
                    </LineChart>
                </ChartContainer>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-red-800/50 to-transparent pointer-events-none" />
            </div>
        </div>
      </div>
    </div>
  );
}
