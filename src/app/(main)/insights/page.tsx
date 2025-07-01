'use client';
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Sector } from 'recharts';
import { transactions } from '@/lib/data';
import { cn } from '@/lib/utils';
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

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[ &]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/-./g, (x) => x[1].toUpperCase());

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
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResult, setAiResult] = useState<{suggestions?: string[], error?: string} | null>(null);

    const { spendingData, totalSpending, chartConfig } = useMemo(() => {
        const spendingByCategory = transactions
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
            .map(([key, data]) => ({
                category: key,
                name: data.name,
                value: data.value,
                fill: `var(--color-${key})`,
            }))
            .sort((a, b) => b.value - a.value);
        
        const chartConfig = spendingData.reduce((acc, item, index) => {
            acc[item.category] = {
                label: item.name,
                color: `hsl(var(--chart-${(index % 5) + 1}))`
            };
            return acc;
        }, { value: { label: "Spending" } } as ChartConfig);

        return { spendingData, totalSpending, chartConfig };
    }, []);

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
                <div className="h-56 w-full">
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
                 <div className="mt-6 space-y-2 text-sm">
                    {spendingData.map((entry, index) => (
                        <div 
                            key={entry.category} 
                            className={cn(
                                "flex items-center justify-between rounded-lg p-2 transition-colors",
                                activeIndex === index ? "bg-red-800/50" : ""
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div 
                                    className="h-2 w-2 rounded-full" 
                                    style={{ backgroundColor: chartConfig[entry.category]?.color }} 
                                />
                                <span className="font-medium text-white">{entry.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="font-semibold text-white">{formatCurrency(entry.value)}</span>
                                <span className="ml-2 text-muted-foreground">
                                    {totalSpending > 0 ? ((entry.value / totalSpending) * 100).toFixed(0) : 0}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
