
'use client';

import { Landmark, Briefcase, Wallet, Coins } from 'lucide-react';
import { cn } from "@/lib/utils"
import { accounts as mockAccounts, transactions as mockTransactions } from '@/lib/data-seed';
import { type Account } from '@/lib/data';
import TotalBalance from '@/components/dashboard/total-balance';
import { useMemo } from 'react';
import Image from 'next/image';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const formatDisplayNumber = (account: Account): string => {
  const { accountNumber, type } = account;
  if (type === 'investment') {
    return ''; // No subtitle needed, name is descriptive
  }
  if (type === 'loan') {
    return 'Outstanding debt';
  }
  if (accountNumber && accountNumber.length > 4) {
    const firstTwo = accountNumber.substring(0, 2);
    const lastTwo = accountNumber.substring(accountNumber.length - 2);
    return `${firstTwo}********${lastTwo}`;
  }
  return `...${accountNumber}`; // Fallback
};

const MockAccountCard = ({ icon, name, displayNumber, balance, isLoan = false }: { icon: React.ReactNode, name: string, displayNumber: string, balance: string, isLoan?: boolean }) => (
    <div className="bg-card/80 p-3 rounded-xl flex justify-between items-center border border-border/20 shadow-sm">
        <div className="flex items-center flex-1 min-w-0">
            <div className="w-10 h-10 bg-white rounded-lg mr-3 flex items-center justify-center p-1 shadow-md flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1 min-w-0 flex flex-col items-start text-left">
                <div className="font-semibold text-foreground truncate text-sm text-left">{name}</div>
                {displayNumber && <div className="text-muted-foreground text-xs text-left">{displayNumber}</div>}
            </div>
        </div>
        <div className="text-right ml-2">
            <div className={cn(
                "font-semibold text-sm",
                isLoan ? "text-destructive" : "text-foreground"
            )}>
                {balance}
            </div>
        </div>
    </div>
);

const getAccountIcon = (slug: string) => {
    // These URLs are just examples and should match what's in your data files
    const icons: { [key: string]: string } = {
        bca: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia_logo.svg',
        gopay: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg',
        ovo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg',
        bibit: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bibit.id_logo.svg',
        pintu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pintu_logo.svg/2560px-Pintu_logo.svg.png',
        kredivo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kredivo_logo.svg/2560px-Kredivo_logo.svg.png'
    };
    return <Image src={icons[slug] || ''} alt={slug} width={32} height={32} className="object-contain" />;
}


export default function WelcomeDashboardMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const { totalAssets, totalLiabilities, netWorth, accountGroups } = useMemo(() => {
        const totalAssets = mockAccounts
            .filter(acc => acc.type !== 'loan')
            .reduce((sum, acc) => sum + acc.balance, 0);
        
        const totalLiabilities = mockAccounts
            .filter(acc => acc.type === 'loan')
            .reduce((sum, acc) => sum + acc.balance, 0);
            
        const netWorth = totalAssets - totalLiabilities;

        const accountGroups = {
            bank: mockAccounts.filter(a => a.type === 'bank'),
            ewallet: mockAccounts.filter(a => a.type === 'e-wallet'),
            investment: mockAccounts.filter(a => a.type === 'investment'),
            loan: mockAccounts.filter(a => a.type === 'loan'),
        };

        return { totalAssets, totalLiabilities, netWorth, accountGroups };
    }, []);

  return (
    <div className={cn(
        "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-0 backdrop-blur-sm overflow-hidden",
        className
    )}>
       <div className="h-full w-full p-2 bg-background">
          <div className="h-full space-y-3 rounded-xl bg-background/50 overflow-y-auto custom-scrollbar">
                {/* Total Balance Card */}
                <TotalBalance title="Total Net Worth" amount={netWorth} transactions={mockTransactions} showHistoryLink={false} isActive={isActive} />
                
                {/* Accounts Section */}
                <div className="space-y-2">
                    <div className="bg-card p-4 rounded-xl border-none shadow-md">
                        <div className='flex items-center gap-3 text-foreground font-semibold text-sm'>
                            <Landmark className='w-4 h-4' />
                            <span>Banks</span>
                        </div>
                        <div className="pt-2 space-y-2">
                            {accountGroups.bank.map(account => (
                                <MockAccountCard 
                                    key={account.id}
                                    icon={getAccountIcon(account.institutionSlug)}
                                    name={account.name}
                                    displayNumber={formatDisplayNumber(account)}
                                    balance={formatCurrency(account.balance)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="bg-card p-4 rounded-xl border-none shadow-md">
                        <div className='flex items-center gap-3 text-foreground font-semibold text-sm'>
                            <Wallet className='w-4 h-4' />
                            <span>E-Money</span>
                        </div>
                        <div className="pt-2 space-y-2">
                            {accountGroups.ewallet.map(account => (
                                <MockAccountCard 
                                    key={account.id}
                                    icon={getAccountIcon(account.institutionSlug)}
                                    name={account.name}
                                    displayNumber={formatDisplayNumber(account)}
                                    balance={formatCurrency(account.balance)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
