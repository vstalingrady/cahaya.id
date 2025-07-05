
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Loader2, Sparkles, Check, Info } from 'lucide-react';
import Link from 'next/link';
import { type Budget, type Transaction, type Account } from '@/lib/data';
import { getBudgets, getDashboardData, deleteBudget, getBudgetAnalysis } from '@/lib/actions';
import { useAuth } from '@/components/auth/auth-provider';
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
import { type BudgetAnalysisOutput } from '@/ai/flows/budget-analysis';
import { cn } from '@/lib/utils';

/**
 * A utility function to format a number into Indonesian Rupiah currency format.
 * @param {number} value - The numeric value to format.
 * @returns {string} The formatted currency string (e.g., "Rp 50.000").
 */
const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);

/**
 * Formats a date range string for display.
 * @param {string} startDate - The start date string ("YYYY-MM-DD").
 * @param {string} endDate - The end date string ("YYYY-MM-DD").
 * @returns {string} The formatted date range (e.g., "1 Jul - 31 Jul 2024").
 */
const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${format(start, 'd MMM')} - ${format(end, 'd MMM yyyy')}`;
}

/**
 * A helper function to determine which account logo to display based on the account name.
 * @param {string} accountId - The ID of the account for the transaction.
 * @param {Account[]} accounts - The full list of the user's accounts.
 * @returns {JSX.Element} A div styled to look like an account logo.
 */
const getAccountLogo = (accountId: string, accounts: Account[]) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return <div className="w-8 h-8 rounded-lg bg-gray-500 flex-shrink-0"></div>;
    const name = account.name.toLowerCase();
    if (name.includes('bca')) return <div className="w-8 h-8 text-xs bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">BCA</div>;
    if (name.includes('gopay')) return <div className="w-8 h-8 text-xs bg-sky-500 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">GP</div>;
    if (name.includes('ovo')) return <div className="w-8 h-8 text-xs bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">OVO</div>;
    return <div className="w-8 h-8 rounded-lg bg-gray-500 flex-shrink-0"></div>;
}

/**
 * The main component for the Budgets page.
 * It fetches and displays user budgets, shows spending progress, and allows for deletions and AI analysis.
 */
export default function BudgetsPage() {
    // --- STATE MANAGEMENT ---
    const { user } = useAuth(); // Get the authenticated user.
    const { toast } = useToast(); // Hook for showing notifications.

    // State for the data fetched from Firestore.
    const [isLoading, setIsLoading] = useState(true);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);

    // State for UI interactions (dialogs, AI results).
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResult, setAiResult] = useState<(BudgetAnalysisOutput & { error?: string }) | null>(null);

    // --- DATA FETCHING ---
    // This effect fetches all necessary data from Firestore when the component mounts or the user changes.
    useEffect(() => {
      const fetchData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
          // Fetch budgets and dashboard data (accounts, transactions) in parallel.
          const [fetchedBudgets, dashboardData] = await Promise.all([
            getBudgets(user.uid),
            getDashboardData(user.uid),
          ]);
          setBudgets(fetchedBudgets);
          setTransactions(dashboardData.transactions);
          setAccounts(dashboardData.accounts);
        } catch (error) {
          console.error("Failed to fetch budgets data:", error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load your budgets data.'
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [user, toast]);

    // --- MEMOIZED COMPUTATIONS ---
    // These hooks recalculate derived data only when their dependencies change, improving performance.

    // Calculate total spending for each budget.
    const spendingPerBudget = useMemo(() => {
        const spending = new Map<string, number>();
        budgets.forEach(budget => {
            const budgetInterval = { start: new Date(budget.startDate), end: new Date(budget.endDate) };
            const budgetSpending = transactions
                .filter(t => 
                    t.category === budget.category &&
                    t.amount < 0 && // Only count expenses
                    isWithinInterval(new Date(t.date), budgetInterval)
                )
                .reduce((acc, t) => acc + Math.abs(t.amount), 0);
            spending.set(budget.id, budgetSpending);
        });
        return spending;
    }, [budgets, transactions]);
    
    // Get the list of transactions associated with the currently selected budget.
    const budgetTransactions = useMemo(() => {
        if (!selectedBudget) return [];
        const budgetInterval = { start: new Date(selectedBudget.startDate), end: new Date(selectedBudget.endDate) };
        return transactions.filter(t => 
            t.category === selectedBudget.category &&
            t.amount < 0 &&
            isWithinInterval(new Date(t.date), budgetInterval)
        );
    }, [selectedBudget, transactions]);

    // --- EVENT HANDLERS ---

    // Set the state to show the delete confirmation dialog.
    const handleDeleteClick = (e: React.MouseEvent, budget: Budget) => {
        e.stopPropagation(); // Prevent the click from opening the details dialog.
        setBudgetToDelete(budget);
        setShowDeleteDialog(true);
    }

    // Handle the actual deletion after confirmation.
    const handleDeleteConfirm = async () => {
        if (!budgetToDelete || !user) return;
        try {
            // Call the server action to delete the budget from Firestore.
            await deleteBudget(user.uid, budgetToDelete.id);
            // Update the local state to remove the budget from the UI instantly.
            setBudgets(budgets.filter(b => b.id !== budgetToDelete.id));
            toast({
                title: "Budget Deleted",
                description: `The "${budgetToDelete.name}" budget has been successfully deleted.`,
            });
        } catch (error) {
            console.error("Failed to delete budget:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the budget.' });
        } finally {
            setShowDeleteDialog(false);
            setBudgetToDelete(null);
        }
    }

    // Handle the request for AI-powered budget analysis.
    const handleGetSuggestions = async () => {
        setIsGenerating(true);
        setAiResult(null);
        try {
            if (!user) throw new Error("User not authenticated");
            // Pass the user ID to the server action, which will fetch the necessary data.
            const result = await getBudgetAnalysis(user.uid);
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
    
    // Helper function to determine the color of the progress bar based on spending.
    const getProgressColor = (progress: number) => {
        if (progress > 100) return '[&>div]:bg-destructive'; // Red if over budget
        if (progress > 75) return '[&>div]:bg-yellow-500'; // Yellow as a warning
        return '[&>div]:bg-primary'; // Default primary color
    }
    
    // Show a loading spinner while fetching initial data.
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full pt-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      );
    }

    // --- RENDER ---
    return (
        <>
        {/* Delete Confirmation Dialog */}
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

        {/* Transaction Details Dialog */}
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
                                {getAccountLogo(t.accountId, accounts)}
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
        
        {/* AI Analysis Result Dialog */}
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

        {/* Main Page Content */}
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-1 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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
