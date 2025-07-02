import { type Transaction, accounts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const getAccountLogo = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return <div className="w-8 h-8 rounded-lg bg-gray-500"></div>;
    const name = account.name.toLowerCase();
    if (name.includes('bca')) return <div className="w-8 h-8 text-xs bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">BCA</div>;
    if (name.includes('gopay')) return <div className="w-8 h-8 text-xs bg-sky-500 text-white rounded-lg flex items-center justify-center font-bold">GP</div>;
    if (name.includes('ovo')) return <div className="w-8 h-8 text-xs bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold">OVO</div>;
    return <div className="w-8 h-8 rounded-lg bg-gray-500"></div>;
}


export default function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="space-y-2">
        {transactions.map(t => (
            <div key={t.id} className="bg-card p-4 rounded-xl flex items-center justify-between border border-border">
                <div className="flex items-center gap-3">
                    {getAccountLogo(t.accountId)}
                    <div>
                        <p className="font-semibold text-white">{t.description}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(t.date), 'dd MMM yyyy')} &bull; <Badge variant="secondary" className="bg-secondary text-muted-foreground border-none">{t.category}</Badge></p>
                    </div>
                </div>
                <p className={cn(
                    "font-semibold font-mono",
                    t.amount > 0 ? "text-green-400" : "text-destructive"
                )}>
                    {formatCurrency(t.amount)}
                </p>
            </div>
        ))}
    </div>
  );
}
