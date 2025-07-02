'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Wallet, Loader2, Calendar } from "lucide-react";
import NoiseOverlay from "../noise-overlay";
import { type Transaction } from "@/lib/data";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const BalanceChart = dynamic(() => import('./balance-chart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
    </div>
  ),
});


type TotalBalanceProps = {
  amount: number;
  transactions: Transaction[];
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
        // Determine the most recent date from transactions, or use today if none exist
        const latestTransactionDate = allTransactions.length > 0
            ? allTransactions.reduce((latest, t) => new Date(t.date) > latest ? new Date(t.date) : latest, new Date(0))
            : new Date();
        
        const today = new Date(latestTransactionDate);
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
            if (dailyTransactions.length > 0) {
              runningBalance += dailyChange;
            }

            data.push({
                date: loopDate,
                netWorth: runningBalance,
                transactions: dailyTransactions,
            });
        }

        // Ensure the last point correctly reflects the current balance
        if(data.length > 0) {
          data[data.length - 1].netWorth = currentBalance;
        }
        
        return data;
    };
    
    // Use a timeout to ensure data processing happens after initial mount
    const timer = setTimeout(() => {
        setChartData(generateChartData(amount, transactions, 14));
    }, 1);

    return () => clearTimeout(timer);
  }, [amount, transactions]);

  const dailyChange = React.useMemo(() => {
    if (chartData.length === 0) return 0;
    const lastDayData = chartData[chartData.length - 1];
    if (!lastDayData || !lastDayData.transactions) return 0;
    return lastDayData.transactions.reduce((acc: number, t: Transaction) => acc + t.amount, 0);
  }, [chartData]);

  const formattedDailyChange = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(dailyChange);

  return (
    <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-red-700/30 relative overflow-hidden">
      <NoiseOverlay opacity={0.1} />
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"></div>
      <div className="relative z-10">
        <div className="flex flex-col gap-4">
            <div>
                 <div className="flex justify-between items-center mb-1">
                    <h2 className="text-xs text-muted-foreground font-bold uppercase tracking-wide flex items-center gap-2"><Wallet className="w-4 h-4" /> Total Net Worth</h2>
                    <Link href="/history" passHref>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-red-700/50 text-red-300 hover:text-red-200 -mr-2">
                          <Calendar className="w-4 h-4" />
                      </Button>
                    </Link>
                 </div>
                <div className="text-3xl font-black mb-2 text-white">{formattedAmount}</div>
                 {dailyChange !== 0 && (
                  <div className={cn(
                    "flex items-center text-sm font-semibold",
                    dailyChange > 0 ? "text-green-400" : "text-red-400"
                  )}>
                      <span className="text-base mr-1">{dailyChange > 0 ? '↗' : '↘'}</span>
                      <span>{dailyChange > 0 ? '+' : ''}{formattedDailyChange} today</span>
                  </div>
                )}
            </div>
            <div className="h-40 relative">
                {chartData.length > 0 ? (
                    <BalanceChart chartData={chartData} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
