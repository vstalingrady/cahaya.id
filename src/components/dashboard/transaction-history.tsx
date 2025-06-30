import { type Transaction, accounts } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    if (name.includes('bca')) return <div className="w-8 h-8 text-xs bg-blue-600 text-white rounded-lg flex items-center justify-center font-black">BCA</div>;
    if (name.includes('gopay')) return <div className="w-8 h-8 text-xs bg-sky-500 text-white rounded-lg flex items-center justify-center font-black">GP</div>;
    if (name.includes('ovo')) return <div className="w-8 h-8 text-xs bg-purple-600 text-white rounded-lg flex items-center justify-center font-black">OVO</div>;
    return <div className="w-8 h-8 rounded-lg bg-gray-500"></div>;
}


export default function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="space-y-2">
        {transactions.map(t => (
            <div key={t.id} className="bg-gradient-to-r from-red-950/50 to-red-900/50 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {getAccountLogo(t.accountId)}
                    <div>
                        <p className="font-bold text-white">{t.description}</p>
                        <p className="text-xs text-red-300">{format(new Date(t.date), 'dd MMM yyyy')} &bull; <Badge variant="secondary" className="bg-red-800/50 text-red-300 border-none">{t.category}</Badge></p>
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
  );
}
