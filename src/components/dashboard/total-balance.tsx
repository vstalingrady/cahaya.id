'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Wallet, Loader2 } from "lucide-react";
import NoiseOverlay from "../noise-overlay";
import { type Transaction } from "@/lib/data";

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
    
    // Use a timeout to ensure data processing happens after initial mount, preventing race conditions
    const timer = setTimeout(() => {
        setChartData(generateChartData(amount, transactions, 14));
    }, 1);

    return () => clearTimeout(timer);
  }, [amount, transactions]);

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
