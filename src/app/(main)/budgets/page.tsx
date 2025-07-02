'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, Loader2, Sparkles, Check, Info } from 'lucide-react';
import Link from 'next/link';
import { budgets as initialBudgets, transactions, accounts, Budget, Transaction } from '@/lib/data';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format, isWithinInterval } from 'date-fns';
import { getBudgetAnalysis } from '@/lib/actions';
import { type BudgetAnalysisOutput } from '@/ai/flows/budget-analysis';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);

const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${format(start, 'd MMM')} - ${format(end, 'd MMM yyyy')}`;
}

const getAccountLogo = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return <div className="w-8 h-8 rounded-lg bg-gray-500 flex-shrink-0"></div>;
    const name = account.name.toLowerCase();
    if (name.includes('bca')) return <div className="w-8 h-8 text-xs bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">BCA</div>;
    if (name.includes('gopay')) return <div className="w-8 h-8 text-xs bg-sky-500 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">GP</div>;
    if (name.includes('ovo')) return <div className="w-8 h-8 text-xs bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">OVO</div>;
    return <div className="w-8 h-8 rounded-lg bg-gray-500 flex-shrink-0"></div>;
}

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResult, setAiResult] = useState<(BudgetAnalysisOutput & { error?: string }) | null>(null);
    const { toast } = useToast();

    const spendingPerBudget = useMemo(() => {
        const spending = new Map<string, number>();
        budgets.forEach(budget => {
            const budgetInterval = { start: new Date(budget.startDate), end: new Date(budget.endDate) };
            const budgetSpending = transactions
                .filter(t => 
                    t.category === budget.category &&
                    t.amount < 0 &&
                    isWithinInterval(new Date(t.date), budgetInterval)
                )
                .reduce((acc, t) => acc + Math.abs(t.amount), 0);
            spending.set(budget.id, budgetSpending);
        });
        return spending;
    }, [budgets]);
    
    const budgetTransactions = useMemo(() => {
        if (!selectedBudget) return [];
        const budgetInterval = { start: new Date(selectedBudget.startDate), end: new Date(selectedBudget.endDate) };
        return transactions.filter(t => 
            t.category === selectedBudget.category &&
            t.amount < 0 &&
            isWithinInterval(new Date(t.date), budgetInterval)
        );
    }, [selectedBudget]);

    const handleDeleteClick = (e: React.MouseEvent, budget: Budget) => {
        e.stopPropagation();
        setBudgetToDelete(budget);
        setShowDeleteDialog(true);
    }

    const handleDeleteConfirm = () => {
        if (!budgetToDelete) return;
        setBudgets(budgets.filter(b => b.id !== budgetToDelete.id));
        toast({
            title: "Budget Deleted",
            description: `The "${budgetToDelete.name}" budget has been successfully deleted.`,
        });
        setShowDeleteDialog(false);
        setBudgetToDelete(null);
    }

    const handleGetSuggestions = async () => {
        setIsGenerating(true);
        setAiResult(null);
        try {
            const result = await getBudgetAnalysis(budgets, transactions);
            setAiResult(result);
        } catch (e) {
            setAiResult({
              error: "An unexpected error occurred while fetching analysis.",
              coachTitle: "Error",
              summary: "Could not analyze budgets at this time.",
              suggestions: [],
              proTip: "",
            });
        }
        setIsGenerating(false);
    };
    
    const getProgressColor = (progress: number) => {
        if (progress > 100) return '[&>div]:bg-destructive';
        if (progress > 75) return '[&>div]:bg-yellow-500';
        return '[&>div]:bg-primary';
    }

    return (
        <>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent className="bg-popover text-popover-foreground border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this budget?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete your "<span className="font-semibold text-foreground">{budgetToDelete?.name}</span>" budget. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Yes, delete budget
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <Dialog open={!!selectedBudget} onOpenChange={(open) => !open && setSelectedBudget(null)}>
            <DialogContent className="bg-popover text-popover-foreground border-border">
                <DialogHeader>
                    <DialogTitle className="text-primary">Spending for "{selectedBudget?.name}"</DialogTitle>
                    <DialogDescription>
                        All expenses in '{selectedBudget?.category}' between {selectedBudget && formatDateRange(selectedBudget.startDate, selectedBudget.endDate)}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {budgetTransactions.length > 0 ? budgetTransactions.map(t => (
                        <div key={t.id} className="bg-secondary p-3 rounded-lg flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                {getAccountLogo(t.accountId)}
                                <div>
                                    <p className="font-semibold text-white">{t.description}</p>
                                    <p className="text-xs text-muted-foreground">{format(new Date(t.date), 'dd MMM yyyy')}</p>
                                </div>
                            </div>
                            <p className="font-semibold font-mono text-destructive">{formatCurrency(t.amount)}</p>
                        </div>
                    )) : <p className="text-muted-foreground text-center py-4">No spending in this budget yet.</p>}
                </div>
                <DialogFooter>
                    <Button onClick={() => setSelectedBudget(null)} variant="outline">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        <Dialog open={!!aiResult} onOpenChange={(open) => !open && setAiResult(null)}>
            <DialogContent className="bg-popover text-popover-foreground border-border max-w-md max-h-[85vh] flex flex-col">
                 <DialogHeader>
                    {aiResult?.error ? (
                        <DialogTitle className="text-destructive text-center">An Error Occurred</DialogTitle>
                    ) : (
                        <div className="text-center p-6 bg-secondary/50 rounded-t-lg -m-6 mb-0 border-b border-border">
                            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Your AI Budget Coach</p>
                            <DialogTitle className="text-3xl font-bold font-serif text-white mt-2">
                                {aiResult?.coachTitle}
                            </DialogTitle>
                        </div>
                    )}
                </DialogHeader>
                 <div className="pt-6 flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4">
                    {aiResult?.error ? (
                        <p className="text-center">{aiResult.summary}</p>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <p className="text-muted-foreground leading-relaxed text-center">{aiResult?.summary}</p>
                            </div>
                            
                            {aiResult?.suggestions && aiResult.suggestions.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg text-white font-serif">Your Action Plan:</h3>
                                    <ul className="space-y-3">
                                        {aiResult.suggestions.map((s, i) => (
                                            <li key={`sugg-${i}`} className="flex items-start gap-3 bg-secondary p-4 rounded-xl border border-border">
                                                <div className="w-5 h-5 bg-primary rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-foreground text-sm">{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {aiResult?.proTip && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg text-white font-serif">Pro Tip:</h3>
                                    <div className="flex items-start gap-3 bg-secondary p-4 rounded-xl border border-border">
                                        <div className="w-5 h-5 bg-green-500 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                                            <Info className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-foreground text-sm">{aiResult.proTip}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <DialogFooter className="pt-4">
                    <Button onClick={() => setAiResult(null)} className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12 font-semibold text-lg">Got It!</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-1 text-primary font-serif">
                        Smart Budgets
                    </h1>
                    <p className="text-muted-foreground">Set spending limits for custom periods.</p>
                </div>
                 <Button onClick={handleGetSuggestions} disabled={isGenerating} size="sm" className="bg-primary/80 hover:bg-primary text-white font-semibold">
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isGenerating ? 'Analyzing...' : 'AI Coach'}</span>
                </Button>
            </div>

            <div className="space-y-4">
                {budgets.length > 0 ? budgets.map(budget => {
                    const spent = spendingPerBudget.get(budget.id) || 0;
                    const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                    const remaining = budget.amount - spent;

                    return (
                        <button key={budget.id} onClick={() => setSelectedBudget(budget)} className="w-full text-left bg-card p-5 rounded-2xl border border-border shadow-lg shadow-primary/10 transition-all duration-300 hover:border-primary/50">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-bold text-lg text-white">{budget.name}</p>
                                    <p className="text-sm text-muted-foreground font-medium">{budget.category} &bull; <span className="text-primary/80">{formatDateRange(budget.startDate, budget.endDate)}</span></p>
                                </div>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground" onClick={(e) => handleDeleteClick(e, budget)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <Progress value={progress} className={`h-3 bg-secondary ${getProgressColor(progress)}`} />
                            <div className="flex justify-between text-sm mt-2">
                                <p className="text-muted-foreground font-medium">{formatCurrency(spent)} <span className="text-muted-foreground/70">of {formatCurrency(budget.amount)}</span></p>
                                <p className={`font-semibold ${remaining < 0 ? 'text-destructive' : 'text-green-400'}`}>
                                    {formatCurrency(Math.abs(remaining))} {remaining < 0 ? 'over' : 'left'}
                                </p>
                            </div>
                        </button>
                    )
                }) : (
                     <div className="bg-card p-6 rounded-xl text-center text-muted-foreground border border-border">
                        No budgets created yet. Get started by creating one!
                    </div>
                )}
            </div>
             
             <Link href="/budgets/add" className="w-full bg-card p-5 rounded-2xl flex items-center justify-center text-muted-foreground border-2 border-dashed border-border hover:border-primary/80 hover:text-primary transition-all duration-300 group">
                <Plus className="w-6 h-6 mr-3 transition-colors" />
                <span className="font-semibold transition-colors">Create New Budget</span>
            </Link>
        </div>
        </>
    );
}
