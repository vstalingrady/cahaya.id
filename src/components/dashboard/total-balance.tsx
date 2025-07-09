
'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Wallet, Loader2, Calendar, EyeOff, TrendingUp, TrendingDown } from "lucide-react";
import { type Transaction } from "@/lib/data";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format, isSameDay } from 'date-fns';

const BalanceChart = dynamic(() => import('./balance-chart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
    </div>
  ),
});

type DisplayData = {
    date: Date;
    amount: number;
    change: number;
    percentageChange: number;
};

type TotalBalanceProps = {
  title: string;
  amount: number;
  transactions: Transaction[];
  showHistoryLink?: boolean;
  isPrivate?: boolean;
  isActive?: boolean;
};

type RangeOption = '7D' | '30D' | '1Y' | 'ALL';

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(value);


export default function TotalBalance({ title, amount, transactions, showHistoryLink = false, isPrivate = false, isActive = true }: TotalBalanceProps) {
  const [displayData, setDisplayData] = React.useState<DisplayData | null>(null);
  const [activeRange, setActiveRange] = React.useState<RangeOption>('30D');

  const generateChartData = React.useCallback((currentBalance: number, allTransactions: Transaction[], range: RangeOption) => {
    const sortedTransactions = allTransactions.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const latestTransactionDate = sortedTransactions.length > 0
        ? new Date(sortedTransactions[sortedTransactions.length - 1].date)
        : new Date();
    
    const today = new Date(latestTransactionDate);
    today.setHours(23, 59, 59, 999);

    let startDate: Date;
    let days: number;

    switch(range) {
        case '7D':
            days = 7;
            break;
        case '1Y':
            days = 365;
            break;
        case 'ALL':
             if (sortedTransactions.length === 0) {
                days = 30;
             } else {
                const firstDate = new Date(sortedTransactions[0].date);
                days = Math.ceil((today.getTime() - firstDate.getTime()) / (1000 * 3600 * 24)) + 1;
             }
            break;
        case '30D':
        default:
            days = 30;
            break;
    }

    startDate = new Date(today);
    startDate.setDate(today.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const relevantTransactions = sortedTransactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= startDate && tDate <= today;
    });
    
    const totalChangeInPeriod = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
    let startOfPeriodNetWorth = currentBalance - totalChangeInPeriod;
    
    const data = [];
    let runningBalance = startOfPeriodNetWorth;
    const actualDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

    for (let i = 0; i <= actualDays; i++) {
        const loopDate = new Date(startDate);
        loopDate.setDate(startDate.getDate() + i);

        const dailyTransactions = sortedTransactions.filter(t => isSameDay(new Date(t.date), loopDate));
        const dailyChange = dailyTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        if(i > 0) {
          runningBalance += dailyChange;
        } else {
          runningBalance = startOfPeriodNetWorth + dailyChange;
        }
        
        data.push({
            date: loopDate,
            netWorth: runningBalance,
            transactions: dailyTransactions,
        });
    }
    
    if (data.length > 0) {
        data[data.length - 1].netWorth = currentBalance;
    }

    return data;
  }, []);

  const chartData = React.useMemo(() => {
    if (!isActive) return [];
    return generateChartData(amount, transactions, activeRange);
  }, [amount, transactions, activeRange, isActive, generateChartData]);

  React.useEffect(() => {
    if (chartData.length > 1) {
        const lastPoint = chartData[chartData.length - 1];
        const secondLastPoint = chartData[chartData.length - 2];
        const change = lastPoint.netWorth - secondLastPoint.netWorth;
        const percentageChange = secondLastPoint.netWorth === 0 ? 0 : (change / secondLastPoint.netWorth) * 100;
        setDisplayData({
            date: lastPoint.date,
            amount: lastPoint.netWorth,
            change: change,
            percentageChange: percentageChange
        });
    } else if (chartData.length === 1) {
          setDisplayData({
            date: chartData[0].date,
            amount: chartData[0].netWorth,
            change: 0,
            percentageChange: 0,
        });
    } else {
      setDisplayData(null);
    }
  }, [chartData]);


  const handlePointSelection = React.useCallback((data: any | null) => {
    if (!data || !chartData || chartData.length === 0) {
      // When the user's cursor leaves the chart, reset to the latest data
      if (chartData.length > 0) {
        const lastPoint = chartData[chartData.length - 1];
        const secondLastPoint = chartData.length > 1 ? chartData[chartData.length - 2] : null;
        const change = secondLastPoint ? lastPoint.netWorth - secondLastPoint.netWorth : 0;
        const percentageChange = secondLastPoint && secondLastPoint.netWorth !== 0 ? (change / secondLastPoint.netWorth) * 100 : 0;
        setDisplayData({
            date: lastPoint.date,
            amount: lastPoint.netWorth,
            change: change,
            percentageChange: percentageChange
        });
      }
      return;
    }
    const { point, index } = data;
    const prevPoint = index > 0 ? chartData[index - 1] : null;

    const change = prevPoint ? point.netWorth - prevPoint.netWorth : 0;
    const percentageChange = prevPoint && prevPoint.netWorth !== 0 ? (change / prevPoint.netWorth) * 100 : 0;

    setDisplayData({
      date: point.date,
      amount: point.netWorth,
      change,
      percentageChange
    });
  }, [chartData]);


  return (
    <div className="bg-card p-5 rounded-2xl shadow-lg shadow-primary/10 border border-border/50 relative overflow-hidden bg-gradient-to-br from-card to-primary/10">
      <div className="relative z-10">
        <div className="flex flex-col gap-4">
            <div>
                 <div className="flex justify-between items-center mb-1">
                    <h2 className="text-xs text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-2"><Wallet className="w-4 h-4" /> {title}</h2>
                    {showHistoryLink && (
                      <Link href="/history" passHref>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground -mr-2">
                            <Calendar className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                 </div>
                 {isPrivate ? (
                    <>
                        <div className="text-3xl font-bold mb-2 text-card-foreground">IDR ••••••••</div>
                        <div className="h-5"></div>
                    </>
                 ) : (
                    <>
                        <p className="text-sm text-muted-foreground">
                            {displayData ? format(displayData.date, 'PPP') : 'Current Balance'}
                        </p>
                        <div className="text-3xl font-bold text-card-foreground">
                            {displayData ? formatCurrency(displayData.amount) : <Loader2 className="w-6 h-6 animate-spin" />}
                        </div>
                        {displayData && displayData.change !== 0 && (
                          <div className={cn(
                            "flex items-center text-sm font-semibold",
                            displayData.change >= 0 ? "text-primary" : "text-destructive"
                          )}>
                              {displayData.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
                              <span>{displayData.change >= 0 ? '+' : ''}{formatCurrency(displayData.change)}</span>
                              <span className="text-muted-foreground/80 ml-2">({displayData.change >= 0 ? '+' : ''}{displayData.percentageChange.toFixed(2)}%)</span>
                          </div>
                        )}
                        {displayData && displayData.change === 0 && <div className="h-5" />}
                    </>
                 )}
            </div>
            <div className="h-48 relative -ml-4 -mr-2">
                {isPrivate ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary/30 rounded-lg">
                        <EyeOff className="w-10 h-10 mb-2" />
                        <p className="font-semibold text-sm">Balances are Hidden</p>
                    </div>
                ) : (
                     chartData.length > 0 ? (
                        <BalanceChart chartData={chartData} onPointSelect={handlePointSelection} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                        </div>
                    )
                )}
            </div>
             <div className="flex justify-center gap-2">
                {(['7D', '30D', '1Y', 'ALL'] as RangeOption[]).map((range) => (
                    <Button
                        key={range}
                        variant={activeRange === range ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveRange(range)}
                        className="rounded-full px-4"
                    >
                        {range}
                    </Button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
