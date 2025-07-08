
'use client';

import { Landmark, Briefcase, Wallet, Coins, Pin } from 'lucide-react';
import { cn } from "@/lib/utils"
import { type Account, type Transaction } from '@/lib/data';
import TotalBalance from '@/components/dashboard/total-balance';
import { useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';

// Hardcoded mock data for the welcome page demonstration.
const mockAccounts: Account[] = [
  {
    id: 'acc_bca_tahapan_1',
    name: 'BCA Tahapan Gold',
    institutionSlug: 'bca',
    type: 'bank',
    balance: 85200501,
    accountNumber: '2847',
    isPinned: true,
  },
  {
    id: 'acc_bca_kredit_2',
    name: 'BCA Everyday Card',
    institutionSlug: 'bca',
    type: 'loan', 
    balance: 4500000,
    accountNumber: '5588',
  },
  {
    id: 'acc_gopay_main_3',
    name: 'GoPay',
    institutionSlug: 'gopay',
    type: 'e-wallet',
    balance: 1068000,
    accountNumber: '7890',
  },
  {
    id: 'acc_mandiri_payroll_4',
    name: 'Mandiri Payroll',
    institutionSlug: 'mandiri',
    type: 'bank',
    balance: 42500000,
    accountNumber: '5566',
  },
  {
    id: 'acc_bibit_main_5',
    name: 'Bibit Portfolio',
    institutionSlug: 'bibit',
    type: 'investment',
    balance: 125000000,
    accountNumber: 'IVST',
  },
  {
    id: 'acc_pintu_main_6',
    name: 'Pintu Crypto',
    institutionSlug: 'pintu',
    type: 'investment',
    balance: 75000000,
    accountNumber: 'CRPT',
    holdings: [
      { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: 0.65, value: 45000000, logoUrl: 'https://placehold.co/48x48.png' },
      { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: 5, value: 25000000, logoUrl: 'https://placehold.co/48x48.png' },
    ]
  },
  {
    id: 'acc_kredivo_loan_7',
    name: 'Kredivo PayLater',
    institutionSlug: 'kredivo',
    type: 'loan',
    balance: 5500000,
    accountNumber: 'LOAN',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 'txn_1',
    accountId: 'acc_bca_tahapan_1',
    amount: 55000000,
    date: '2024-07-25',
    description: 'Salary Deposit',
    category: 'Income',
  },
  {
    id: 'txn_2',
    accountId: 'acc_bca_tahapan_1',
    amount: -1800000,
    date: '2024-07-24',
    description: 'Dinner at SKYE',
    category: 'Food and Drink',
  },
  {
    id: 'txn_3',
    accountId: 'acc_bca_tahapan_1',
    amount: -3200000,
    date: '2024-07-19',
    description: 'Garuda Flight to Bali',
    category: 'Travel',
  },
  {
    id: 'txn_4',
    accountId: 'acc_gopay_main_3',
    amount: -120000,
    date: '2024-07-26',
    description: "GoFood McDonald's",
    category: 'Food and Drink',
  },
  {
    id: 'txn_5',
    accountId: 'acc_gopay_main_3',
    amount: -35000,
    date: '2024-07-23',
    description: 'Gojek Ride',
    category: 'Transportation',
  },
  {
    id: 'txn_6',
    accountId: 'acc_bca_kredit_2',
    amount: -2500000,
    date: '2024-07-27',
    description: 'Shopping at Zara',
    category: 'Shopping',
  },
  {
    id: 'txn_7',
    accountId: 'acc_bca_kredit_2',
    amount: -54999,
    date: '2024-07-27',
    description: 'Spotify Premium',
    category: 'Services',
  },
  { 
    id: 'txn_8', 
    accountId: 'acc_mandiri_payroll_4', 
    amount: 45000000, 
    date: '2024-06-30', 
    description: 'Bonus Tahunan', 
    category: 'Income' 
  },
  { 
    id: 'txn_9', 
    accountId: 'acc_mandiri_payroll_4', 
    amount: -250000, 
    date: '2024-07-31', 
    description: 'Biaya Admin', 
    category: 'Fees'
  },
  { 
    id: 'txn_10', 
    accountId: 'acc_kredivo_loan_7', 
    amount: -5500000, 
    date: '2024-07-01', 
    description: 'Pembayaran Tagihan Kredivo', 
    category: 'Payments' 
  },
];


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
        kredivo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kredivo_logo.svg/2560px-Kredivo_logo.svg.png',
        mandiri: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo.svg',
        bni: 'https://upload.wikimedia.org/wikipedia/commons/thumb/B/BA/Logo_BNI.svg/200px-Logo_BNI.svg.png'
    };
    return <Image src={icons[slug] || ''} alt={slug} width={32} height={32} className="object-contain" />;
}


export default function WelcomeDashboardMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (!isActive || !scrollEl) {
            return;
        }

        let scrollTimeout: NodeJS.Timeout;
        
        const animateScroll = () => {
            scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });

            scrollTimeout = setTimeout(() => {
                scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
                scrollTimeout = setTimeout(animateScroll, 8000); // Slower scroll back up
            }, 8000); // Slower scroll down
        };

        const startTimeout = setTimeout(animateScroll, 2500); // Longer initial delay

        return () => {
            clearTimeout(startTimeout);
            clearTimeout(scrollTimeout);
        };
    }, [isActive]);


    const { totalAssets, totalLiabilities, netWorth, pinnedAccount, accountGroups } = useMemo(() => {
        const totalAssets = mockAccounts
            .filter(acc => acc.type !== 'loan')
            .reduce((sum, acc) => sum + acc.balance, 0);
        
        const totalLiabilities = mockAccounts
            .filter(acc => acc.type === 'loan')
            .reduce((sum, acc) => sum + acc.balance, 0);
            
        const netWorth = totalAssets - totalLiabilities;

        const pinnedAccount = mockAccounts.find(a => a.isPinned);
        const unpinnedAccounts = mockAccounts.filter(a => !a.isPinned);

        const accountGroups = {
            bank: unpinnedAccounts.filter(a => a.type === 'bank'),
            ewallet: unpinnedAccounts.filter(a => a.type === 'e-wallet'),
            investment: unpinnedAccounts.filter(a => a.type === 'investment'),
            loan: unpinnedAccounts.filter(a => a.type === 'loan'),
        };

        return { totalAssets, totalLiabilities, netWorth, pinnedAccount, accountGroups };
    }, []);

  return (
    <div className={cn(
        "relative w-full max-w-sm h-full rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-0 backdrop-blur-sm overflow-hidden",
        className
    )}>
       <div className="h-full w-full p-2 bg-background">
          <div ref={scrollRef} className="h-full space-y-3 rounded-xl bg-background/50 overflow-y-auto custom-scrollbar">
                {/* Total Balance Card */}
                <TotalBalance title="Total Net Worth" amount={netWorth} transactions={mockTransactions} showHistoryLink={false} isActive={isActive} />
                
                 {/* Pinned Account Section */}
                {pinnedAccount && (
                    <div className="space-y-2">
                        <div className="bg-card p-4 rounded-xl border-none shadow-md">
                            <div className='flex items-center gap-3 text-foreground font-semibold text-sm'>
                                <Pin className='w-4 h-4 text-primary' />
                                <span>Pinned</span>
                            </div>
                            <div className="pt-2 space-y-2">
                                <MockAccountCard 
                                    key={pinnedAccount.id}
                                    icon={getAccountIcon(pinnedAccount.institutionSlug)}
                                    name={pinnedAccount.name}
                                    displayNumber={formatDisplayNumber(pinnedAccount)}
                                    balance={formatCurrency(pinnedAccount.balance)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Unpinned Accounts Section */}
                <div className="space-y-2">
                    {accountGroups.bank.length > 0 && (
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
                    )}
                    {accountGroups.ewallet.length > 0 && (
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
                    )}

                    {accountGroups.investment.length > 0 && (
                        <div className="bg-card p-4 rounded-xl border-none shadow-md">
                            <div className='flex items-center gap-3 text-foreground font-semibold text-sm'>
                                <Briefcase className='w-4 h-4' />
                                <span>Investments</span>
                            </div>
                            <div className="pt-2 space-y-2">
                                {accountGroups.investment.map(account => (
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
                    )}
                    
                    {accountGroups.loan.length > 0 && (
                        <div className="bg-card p-4 rounded-xl border-none shadow-md">
                           <div className='flex items-center gap-3 text-foreground font-semibold text-sm'>
                                <Coins className='w-4 h-4' />
                                <span>Loans</span>
                            </div>
                            <div className="pt-2 space-y-2">
                                {accountGroups.loan.map(account => (
                                    <MockAccountCard 
                                        key={account.id}
                                        icon={getAccountIcon(account.institutionSlug)}
                                        name={account.name}
                                        displayNumber={formatDisplayNumber(account)}
                                        balance={formatCurrency(account.balance)}
                                        isLoan={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Duplicate bank section for scrolling effect */}
                     {accountGroups.bank.length > 0 && (
                        <div className="bg-card p-4 rounded-xl border-none shadow-md">
                            <div className='flex items-center gap-3 text-foreground font-semibold text-sm'>
                                <Landmark className='w-4 h-4' />
                                <span>More Banks</span>
                            </div>
                            <div className="pt-2 space-y-2">
                                {accountGroups.bank.slice().reverse().map(account => (
                                    <MockAccountCard 
                                        key={`${account.id}-dup`}
                                        icon={getAccountIcon(account.institutionSlug)}
                                        name={account.name}
                                        displayNumber={formatDisplayNumber(account)}
                                        balance={formatCurrency(account.balance)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}
