/**
 * @file src/components/dashboard/transaction-history.tsx
 * @fileoverview This component renders a list of transactions. It takes both transactions
 * and a list of all user accounts as props. The accounts list is used to find the
 * correct logo for the account associated with each transaction.
 */

// Import types for data structures. Note: We only import TYPES here, not data.
import { type Transaction, type Account, financialInstitutions } from "@/lib/data";
// Import UI components from ShadCN.
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
// Import utility functions and libraries.
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

/**
 * A utility function to format a number into Indonesian Rupiah currency format.
 * @param {number} amount - The numeric value to format.
 * @returns {string} The formatted currency string (e.g., "Rp 50.000").
 */
const formatCurrency = (amount: number): string => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

/**
 * A helper function to determine which account logo to display based on the account's institution.
 * It searches the provided accounts array for a matching ID and then finds the institution logo.
 * @param {string} accountId - The ID of the account for the transaction.
 * @param {Account[]} accounts - The full list of the user's accounts.
 * @returns {JSX.Element} A div styled to look like an account logo.
 */
const getAccountLogo = (accountId: string, accounts: Account[]): JSX.Element => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return <div className="w-8 h-8 rounded-lg bg-gray-500 flex-shrink-0"></div>;
    
    const institution = financialInstitutions.find(inst => inst.slug === account.institutionSlug);

    if (institution?.logoUrl) {
        return (
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm flex-shrink-0">
                <Image
                    src={institution.logoUrl}
                    alt={`${account.name} logo`}
                    width={28}
                    height={28}
                    className="object-contain h-full w-full"
                    data-ai-hint={`${institution.name} logo`}
                />
            </div>
        );
    }
    
    const initials = account.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">{initials}</div>;
}

/**
 * The main TransactionHistory component.
 * @param {object} props - The component props.
 * @param {Transaction[]} props.transactions - The list of transactions to display.
 * @param {Account[]} props.accounts - The full list of user accounts, needed for logos.
 * @returns {JSX.Element} A list of transaction items.
 */
export default function TransactionHistory({ transactions, accounts }: { transactions: Transaction[], accounts: Account[] }) {
    // Hook to display toast notifications.
    const { toast } = useToast();

    /**
     * Handles adding a transaction to the user's "favorites".
     * In a real app, this would call a server action to update the database.
     * @param {Transaction} transaction - The transaction object to be added.
     */
    const handleAddToFavorites = (transaction: Transaction) => {
        // For this prototype, we'll just show a success notification.
        toast({
            title: "Added to Favorites!",
            description: `"${transaction.description}" is now a favorite.`
        });
    }

    // If there are no accounts or transactions, display a message instead of an empty list.
    if (!accounts || !transactions || transactions.length === 0) {
        return (
            <div className="bg-card p-6 rounded-xl text-center text-muted-foreground border border-border">
                No recent transactions to display.
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {/* Map over the transactions array to render each item. */}
            {transactions.map(t => (
                <div key={t.id} className="bg-card p-4 rounded-xl flex items-center justify-between border border-border group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Get the logo for the transaction's account */}
                        {getAccountLogo(t.accountId, accounts)}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">{t.description}</p>
                            <p className="text-xs text-muted-foreground">
                                {/* Format the date and display the category */}
                                {format(new Date(t.date), 'dd MMM yyyy')} &bull; <Badge variant="secondary" className="bg-secondary text-muted-foreground border-none">{t.category}</Badge>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Display the transaction amount, colored for income and red for expenses. */}
                        <p className={cn(
                            "font-semibold font-mono",
                            t.amount > 0 ? "text-primary" : "text-destructive"
                        )}>
                            {formatCurrency(t.amount)}
                        </p>
                        {/* Show a "favorite" button on hover for outgoing transactions. */}
                        { t.amount < 0 && (
                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleAddToFavorites(t)}>
                                <Star className="w-4 h-4 text-muted-foreground group-hover:text-yellow-400" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
