'use client';
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Sector } from 'recharts';
import { transactions } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Check, Info, Repeat, Plus, ReceiptText, Clapperboard, Music, Wifi, Shield, Calendar as CalendarIcon } from 'lucide-react';
import { getSavingSuggestions } from '@/lib/actions';
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
import { getBillSuggestions } from '@/lib/actions';
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

export default function InsightsPage() {
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
    const { toast } = useToast();

    const addSubForm = useForm<z.infer<typeof addSubSchema>>({
      resolver: zodResolver(addSubSchema),
      defaultValues: { name: '', amount: 1000 },
    });
    
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
    }, []);

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
    }, [dateRange]);

    const filteredTransactionsForAI = useMemo(() => {
      if (!dateRange?.from) return transactions;
      const toDate = dateRange.to ?? new Date();
      return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= dateRange.from! && transactionDate <= toDate;
      });
    }, [dateRange]);

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
    }, [detailCategory, dateRange]);

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
            setAiResult({ error: "An unexpected error occurred.", spenderType: "Error", summary: "Could not analyze spending.", suggestions: [], investmentPlan: "", localDeals: [] });
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
    
    // --- RENDER ---

    return (
        <>
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold mb-1 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Insights
                </h1>
                <p className="text-muted-foreground">Understand your money, take control.</p>
            </div>

            <Tabs defaultValue="spending" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-card border-border">
                <TabsTrigger value="spending">Spending</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              </TabsList>

              {/* Spending Tab */}
              <TabsContent value="spending" className="mt-6">
                <div className="space-y-4">
                  <div className="bg-card p-4 rounded-2xl border border-border shadow-lg shadow-primary/10 space-y-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-input border-border h-12 text-base",
                            !dateRange && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>

                    <ScrollArea className="w-full whitespace-nowrap">
                      <div className="flex w-max space-x-2 pb-2">
                        {datePresets.map((preset, index) => (
                          <Button
                            key={index}
                            variant={dateRange && preset.range.from && dateRange.from && isEqual(preset.range.from, dateRange.from) && preset.range.to && dateRange.to && isEqual(preset.range.to, dateRange.to) ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 px-3"
                            onClick={() => setDateRange(preset.range)}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>

                  <Button onClick={handleGetSuggestions} disabled={isGenerating} className="w-full bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 py-5 rounded-2xl font-semibold text-lg shadow-lg h-auto">
                      {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                      <span>{isGenerating ? 'Analyzing your spending...' : 'Get AI Financial Plan'}</span>
                  </Button>
                  <div className="bg-card backdrop-blur-xl p-5 rounded-2xl border border-border shadow-lg shadow-primary/10">
                      <h3 className="font-semibold text-white text-center mb-4 font-serif">Spending this month</h3>
                      <div className="h-56 w-full">
                         {spendingData.length > 0 ? (
                          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                              <ResponsiveContainer width="100%" height="100%"><PieChart>
                                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                  <Pie activeIndex={activeIndex} activeShape={renderActiveShape} data={spendingData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" nameKey="category" onMouseEnter={onPieEnter} onClick={handlePieClick}>
                                      {spendingData.map((entry) => (<Cell key={`cell-${entry.category}`} fill={cn(chartConfig[entry.category]?.color)} />))}
                                  </Pie>
                              </PieChart></ResponsiveContainer>
                          </ChartContainer>
                         ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">No spending in this period.</div>
                         )}
                      </div>
                      {spendingData.length > 0 && (
                        <div className="mt-6 space-y-2 text-sm">
                            {spendingData.map((entry, index) => (
                                <div key={entry.category} onClick={() => setDetailCategory(entry.name)} className={cn("flex items-center justify-between rounded-lg p-2 transition-colors cursor-pointer hover:bg-secondary/60", activeIndex === index ? "bg-secondary" : "")}>
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: chartConfig[entry.category]?.color }} />
                                        <span className="font-medium text-white truncate">{entry.name}</span>
                                    </div>
                                    <div className="flex items-baseline justify-end gap-x-2 ml-4 flex-shrink-0">
                                        <span className="font-semibold text-white">{formatCurrency(entry.value)}</span>
                                        <span className="w-[4ch] text-right font-mono text-muted-foreground">
                                            {totalSpending > 0 ? `${((entry.value / totalSpending) * 100).toFixed(0)}%` : '0%'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                      )}
                  </div>
                </div>
              </TabsContent>

              {/* Subscriptions Tab */}
              <TabsContent value="subscriptions" className="mt-6">
                 <div className="space-y-4">
                  <div className="bg-card p-5 rounded-2xl shadow-lg shadow-primary/10 border border-border/50">
                      <div className="flex items-center justify-between gap-4">
                          <div>
                              <h3 className="font-semibold text-white text-lg font-serif">Manage Subscriptions</h3>
                              <p className="text-sm text-muted-foreground">Find, track, and manage all your recurring payments.</p>
                          </div>
                          <div className="flex gap-2">
                              <Button onClick={handleScanForBills} disabled={isScanning} size="sm" className="bg-primary/80 hover:bg-primary text-white font-semibold">
                                  {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                              </Button>
                               <Dialog open={isAddSubDialogOpen} onOpenChange={setIsAddSubDialogOpen}>
                                  <DialogTrigger asChild>
                                      <Button size="sm" variant="outline" className="bg-primary/20 border-primary/50 text-primary hover:bg-primary/30">
                                          <Plus className="w-4 h-4" />
                                      </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-popover border-border">
                                      <DialogHeader>
                                          <DialogTitle>Add Subscription Manually</DialogTitle>
                                          <DialogDescription>Add a recurring payment that wasn't found by the scan.</DialogDescription>
                                      </DialogHeader>
                                      <Form {...addSubForm}>
                                          <form onSubmit={addSubForm.handleSubmit(onAddSubSubmit)} className="space-y-4 py-4">
                                              <FormField control={addSubForm.control} name="name" render={({ field }) => (
                                                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g. Netflix Premium" {...field} /></FormControl><FormMessage /></FormItem>
                                              )}/>
                                              <FormField control={addSubForm.control} name="amount" render={({ field }) => (
                                                  <FormItem><FormLabel>Monthly Amount (IDR)</FormLabel><FormControl><Input type="number" placeholder="e.g. 186000" {...field} /></FormControl><FormMessage /></FormItem>
                                              )}/>
                                              <FormField control={addSubForm.control} name="nextBillDate" render={({ field }) => (
                                                  <FormItem className="flex flex-col"><FormLabel>First Bill Date</FormLabel>
                                                      <Popover><PopoverTrigger asChild>
                                                          <FormControl>
                                                              <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                              </Button>
                                                          </FormControl>
                                                      </PopoverTrigger>
                                                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                                      </Popover>
                                                  <FormMessage />
                                                  </FormItem>
                                              )}/>
                                              <DialogFooter className="pt-4">
                                                  <Button type="submit">Add Subscription</Button>
                                              </DialogFooter>
                                          </form>
                                      </Form>
                                  </DialogContent>
                              </Dialog>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-card p-5 rounded-2xl shadow-lg shadow-primary/10 border border-border/50">
                     <Calendar
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        modifiers={{ billDate: billDates }}
                        modifiersClassNames={{ billDate: 'day-bill-date' }}
                        className="w-full"
                      />
                  </div>

                  {combinedSubscriptions.length > 0 && (
                      <>
                          <div className="bg-card p-5 rounded-2xl shadow-lg shadow-primary/10 border border-border/50 bg-gradient-to-br from-card to-primary/10">
                              <h3 className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Total Monthly Costs</h3>
                              <p className="text-3xl font-bold text-white mt-1">{formatCurrency(totalMonthlyCost)}</p>
                              <p className="text-muted-foreground text-sm mt-1">from {combinedSubscriptions.length} subscriptions</p>
                          </div>
                          
                          <div className="space-y-3">
                              {combinedSubscriptions.map(bill => {
                                  const Icon = getSubscriptionIcon(bill.name);
                                  return (
                                    <div key={bill.name} className="w-full text-left bg-card p-4 rounded-xl flex items-center justify-between border border-border shadow-lg shadow-primary/10">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-secondary p-3 rounded-lg"><Icon className="w-5 h-5 text-primary" /></div>
                                            <div>
                                              <p className="font-semibold text-white">{bill.name}</p>
                                              <p className="text-muted-foreground text-sm font-semibold">{formatCurrency(bill.estimatedAmount)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">Next Bill</p>
                                            <p className="font-semibold text-white">{format(bill.nextBillDate, 'd MMM')}</p>
                                        </div>
                                    </div>
                                  )
                              })}
                          </div>
                      </>
                  )}
                  {combinedSubscriptions.length === 0 && !isScanning && (
                      <div className="bg-card p-10 rounded-xl text-center text-muted-foreground border-2 border-dashed border-border flex flex-col items-center">
                          <Repeat className="w-12 h-12 text-muted-foreground/50 mb-4" />
                          <h3 className="text-lg font-semibold text-white mb-2">No subscriptions found</h3>
                          <p className="max-w-xs mb-4">Use the AI Scan to find recurring payments or add them manually.</p>
                      </div>
                  )}

                 </div>
              </TabsContent>
            </Tabs>
        </div>

        {/* DIALOGS */}
        <Dialog open={!!aiResult} onOpenChange={(open) => !open && setAiResult(null)}>
            <DialogContent className="bg-popover text-popover-foreground border-border max-w-md max-h-[85vh] flex flex-col">
                 <DialogHeader>{aiResult?.error ? (<DialogTitle className="text-destructive text-center">An Error Occurred</DialogTitle>) : (
                     <div className="text-center p-6 bg-secondary/50 rounded-t-lg -m-6 mb-0 border-b border-border">
                         <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                         <p className="text-sm font-semibold uppercase tracking-widest text-primary">Your Spender Personality</p>
                         <DialogTitle className="text-3xl font-bold font-serif text-white mt-2">{aiResult?.spenderType}</DialogTitle>
                     </div>
                 )}</DialogHeader>
                 <div className="pt-6 flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4">
                    {aiResult?.error ? (<p className="text-center">{aiResult.summary}</p>) : (
                        <div className="space-y-6">
                            <div><p className="text-muted-foreground leading-relaxed text-center">{aiResult?.summary}</p></div>
                            {aiResult?.suggestions && aiResult.suggestions.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg text-white font-serif">Your Action Plan:</h3>
                                    <ul className="space-y-3">
                                        {aiResult.suggestions.map((s, i) => (
                                            <li key={`sugg-${i}`} className="flex items-start gap-3 bg-secondary p-4 rounded-xl border border-border">
                                                <div className="w-5 h-5 bg-primary rounded-full flex-shrink-0 mt-1 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                                <span className="text-foreground text-sm">{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {aiResult?.investmentPlan && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg text-white font-serif">Investment Idea:</h3>
                                    <div className="flex items-start gap-3 bg-secondary p-4 rounded-xl border border-border">
                                        <div className="w-5 h-5 bg-green-500 rounded-full flex-shrink-0 mt-1 flex items-center justify-center"><Info className="w-3 h-3 text-white" /></div>
                                        <span className="text-foreground text-sm">{aiResult.investmentPlan}</span>
                                    </div>
                                </div>
                            )}
                            {aiResult?.localDeals && aiResult.localDeals.length > 0 && (
                                 <div className="space-y-3">
                                    <h3 className="font-semibold text-lg text-white font-serif">Local Deals For You:</h3>
                                    <ul className="space-y-3">
                                        {aiResult.localDeals.map((deal, i) => (
                                            <li key={`deal-${i}`} className="flex items-start gap-3 bg-secondary p-4 rounded-xl border border-border">
                                                <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 mt-1 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                                <span className="text-foreground text-sm">{deal}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <DialogFooter className="pt-4"><Button onClick={() => setAiResult(null)} className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12 font-semibold text-lg">Got It!</Button></DialogFooter>
            </DialogContent>
        </Dialog>
        <Dialog open={!!detailCategory} onOpenChange={(open) => { if (!open) setDetailCategory(null); }}>
            <DialogContent className="bg-popover border-border">
                <DialogHeader>
                    <DialogTitle className="text-primary">Spending in {detailCategory}</DialogTitle>
                    <DialogDescription>All transactions for this category.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {categoryTransactions.length > 0 ? categoryTransactions.map(t => (
                        <div key={t.id} className="bg-secondary p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-white">{t.description}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(t.date), 'dd MMM yyyy')}</p>
                            </div>
                            <p className="font-semibold font-mono text-destructive">{formatCurrency(t.amount)}</p>
                        </div>
                    )) : <p className="text-muted-foreground text-center py-4">No transactions found for this category.</p>}
                </div>
                <DialogFooter><Button onClick={() => setDetailCategory(null)} variant="outline">Close</Button></DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
