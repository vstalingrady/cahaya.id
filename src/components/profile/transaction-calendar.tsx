
'use client';

import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { type Account, type Transaction, financialInstitutions } from '@/lib/data';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import Image from 'next/image';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const getAccountLogo = (accountId: string, accounts: Account[]) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return <div className="w-10 h-10 rounded-lg bg-gray-500 flex-shrink-0"></div>;
    
    const institution = financialInstitutions.find(inst => inst.slug === account.institutionSlug);

    if (institution?.logoUrl) {
        return (
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm flex-shrink-0">
                <Image
                    src={institution.logoUrl}
                    alt={`${account.name} logo`}
                    width={36}
                    height={36}
                    className="object-contain h-full w-full"
                    data-ai-hint={`${institution.name} logo`}
                />
            </div>
        );
    }
    
    const initials = account.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold flex-shrink-0">{initials}</div>;
}


export default function TransactionCalendar({ transactions, accounts, currentBalance }: { transactions: Transaction[], accounts: Account[], currentBalance: number }) {
    const latestTransactionDate = useMemo(() => 
        transactions.length > 0 
            ? new Date(Math.max(...transactions.map(t => new Date(t.date).getTime())))
            : new Date(), 
    [transactions]);
    
    const [date, setDate] = useState<Date | undefined>(latestTransactionDate);
    
    const transactionsOnSelectedDate = useMemo(() => {
        if (!date) return [];
        return transactions.filter(t => isSameDay(new Date(t.date), date))
               .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }, [date, transactions]);

    const transactionDates = useMemo(() => transactions.map(t => new Date(t.date)), [transactions]);
    
    const balanceOnSelectedDate = useMemo(() => {
        if (!date) return currentBalance;
    
        const selectedDate = new Date(date);
        selectedDate.setHours(23, 59, 59, 999); // Consider end of day
    
        const transactionsAfter = transactions.filter(t => new Date(t.date) > selectedDate);
        const netChangeAfter = transactionsAfter.reduce((sum, t) => sum + t.amount, 0);
    
        return currentBalance - netChangeAfter;
    }, [date, transactions, currentBalance]);

    const dailySummary = useMemo(() => {
        if (!transactionsOnSelectedDate || transactionsOnSelectedDate.length === 0) {
            return { spent: 0, received: 0, net: 0, percentage: 0, balanceOnDate: balanceOnSelectedDate };
        }
        const spent = transactionsOnSelectedDate
            .filter(t => t.amount < 0)
            .reduce((acc, t) => acc + Math.abs(t.amount), 0);
        const received = transactionsOnSelectedDate
            .filter(t => t.amount > 0)
            .reduce((acc, t) => acc + t.amount, 0);
        
        const net = received - spent;
        const startOfDayBalance = balanceOnSelectedDate - net;
        
        const percentage = startOfDayBalance > 0 
            ? (net / startOfDayBalance) * 100 
            : 0;

        return {
            spent,
            received,
            net,
            percentage,
            balanceOnDate: balanceOnSelectedDate,
        };
    }, [transactionsOnSelectedDate, balanceOnSelectedDate]);
    
    // When the transactions prop changes (e.g., user navigates between accounts),
    // update the selected date to the latest transaction in the new set.
    React.useEffect(() => {
      const newLatestDate = transactions.length > 0
        ? new Date(Math.max(...transactions.map(t => new Date(t.date).getTime())))
        : new Date();
      setDate(newLatestDate);
    }, [transactions]);


    return (
        <div className="bg-card p-5 rounded-2xl border border-border shadow-lg">
            <div className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                    modifiers={{
                        hasTransaction: transactionDates,
                    }}
                    modifiersClassNames={{
                        hasTransaction: 'underline decoration-primary/50 underline-offset-4',
                    }}
                    defaultMonth={date}
                />
            </div>
            <div className="mt-4 border-t border-border/50 pt-4">
                <h3 className="font-bold text-card-foreground mb-2 text-lg">
                    Activity on {date ? format(date, 'PPP') : 'selected date'}
                </h3>
                
                <div className="mb-4 text-center">
                    <p className="text-sm text-muted-foreground">Balance at end of day</p>
                    <p className="text-2xl font-bold text-card-foreground">{formatCurrency(dailySummary.balanceOnDate)}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div className="bg-secondary p-3 rounded-lg flex flex-col justify-center min-h-[90px]">
                        <p className="text-xs text-muted-foreground">Spent</p>
                        <p className="font-bold text-destructive text-sm">{formatCurrency(dailySummary.spent)}</p>
                    </div>
                    <div className="bg-secondary p-3 rounded-lg flex flex-col justify-center min-h-[90px]">
                        <p className="text-xs text-muted-foreground">Received</p>
                        <p className="font-bold text-primary text-sm">{formatCurrency(dailySummary.received)}</p>
                    </div>
                    <div className="bg-secondary p-3 rounded-lg flex flex-col justify-center min-h-[90px]">
                        <p className="text-xs text-muted-foreground">Net Change</p>
                        <p className={cn("font-bold text-sm", dailySummary.net >= 0 ? 'text-primary' : 'text-destructive')}>
                            {dailySummary.net >= 0 ? '+' : ''}{formatCurrency(dailySummary.net)}
                        </p>
                         {(dailySummary.spent > 0 || dailySummary.received > 0) && Math.abs(dailySummary.percentage) > 0.001 ? (
                            <p className={cn("text-xs font-semibold", dailySummary.net >= 0 ? 'text-primary opacity-70' : 'text-destructive opacity-70')}>
                                {dailySummary.net >= 0 ? '+' : ''}{dailySummary.percentage.toFixed(2)}%
                            </p>
                         ) : null }
                    </div>
                </div>

                <ScrollArea className="h-72 pr-4 -mr-4">
                    {transactionsOnSelectedDate.length > 0 ? (
                        <div className="space-y-3">
                            {transactionsOnSelectedDate.map(t => (
                                <div key={t.id} className="bg-secondary p-3 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getAccountLogo(t.accountId, accounts)}
                                        <div>
                                            <p className="font-semibold text-card-foreground">{t.description}</p>
                                            <p className="text-xs text-muted-foreground">{format(new Date(t.date), 'p')}</p>
                                        </div>
                                    </div>
                                    <p className={cn(
                                        "font-bold font-mono",
                                        t.amount > 0 ? "text-primary" : "text-destructive"
                                    )}>
                                        {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-muted-foreground text-center py-4">
                                No transactions on this date.
                            </p>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}
