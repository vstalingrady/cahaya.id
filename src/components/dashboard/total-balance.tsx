
'use client';

import { Wallet } from "lucide-react";
import NoiseOverlay from "../noise-overlay";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "../ui/chart";


type TotalBalanceProps = {
  amount: number;
};

const staticChartData = [
    { day: 1, netWorth: 75000000 },
    { day: 2, netWorth: 75200000 },
    { day: 3, netWorth: 75100000 },
    { day: 4, netWorth: 75500000 },
    { day: 5, netWorth: 75800000 },
    { day: 6, netWorth: 76000000 },
    { day: 7, netWorth: 76300000 },
    { day: 8, netWorth: 76200000 },
    { day: 9, netWorth: 76500000 },
    { day: 10, netWorth: 76800000 },
    { day: 11, netWorth: 77000000 },
    { day: 12, netWorth: 77100000 },
    { day: 13, netWorth: 77300000 },
    { day: 14, netWorth: 77600000 },
    { day: 15, netWorth: 77500000 },
    { day: 16, netWorth: 77900000 },
    { day: 17, netWorth: 78200000 },
    { day: 18, netWorth: 78500000 },
    { day: 19, netWorth: 78300000 },
    { day: 20, netWorth: 78700000 },
    { day: 21, netWorth: 79000000 },
    { day: 22, netWorth: 79100000 },
    { day: 23, netWorth: 79400000 },
    { day: 24, netWorth: 79600000 },
    { day: 25, netWorth: 79800000 },
    { day: 26, netWorth: 80000000 },
    { day: 27, netWorth: 80100000 },
    { day: 28, netWorth: 80500000 },
    { day: 29, netWorth: 80300000 },
    { day: 30, netWorth: 81550000 },
];

const chartConfig = {
  netWorth: {
    label: "Net Worth",
    color: "hsl(var(--foreground))",
  },
} satisfies ChartConfig;

export default function TotalBalance({ amount }: TotalBalanceProps) {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  const finalAmount = staticChartData[staticChartData.length - 1].netWorth;
  const ratio = finalAmount > 0 ? amount / finalAmount : 1;
  
  const adjustedData = staticChartData.map(d => ({
    ...d,
    netWorth: Math.round(d.netWorth * ratio)
  }));
  adjustedData[adjustedData.length - 1].netWorth = amount;


  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-8 rounded-3xl shadow-2xl border border-red-400/30 relative overflow-hidden">
      <NoiseOverlay opacity={0.1} />
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
      <div className="relative z-10">
        <div className="flex flex-col gap-8">
            <div>
                 <h2 className="text-sm text-red-100 mb-2 font-bold uppercase tracking-wide flex items-center gap-2"><Wallet className="w-4 h-4" /> Total Net Worth</h2>
                <div className="text-4xl font-black mb-3 text-white">{formattedAmount}</div>
                <div className="flex items-center text-red-200">
                    <span className="text-lg mr-2">↗</span>
                    <span className="font-bold">+ Rp 1.200.000 today</span>
                </div>
            </div>
            <div className="h-48 -mx-8 -mb-8">
                <ChartContainer config={chartConfig} className="min-h-0 w-full h-full">
                    <LineChart
                        data={adjustedData}
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
                            interval={6}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--foreground))"
                            width={50}
                            tickMargin={10}
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
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </div>
        </div>
      </div>
    </div>
  );
}
