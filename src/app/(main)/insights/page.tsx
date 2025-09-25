
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getDashboardData, getSavingSuggestions, getBillSuggestions } from '@/lib/actions';
import { type Transaction } from '@/lib/data';
import { PieChart, Pie, ResponsiveContainer, Cell, Sector } from 'recharts';
import { cn } from '@/lib/utils';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Check, Info, Repeat, Plus, ReceiptText, Clapperboard, Music, Wifi, Shield, Calendar as CalendarIcon } from 'lucide-react';
import { type PersonalizedSavingSuggestionsOutput } from '@/ai/flows/saving-opportunities';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, addMonths, isBefore, getDate, parseISO, subDays, startOfMonth, startOfYear, isEqual } from 'date-fns';
import { type BillDiscoveryOutput } from '@/ai/flows/bill-discovery';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { type DateRange } from 'react-day-picker';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const slugify = (str: string) => str.toLowerCase().replace(/[\s&]+/g, '-').replace(/[^\w-]+/g, '');

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="hsl(var(--foreground))" className="font-semibold text-lg">
        {payload.name}
      </text>
       <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-sm">
        {formatCurrency(payload.value)} ({(percent * 100).toFixed(0)}%)
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const getSubscriptionIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('netflix')) return Clapperboard;
    if (lowerName.includes('spotify')) return Music;
    if (lowerName.includes('indihome') || lowerName.includes('first media') || lowerName.includes('internet')) return Wifi;
    if (lowerName.includes('bpjs')) return Shield;
    return ReceiptText;
};

const calculateNextBillDate = (firstDateStr: string): Date => {
    const firstDate = parseISO(firstDateStr);
    const today = new Date();
    
    // Set hours to 0 to compare dates only
    today.setHours(0, 0, 0, 0);

    let nextDate = new Date(today.getFullYear(), today.getMonth(), getDate(firstDate));

    if (isBefore(nextDate, today)) {
        nextDate = addMonths(nextDate, 1);
    }
    
    return nextDate;
};


const addSubSchema = z.object({
  name: z.string().min(1, { message: 'Subscription name is required.' }),
  amount: z.coerce.number().min(1000, { message: 'Minimum amount is IDR 1,000.' }),
  nextBillDate: z.date({ required_error: 'A bill date is required.' }),
});

type ManualSubscription = {
    name: string;
    estimatedAmount: number;
    firstDetectedDate: string; // We'll store nextBillDate here as a string
}

const ScoreCircle = ({ score }: { score: number }) => {
    const circumference = 2 * Math.PI * 45; // 2 * pi * radius
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const scoreColor = score > 75 ? 'text-primary' : score > 40 ? 'text-yellow-400' : 'text-destructive';

    return (
        <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                    className="stroke-current text-secondary"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                />
                {/* Progress circle */}
                <circle
                    className={cn("stroke-current transition-all duration-1000 ease-in-out", scoreColor)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 50 50)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{score}</span>
                <span className="text-sm text-muted-foreground">Score</span>
            </div>
        </div>
    );
};


export default function InsightsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    
    // Data state
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Spending Analysis State
    const [activeIndex, setActiveIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResult, setAiResult] = useState<(PersonalizedSavingSuggestionsOutput & { error?: string }) | null>(null);
    const [detailCategory, setDetailCategory] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: subDays(new Date(), 29),
      to: new Date(),
    });

    // Subscription Tracker State
    const [isScanning, setIsScanning] = useState(false);
    const [aiScanResult, setAiScanResult] = useState<BillDiscoveryOutput | null>(null);
    const [manualSubscriptions, setManualSubscriptions] = useState<ManualSubscription[]>([]);
    const [isAddSubDialogOpen, setIsAddSubDialogOpen] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(new Date());

    const addSubForm = useForm<z.infer<typeof addSubSchema>>({
      resolver: zodResolver(addSubSchema),
      defaultValues: { name: '', amount: 1000 },
    });
    
    // --- DATA FETCHING ---
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { transactions } = await getDashboardData(user.uid);
                setTransactions(transactions);
            } catch (error) {
                console.error("Failed to fetch insights data:", error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not load your insights data.'
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user, toast]);

    // --- DERIVED STATE & LOGIC ---
    
    const allTimeDateRange = useMemo(() => {
        if (transactions.length === 0) {
            return { from: new Date(), to: new Date() };
        }
        const dates = transactions.map(t => new Date(t.date));
        return {
            from: new Date(Math.min(...dates.map(d => d.getTime()))),
            to: new Date(Math.max(...dates.map(d => d.getTime())))
        };
    }, [transactions]);

    const datePresets = useMemo(() => [
      { label: "Last 7 Days", range: { from: subDays(new Date(), 6), to: new Date() } },
      { label: "Last 14 Days", range: { from: subDays(new Date(), 13), to: new Date() } },
      { label: "Last 30 Days", range: { from: subDays(new Date(), 29), to: new Date() } },
      { label: "This Month", range: { from: startOfMonth(new Date()), to: new Date() } },
      { label: "Last 3 Months", range: { from: subDays(new Date(), 89), to: new Date() } },
      { label: "This Year", range: { from: startOfYear(new Date()), to: new Date() } },
      { label: "All Time", range: allTimeDateRange },
    ], [allTimeDateRange]);

    const { spendingData, totalSpending, chartConfig } = useMemo(() => {
        const filteredTransactions = transactions.filter(t => {
            if (!dateRange?.from) return true;
            const transactionDate = new Date(t.date);
            const toDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from);
            toDate.setHours(23, 59, 59, 999);
            return transactionDate >= dateRange.from && transactionDate <= toDate;
        });

        const spendingByCategory = filteredTransactions
            .filter((t) => t.amount < 0)
            .reduce((acc, t) => {
                const categoryKey = slugify(t.category);
                if (!acc[categoryKey]) {
                    acc[categoryKey] = { name: t.category, value: 0 };
                }
                acc[categoryKey].value += Math.abs(t.amount);
                return acc;
            }, {} as Record<string, { name: string; value: number }>);
        
        const totalSpending = Object.values(spendingByCategory).reduce((sum, item) => sum + item.value, 0);

        const spendingData = Object.entries(spendingByCategory)
            .map(([key, data]) => ({ category: key, name: data.name, value: data.value }))
            .sort((a, b) => b.value - a.value);
        
        const chartConfig = spendingData.reduce((acc, item, index) => {
            acc[item.category] = { label: item.name, color: `hsl(var(--chart-${(index % 5) + 1}))` };
            return acc;
        }, { value: { label: "Spending" } } as ChartConfig);

        return { spendingData, totalSpending, chartConfig };
    }, [dateRange, transactions]);

    const filteredTransactionsForAI = useMemo(() => {
      if (!dateRange?.from) return transactions;
      const toDate = dateRange.to ?? new Date();
      return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= dateRange.from! && transactionDate <= toDate;
      });
    }, [dateRange, transactions]);

    const categoryTransactions = useMemo(() => {
      if (!detailCategory || !dateRange?.from) return [];
      const toDate = dateRange.to ?? new Date();
      return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return t.amount < 0 && 
                 t.category === detailCategory &&
                 transactionDate >= dateRange.from! &&
                 transactionDate <= toDate;
      });
    }, [detailCategory, dateRange, transactions]);

    const combinedSubscriptions = useMemo(() => {
        const aiSubs = aiScanResult?.potentialBills || [];
        return [...aiSubs, ...manualSubscriptions].map(sub => ({
            ...sub,
            nextBillDate: calculateNextBillDate(sub.firstDetectedDate)
        })).sort((a, b) => a.nextBillDate.getTime() - b.nextBillDate.getTime());
    }, [aiScanResult, manualSubscriptions]);
    
    const billDates = useMemo(() => combinedSubscriptions.map(s => s.nextBillDate), [combinedSubscriptions]);
    
    const totalMonthlyCost = useMemo(() => {
      return combinedSubscriptions.reduce((acc, bill) => acc + bill.estimatedAmount, 0);
    }, [combinedSubscriptions]);


    // --- HANDLER FUNCTIONS ---

    const onAddSubSubmit = (values: z.infer<typeof addSubSchema>) => {
      const newSub: ManualSubscription = {
        name: values.name,
        estimatedAmount: values.amount,
        firstDetectedDate: values.nextBillDate.toISOString(),
      };
      setManualSubscriptions([...manualSubscriptions, newSub]);
      toast({ title: 'Subscription Added!', description: `${values.name} has been added.` });
      setIsAddSubDialogOpen(false);
      addSubForm.reset();
    };

    const onPieEnter = (_: any, index: number) => setActiveIndex(index);
    const handlePieClick = (_: any, index: number) => setActiveIndex(index);

    const handleGetSuggestions = async () => {
        setIsGenerating(true);
        setAiResult(null);
        try {
            const result = await getSavingSuggestions(filteredTransactionsForAI);
            setAiResult(result);
        } catch (e) {
            setAiResult({ error: "An unexpected error occurred.", financialHealthScore: 0, spenderType: "Error", summary: "Could not analyze spending.", suggestions: [], investmentPlan: "", localDeals: [] });
        }
        setIsGenerating(false);
    };

    const handleScanForBills = async () => {
        setIsScanning(true);
        setAiScanResult(null);
        try {
            const result = await getBillSuggestions(transactions);
            if (result.error) {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
                setAiScanResult({ potentialBills: [] });
            } else {
                setAiScanResult(result);
                if (result.potentialBills.length === 0) {
                    toast({ title: 'All Clear!', description: "We couldn't find any new recurring subscriptions." });
                }
            }
        } catch (e) {
            toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
        }
        setIsScanning(false);
    };
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full pt-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      );
    }

    // --- RENDER ---

    return (
        <div>
            <p>Insights Page - Simplified</p>
        </div>
    );
}

