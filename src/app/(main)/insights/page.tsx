'use client';
import { useState } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Sector } from 'recharts';
import { transactions, accounts } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import NoiseOverlay from '@/components/noise-overlay';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { getSavingSuggestions } from '@/lib/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const chartConfig = {
  value: { label: "Spending" },
  foodAndDrink: { label: "Food & Drink", color: "hsl(var(--chart-1))" },
  transportation: { label: "Transportation", color: "hsl(var(--chart-2))" },
  shopping: { label: "Shopping", color: "hsl(var(--chart-3))" },
  bills: { label: "Bills", color: "hsl(var(--chart-4))" },
  groceries: { label: "Groceries", color: "hsl(var(--chart-5))" },
  entertainment: { label: "Entertainment", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

const spendingData = [
  { category: 'foodAndDrink', name: 'Food & Drink', value: 450000, fill: 'var(--color-foodAndDrink)' },
  { category: 'transportation', name: 'Transportation', value: 150000, fill: 'var(--color-transportation)' },
  { category: 'shopping', name: 'Shopping', value: 799000, fill: 'var(--color-shopping)' },
  { category: 'bills', name: 'Bills', value: 186000, fill: 'var(--color-bills)' },
  { category: 'groceries', name: 'Groceries', value: 550000, fill: 'var(--color-groceries)' },
  { category: 'entertainment', name: 'Entertainment', value: 100000, fill: 'var(--color-entertainment)' },
];

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const getAccountLogo = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return <div className="w-8 h-8 rounded-lg bg-gray-500"></div>;
    const name = account.name.toLowerCase();
    if (name.includes('bca')) return <div className="w-8 h-8 text-xs bg-blue-600 text-white rounded-lg flex items-center justify-center font-black">BCA</div>;
    if (name.includes('gopay')) return <div className="w-8 h-8 text-xs bg-sky-500 text-white rounded-lg flex items-center justify-center font-black">GP</div>;
    if (name.includes('ovo')) return <div className="w-8 h-8 text-xs bg-purple-600 text-white rounded-lg flex items-center justify-center font-black">OVO</div>;
    return <div className="w-8 h-8 rounded-lg bg-gray-500"></div>;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="hsl(var(--foreground))" className="font-bold text-lg">
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


export default function InsightsPage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeCategoryName = spendingData[activeIndex]?.name;
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResult, setAiResult] = useState<{suggestions?: string[], error?: string} | null>(null);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const handleGetSuggestions = async () => {
        setIsGenerating(true);
        setAiResult(null);
        try {
            const result = await getSavingSuggestions(transactions);
            setAiResult(result);
        } catch (e) {
            setAiResult({ error: "An unexpected error occurred while fetching suggestions." });
        }
        setIsGenerating(false);
    };

    const filteredTransactions = activeCategoryName
        ? transactions.filter(t => t.category === activeCategoryName)
        : transactions;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
                    Insights
                </h1>
                <p className="text-muted-foreground">Lacak semua pengeluaranmu.</p>
            </div>

            <Button 
                onClick={handleGetSuggestions} 
                disabled={isGenerating} 
                className="w-full bg-gradient-to-r from-accent to-primary/80 text-white py-5 rounded-2xl font-black text-lg shadow-2xl border border-red-400/30 hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group h-auto"
            >
                <NoiseOverlay opacity={0.05} />
                {isGenerating ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <Sparkles className="w-6 h-6" />
                )}
                <span className="relative z-10">{isGenerating ? 'Analyzing your spending...' : 'Get AI Savings Plan'}</span>
            </Button>

             <AlertDialog open={!!aiResult} onOpenChange={(open) => !open && setAiResult(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                           {aiResult?.error ? 'An Error Occurred' : <> <Sparkles className="w-5 h-5 text-accent" /> Your AI-Powered Savings Plan </>}
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                           {aiResult?.error ? (
                               <p className="pt-4 text-left">{aiResult.error}</p>
                           ) : (
                               <ul className="space-y-2 list-disc list-inside pt-4 text-left text-foreground">
                                   {aiResult?.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
                               </ul>
                           )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setAiResult(null)}>Got it</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="bg-gradient-to-r from-red-950/50 to-red-900/50 backdrop-blur-xl p-5 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
                <NoiseOverlay opacity={0.03} />
                <h3 className="font-bold text-white text-center mb-4 font-serif">Spending this month</h3>
                <div className="h-64 w-full">
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={spendingData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    dataKey="value"
                                    nameKey="category"
                                    onMouseEnter={onPieEnter}
                                >
                                     {spendingData.map((entry) => (
                                        <Cell key={`cell-${entry.category}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white font-serif">History for <span className="text-accent">{activeCategoryName}</span></h2>
                </div>
                <div className="space-y-2">
                    {filteredTransactions.map(t => (
                        <div key={t.id} className="bg-gradient-to-r from-red-950/50 to-red-900/50 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {getAccountLogo(t.accountId)}
                                <div>
                                    <p className="font-bold text-white">{t.description}</p>
                                    <p className="text-xs text-muted-foreground">{format(new Date(t.date), 'dd MMM yyyy')}</p>
                                </div>
                            </div>
                            <p className={cn(
                                "font-bold font-mono",
                                t.amount > 0 ? "text-green-400" : "text-red-400"
                            )}>
                                {formatCurrency(t.amount)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
