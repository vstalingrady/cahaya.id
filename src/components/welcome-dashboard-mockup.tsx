
import { Landmark, Briefcase, Wallet } from 'lucide-react';
import EwalletIcon from '@/components/icons/ewallet-icon';
import { cn } from "@/lib/utils"

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const MockAccountCard = ({ icon, name, last4, balance }: { icon: React.ReactNode, name: string, last4: string, balance: string }) => (
    <div className="bg-card/80 p-3 rounded-xl flex justify-between items-center border border-border/20 shadow-sm">
        <div className="flex items-center flex-1 min-w-0">
            {icon}
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate text-sm">{name}</div>
                <div className="text-muted-foreground text-xs">{last4}</div>
            </div>
        </div>
        <div className="text-right ml-2">
            <div className="font-semibold text-white text-sm">
                {balance}
            </div>
        </div>
    </div>
);

const getAccountIcon = (type: string, name: string) => {
    const baseClasses = "w-10 h-10 rounded-lg mr-3 flex items-center justify-center text-xs font-bold shadow-md flex-shrink-0";
    const lowerName = name.toLowerCase();
    if (lowerName.includes('bca')) return <div className={cn(baseClasses, "bg-blue-600")}>BCA</div>;
    if (lowerName.includes('gopay')) return <div className={cn(baseClasses, "bg-sky-500")}>GP</div>;
    if (lowerName.includes('bibit')) return <div className={cn(baseClasses, "bg-green-500")}>BB</div>;
    return <div className={cn(baseClasses, "bg-secondary")}>AC</div>;
}


export default function WelcomeDashboardMockup({ className }: { className?: string }) {
  return (
    <div className={cn(
        "relative w-full max-w-sm rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-2 backdrop-blur-sm overflow-hidden",
        className
    )}>
        <div className="h-[400px] space-y-3 p-2 rounded-xl bg-background/50 overflow-y-auto custom-scrollbar">
            {/* Total Balance Card */}
            <div className="bg-card p-4 rounded-xl shadow-md border border-border/20">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase">
                    <Wallet className="w-3 h-3" />
                    Total Net Worth
                </div>
                <div className="text-2xl font-bold text-white mt-1">
                    {formatCurrency(174768501)}
                </div>
                 <div className="h-20 mt-2 bg-secondary/30 rounded-md animate-pulse"></div>
            </div>
            
            {/* Accounts Section */}
            <div className="space-y-2">
                <div className="bg-card p-4 rounded-xl border-none shadow-md">
                     <div className='flex items-center gap-3 text-white font-semibold text-sm'>
                        <Landmark className='w-4 h-4' />
                        <span>Banks</span>
                    </div>
                    <div className="pt-2 space-y-2">
                        <MockAccountCard 
                            icon={getAccountIcon('bank', 'BCA Main Account')}
                            name="BCA Main Account"
                            last4="...2847"
                            balance={formatCurrency(85200501)}
                        />
                    </div>
                </div>

                <div className="bg-card p-4 rounded-xl border-none shadow-md">
                     <div className='flex items-center gap-3 text-white font-semibold text-sm'>
                        <EwalletIcon className='w-4 h-4 stroke-current' />
                        <span>E-Wallets</span>
                    </div>
                    <div className="pt-2 space-y-2">
                         <MockAccountCard 
                            icon={getAccountIcon('e-wallet', 'GoPay')}
                            name="GoPay"
                            last4="...0812"
                            balance={formatCurrency(1068000)}
                        />
                    </div>
                </div>

                <div className="bg-card p-4 rounded-xl border-none shadow-md">
                     <div className='flex items-center gap-3 text-white font-semibold text-sm'>
                        <Briefcase className='w-4 h-4' />
                        <span>Investments</span>
                    </div>
                    <div className="pt-2 space-y-2">
                         <MockAccountCard 
                            icon={getAccountIcon('investment', 'Bibit Portfolio')}
                            name="Bibit Portfolio"
                            last4="Invst"
                            balance={formatCurrency(125000000)}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
