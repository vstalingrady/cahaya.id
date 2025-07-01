'use client';

import { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { transactions, accounts } from '@/lib/data';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import NoiseOverlay from '../noise-overlay';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const getAccountLogo = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return <div className="w-10 h-10 rounded-lg bg-gray-500 flex-shrink-0"></div>;
    const name = account.name.toLowerCase();
    if (name.includes('bca')) return <div className="w-10 h-10 text-xs bg-blue-600 text-white rounded-lg flex items-center justify-center font-black flex-shrink-0">BCA</div>;
    if (name.includes('gopay')) return <div className="w-10 h-10 text-xs bg-sky-500 text-white rounded-lg flex items-center justify-center font-black flex-shrink-0">GP</div>;
    if (name.includes('ovo')) return <div className="w-10 h-10 text-xs bg-purple-600 text-white rounded-lg flex items-center justify-center font-black flex-shrink-0">OVO</div>;
    return <div className="w-10 h-10 rounded-lg bg-gray-500 flex-shrink-0"></div>;
}


export default function TransactionCalendar() {
    const latestTransactionDate = transactions.length > 0 ? new Date(transactions[0].date) : new Date();
    const [date, setDate] = useState<Date | undefined>(latestTransactionDate);
    
    const transactionsOnSelectedDate = useMemo(() => transactions.filter(t => 
        date && isSameDay(new Date(t.date), date)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [date]);

    const transactionDates = useMemo(() => transactions.map(t => new Date(t.date)), []);

    const dailySummary = useMemo(() => {
        if (!transactionsOnSelectedDate || transactionsOnSelectedDate.length === 0) {
            return { spent: 0, received: 0, net: 0 };
        }
        const spent = transactionsOnSelectedDate
            .filter(t => t.amount < 0)
            .reduce((acc, t) => acc + Math.abs(t.amount), 0);
        const received = transactionsOnSelectedDate
            .filter(t => t.amount > 0)
            .reduce((acc, t) => acc + t.amount, 0);
        return {
            spent,
            received,
            net: received - spent,
        };
    }, [transactionsOnSelectedDate]);

    return (
        <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
             <NoiseOverlay opacity={0.03} />
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
            <div className="mt-4 border-t border-red-800/50 pt-4">
                <h3 className="font-bold text-white mb-2 text-lg">
                    Activity on {date ? format(date, 'PPP') : 'selected date'}
                </h3>
                
                <div className="flex gap-2 text-center mb-4">
                    <div className="bg-red-950/50 p-2 rounded-lg flex-1 min-w-0">
                        <p className="text-xs text-red-300">Spent</p>
                        <p className="font-bold text-red-400 truncate">{formatCurrency(dailySummary.spent)}</p>
                    </div>
                    <div className="bg-red-950/50 p-2 rounded-lg flex-1 min-w-0">
                        <p className="text-xs text-red-300">Received</p>
                        <p className="font-bold text-green-400 truncate">{formatCurrency(dailySummary.received)}</p>
                    </div>
                    <div className="bg-red-950/50 p-2 rounded-lg flex-1 min-w-0">
                        <p className="text-xs text-red-300">Net Change</p>
                        <p className={cn("font-bold truncate", dailySummary.net >= 0 ? 'text-green-400' : 'text-red-400')}>
                            {dailySummary.net > 0 ? '+' : ''}{formatCurrency(dailySummary.net)}
                        </p>
                    </div>
                </div>

                <ScrollArea className="h-72 pr-4 -mr-4">
                    {transactionsOnSelectedDate.length > 0 ? (
                        <div className="space-y-3">
                            {transactionsOnSelectedDate.map(t => (
                                <div key={t.id} className="bg-red-950/50 p-3 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getAccountLogo(t.accountId)}
                                        <div>
                                            <p className="font-semibold text-white">{t.description}</p>
                                            <p className="text-xs text-red-300">{format(new Date(t.date), 'p')}</p>
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
