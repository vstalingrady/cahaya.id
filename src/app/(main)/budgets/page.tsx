'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { budgets as initialBudgets, transactions, Budget } from '@/lib/data';
import { Progress } from '@/components/ui/progress';
import NoiseOverlay from '@/components/noise-overlay';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format, isWithinInterval } from 'date-fns';

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

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
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

    const handleDeleteClick = (budget: Budget) => {
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
    
    const getProgressColor = (progress: number) => {
        if (progress > 100) return '[&>div]:bg-destructive';
        if (progress > 75) return '[&>div]:bg-yellow-500';
        return '[&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent';
    }

    return (
        <>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent className="bg-gradient-to-br from-black via-red-950 to-black text-white border-red-800/50">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this budget?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete your "<span className="font-bold text-red-300">{budgetToDelete?.name}</span>" budget. This action cannot be undone.
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

        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
                    Smart Budgets
                </h1>
                <p className="text-muted-foreground">Set spending limits for custom periods.</p>
            </div>

            <div className="space-y-4">
                {budgets.length > 0 ? budgets.map(budget => {
                    const spent = spendingPerBudget.get(budget.id) || 0;
                    const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                    const remaining = budget.amount - spent;

                    return (
                        <div key={budget.id} className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
                            <NoiseOverlay opacity={0.03} />
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-bold text-lg text-white">{budget.name}</p>
                                    <p className="text-sm text-red-300 font-medium">{budget.category} &bull; <span className="text-red-400">{formatDateRange(budget.startDate, budget.endDate)}</span></p>
                                </div>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-red-700/50 text-red-300 hover:text-red-200" onClick={() => handleDeleteClick(budget)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <Progress value={progress} className={`h-3 bg-red-900/80 ${getProgressColor(progress)}`} />
                            <div className="flex justify-between text-sm mt-2">
                                <p className="text-red-300 font-medium">{formatCurrency(spent)} <span className="text-muted-foreground">of {formatCurrency(budget.amount)}</span></p>
                                <p className={`font-bold ${remaining < 0 ? 'text-destructive' : 'text-green-400'}`}>
                                    {formatCurrency(Math.abs(remaining))} {remaining < 0 ? 'over' : 'left'}
                                </p>
                            </div>
                        </div>
                    )
                }) : (
                     <div className="bg-gradient-to-r from-red-950/50 to-red-900/50 p-6 rounded-xl text-center text-muted-foreground">
                        No budgets created yet. Get started by creating one!
                    </div>
                )}
            </div>
             
             <Link href="/budgets/add" className="w-full bg-gradient-to-r from-red-900/30 to-red-800/30 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-center text-red-300 border-2 border-dashed border-red-600/40 hover:border-red-600/60 transition-all duration-300 relative overflow-hidden group">
                <NoiseOverlay opacity={0.02} />
                <Plus className="w-6 h-6 mr-3 group-hover:text-red-200 transition-colors relative z-10" />
                <span className="font-semibold group-hover:text-red-200 transition-colors relative z-10">Create New Budget</span>
            </Link>
        </div>
        </>
    );
}
