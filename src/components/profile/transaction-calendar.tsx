'use client';

import { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { transactions, accounts } from '@/lib/data';
import { format, isSameDay, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const getAccountLogo = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return <div className="w-10 h-10 rounded-lg bg-gray-500 flex-shrink-0"></div>;
    const name = account.name.toLowerCase();
    if (name.includes('bca')) return <div className="w-10 h-10 text-xs bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">BCA</div>;
    if (name.includes('gopay')) return <div className="w-10 h-10 text-xs bg-sky-500 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">GP</div>;
    if (name.includes('ovo')) return <div className="w-10 h-10 text-xs bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">OVO</div>;
    return <div className="w-10 h-10 rounded-lg bg-gray-500 flex-shrink-0"></div>;
}

const currentNetWorth = accounts
    .filter(acc => acc.type !== 'loan')
    .reduce((sum, acc) => sum + acc.balance, 0) - 
    accounts
    .filter(acc => acc.type === 'loan')
    .reduce((sum, acc) => sum + acc.balance, 0);


export default function TransactionCalendar() {
    const [date, setDate] = useState<Date>(new Date());
    
    const transactionsOnSelectedDate = useMemo(() => transactions.filter(t => 
        date && isSameDay(new Date(t.date), date)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [date]);

    const transactionDates = useMemo(() => transactions.map(t => new Date(t.date)), []);
    
    const balanceOnSelectedDate = useMemo(() => {
        if (!date) return currentNetWorth;
    
        const selectedDate = new Date(date);
        selectedDate.setHours(23, 59, 59, 999); // Consider end of day
    
        const transactionsAfter = transactions.filter(t => new Date(t.date) > selectedDate);
        const netChangeAfter = transactionsAfter.reduce((sum, t) => sum + t.amount, 0);
    
        return currentNetWorth - netChangeAfter;
    }, [date]);

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

    return (
        <div className="bg-card p-5 rounded-2xl border border-border shadow-lg">
            <div className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                        if (newDate) {
                            setDate(newDate);
                        }
                    }}
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
                <h3 className="font-bold text-white mb-2 text-lg">
                    Activity on {date ? format(date, 'PPP') : 'selected date'}
                </h3>
                
                <div className="mb-4 text-center">
                    <p className="text-sm text-muted-foreground">Balance at end of day</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(dailySummary.balanceOnDate)}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div className="bg-secondary p-3 rounded-lg flex flex-col justify-center min-h-[90px]">
                        <p className="text-xs text-muted-foreground">Spent</p>
                        <p className="font-bold text-red-400 text-sm">{formatCurrency(dailySummary.spent)}</p>
                    </div>
                    <div className="bg-secondary p-3 rounded-lg flex flex-col justify-center min-h-[90px]">
                        <p className="text-xs text-muted-foreground">Received</p>
                        <p className="font-bold text-green-400 text-sm">{formatCurrency(dailySummary.received)}</p>
                    </div>
                    <div className="bg-secondary p-3 rounded-lg flex flex-col justify-center min-h-[90px]">
                        <p className="text-xs text-muted-foreground">Net Change</p>
                        <p className={cn("font-bold text-sm", dailySummary.net >= 0 ? 'text-green-400' : 'text-red-400')}>
                            {dailySummary.net >= 0 ? '+' : ''}{formatCurrency(dailySummary.net)}
                        </p>
                         {(dailySummary.spent > 0 || dailySummary.received > 0) && Math.abs(dailySummary.percentage) > 0.001 ? (
                            <p className={cn("text-xs font-semibold", dailySummary.net >= 0 ? 'text-green-400/70' : 'text-red-400/70')}>
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
                                        {getAccountLogo(t.accountId)}
                                        <div>
                                            <p className="font-semibold text-white">{t.description}</p>
                                            <p className="text-xs text-muted-foreground">{format(new Date(t.date), 'p')}</p>
                                        </div>
                                    </div>
                                    <p className={cn(
                                        "font-bold font-mono",
                                        t.amount > 0 ? "text-green-400" : "text-red-400"
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
