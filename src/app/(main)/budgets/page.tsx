'use client';

import { useState, useMemo } from 'react';
import { Pencil } from 'lucide-react';
import { budgets as initialBudgets, transactions, Budget } from '@/lib/data';
import { Progress } from '@/components/ui/progress';
import NoiseOverlay from '@/components/noise-overlay';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
    const [newAmount, setNewAmount] = useState('');

    const monthlySpending = useMemo(() => {
        const spending = new Map<string, number>();
        transactions
            .filter(t => t.amount < 0)
            .forEach(t => {
                const current = spending.get(t.category) || 0;
                spending.set(t.category, current + Math.abs(t.amount));
            });
        return spending;
    }, []);
    
    const handleEditClick = (budget: Budget) => {
        setSelectedBudget(budget);
        setNewAmount(budget.amount.toString());
        setIsDialogOpen(true);
    };

    const handleSaveBudget = () => {
        if (!selectedBudget || isNaN(Number(newAmount))) return;
        
        const updatedBudgets = budgets.map(b => 
            b.category === selectedBudget.category 
                ? { ...b, amount: Number(newAmount) } 
                : b
        );
        setBudgets(updatedBudgets);
        setIsDialogOpen(false);
        setSelectedBudget(null);
        setNewAmount('');
    };

    const getProgressColor = (progress: number) => {
        if (progress > 100) return '[&>div]:bg-destructive';
        if (progress > 75) return '[&>div]:bg-yellow-500';
        return '[&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent';
    }

    return (
        <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-gradient-to-br from-black via-red-950 to-black text-white border-red-800/50">
                <DialogHeader>
                    <DialogTitle>Edit Budget for "{selectedBudget?.category}"</DialogTitle>
                    <DialogDescription>
                        Set a new monthly spending limit for this category.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="amount" className="text-red-200">
                        New Budget Amount
                    </Label>
                    <Input
                        id="amount"
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        placeholder="e.g. 1500000"
                        className="bg-red-950/50 border-red-800/50 h-14 mt-2 text-base placeholder:text-red-300/70"
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                         <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSaveBudget} className="bg-primary hover:bg-primary/90">Save Budget</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
                    Monthly Budgets
                </h1>
                <p className="text-muted-foreground">Set spending limits and track your progress.</p>
            </div>

            <div className="space-y-4">
                {budgets.map(budget => {
                    const spent = monthlySpending.get(budget.category) || 0;
                    const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                    const remaining = budget.amount - spent;

                    return (
                        <div key={budget.category} className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
                            <NoiseOverlay opacity={0.03} />
                            <div className="flex items-start justify-between mb-3">
                                <p className="font-bold text-lg text-white">{budget.category}</p>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-red-700/50 text-red-300 hover:text-red-200" onClick={() => handleEditClick(budget)}>
                                    <Pencil className="w-4 h-4" />
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
                })}
            </div>
             <p className="text-center text-xs text-muted-foreground pt-4">Categories with no set budget are not shown here.</p>
        </div>
        </>
    );
}
