'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Wallet,
  BarChart3,
  Coins,
  Zap,
  Eye,
  CreditCard,
  PieChart,
  Bell,
  Smartphone,
  Brain,
  Landmark,
  PiggyBank,
  Sparkles,
  ClipboardList,
  Lock,
  Repeat,
  Banknote,
  Plus,
  Briefcase,
  Pin
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import CaharayaIcon from '@/components/icons/caharaya-icon';
import CaharayaIconText from '@/components/icons/caharaya-icon-text';
import AsciiArt from '@/components/ascii-art';
import SeaAnimation from '@/components/sea-animation';
import Image from 'next/image';
import TotalBalance from '@/components/dashboard/total-balance';
import { cn } from '@/lib/utils';

// Mock data for feature showcases - matching demo data
const mockAccounts = [
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

const mockTransactions = [
  // Recent transactions (last 30 days)
  { id: 'txn_1', accountId: 'acc_bca_tahapan_1', amount: 55000000, date: '2025-08-25', description: 'Salary Deposit', category: 'Income' },
  { id: 'txn_2', accountId: 'acc_bca_tahapan_1', amount: -1800000, date: '2025-08-24', description: 'Dinner at SKYE', category: 'Food and Drink' },
  { id: 'txn_3', accountId: 'acc_bca_tahapan_1', amount: -3200000, date: '2025-08-19', description: 'Garuda Flight to Bali', category: 'Travel' },
  { id: 'txn_4', accountId: 'acc_gopay_main_3', amount: -120000, date: '2025-08-26', description: "GoFood McDonald's", category: 'Food and Drink' },
  { id: 'txn_5', accountId: 'acc_gopay_main_3', amount: -35000, date: '2025-08-23', description: 'Gojek Ride', category: 'Transportation' },
  { id: 'txn_6', accountId: 'acc_bca_kredit_2', amount: -2500000, date: '2025-08-27', description: 'Shopping at Zara', category: 'Shopping' },
  { id: 'txn_7', accountId: 'acc_bca_kredit_2', amount: -54999, date: '2025-08-27', description: 'Spotify Premium', category: 'Services' },
  { id: 'txn_8', accountId: 'acc_mandiri_payroll_4', amount: 45000000, date: '2025-07-30', description: 'Bonus Tahunan', category: 'Income' },
  { id: 'txn_9', accountId: 'acc_mandiri_payroll_4', amount: -250000, date: '2025-08-31', description: 'Biaya Admin', category: 'Fees'},
  { id: 'txn_10', accountId: 'acc_kredivo_loan_7', amount: -5500000, date: '2025-08-01', description: 'Pembayaran Tagihan Kredivo', category: 'Payments' },

  // Adding more recent transactions for a dynamic chart
  { id: 'txn_11', accountId: 'acc_bibit_main_5', amount: -25000000, date: '2025-08-02', description: 'Invest in Mutual Fund', category: 'Investments' },
  { id: 'txn_12', accountId: 'acc_bca_tahapan_1', amount: -850000, date: '2025-08-05', description: 'Uniqlo Shopping', category: 'Shopping' },
  { id: 'txn_13', accountId: 'acc_bca_tahapan_1', amount: -1200000, date: '2025-08-10', description: 'PLN & IndiHome Bill', category: 'Bills' },
  { id: 'txn_14', accountId: 'acc_mandiri_payroll_4', amount: 15000000, date: '2025-08-15', description: 'Project Freelance Payment', category: 'Income' },
  { id: 'txn_15', accountId: 'acc_pintu_main_6', amount: -10000000, date: '2025-08-18', description: 'Buy Bitcoin', category: 'Investments' },
  { id: 'txn_16', accountId: 'acc_gopay_main_3', amount: -55000, date: '2025-08-28', description: 'Kopi Kenangan', category: 'Food and Drink' },
  { id: 'txn_17', accountId: 'acc_bca_tahapan_1', amount: -750000, date: '2025-08-29', description: 'Groceries at Ranch Market', category: 'Groceries' },
  { id: 'txn_18', accountId: 'acc_bca_tahapan_1', amount: 5000000, date: '2025-08-08', description: 'Reimbursement from Office', category: 'Income' },

  // Very recent transactions (last week)
  { id: 'txn_19', accountId: 'acc_bca_tahapan_1', amount: -250000, date: '2025-09-02', description: 'Coffee at Starbucks', category: 'Food and Drink' },
  { id: 'txn_20', accountId: 'acc_gopay_main_3', amount: -150000, date: '2025-09-03', description: 'GrabFood Lunch', category: 'Food and Drink' },
  { id: 'txn_21', accountId: 'acc_bca_tahapan_1', amount: -500000, date: '2025-09-04', description: 'Movie Tickets', category: 'Entertainment' },
  { id: 'txn_22', accountId: 'acc_mandiri_payroll_4', amount: 25000000, date: '2025-09-05', description: 'Monthly Salary', category: 'Income' },
  { id: 'txn_23', accountId: 'acc_bca_tahapan_1', amount: -300000, date: '2025-09-06', description: 'Gas Station', category: 'Transportation' },
  { id: 'txn_24', accountId: 'acc_gopay_main_3', amount: -75000, date: '2025-09-07', description: 'Gojek to Office', category: 'Transportation' },
  { id: 'txn_25', accountId: 'acc_bca_tahapan_1', amount: -1200000, date: '2025-09-08', description: 'Grocery Shopping', category: 'Groceries' },
];

const budgetData = [
  { category: 'Food & Drinks', icon: '🍔', spent: 750000, total: 2000000, color: '#3B82F6' },
  { category: 'Shopping', icon: '🛍️', spent: 1200000, total: 1500000, color: '#A855F7' },
  { category: 'Transport', icon: '🚗', spent: 450000, total: 500000, color: '#F97316' },
];

const vaultData = [
  {
    id: 'vault1',
    name: 'Holiday to Japan',
    icon: '✈️',
    currentAmount: 28500000,
    targetAmount: 30000000,
    roundUpEnabled: true,
  },
  {
    id: 'vault2',
    name: 'New iPhone 16',
    icon: '📱',
    currentAmount: 3500000,
    targetAmount: 25000000,
    autoSaveEnabled: true,
    autoSaveFrequency: 'weekly',
    autoSaveAmount: 500000,
  },
];

const financialInstitutions = [
  { name: 'BCA', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia_logo.svg', slug: 'bca' },
  { name: 'GoPay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg', slug: 'gopay' },
  { name: 'Bibit', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bibit.id_logo.svg', slug: 'bibit' },
];

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);

const formatDisplayNumber = (account: any): string => {
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
  return <Image src={icons[slug] || ''} alt={slug} width={32} height={32} className="object-contain" loading="lazy" />;
};

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Account grouping logic - matching demo
  const { pinnedAccounts, accountGroups } = useMemo(() => {
    const pinnedAccounts = mockAccounts.filter(a => a.isPinned);

    // All accounts are included in their respective groups, regardless of pin status.
    const accountGroups = {
      bank: mockAccounts.filter(a => a.type === 'bank' && !a.isPinned),
      ewallet: mockAccounts.filter(a => a.type === 'e-wallet'),
      investment: mockAccounts.filter(a => a.type === 'investment'),
      loan: mockAccounts.filter(a => a.type === 'loan'),
    };

    return { pinnedAccounts, accountGroups };
  }, []);

  return (
    <div className="relative w-full bg-background text-foreground overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background has-hero-glow" />
      <div className="absolute inset-x-0 top-[-80px] -z-10 h-[300px] w-full bg-background has-glowing-dots-glow" />

      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Caharaya",
            "description": "Caharaya is your Financial Command Center - a secure, intuitive platform that aggregates all your financial accounts to provide a single view of your total net worth, transaction history, and smart financial insights.",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "IDR"
            }
          })
        }}
      />

  {/* Hero Section */}
  <div className="relative z-10 w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
    <div className="absolute inset-0 -z-10 flex items-start justify-center pt-0 mt-0" style={{ height: '100%' }}>
      <AsciiArt />
    </div>
    
    <div className="relative z-10 text-center max-w-3xl mx-auto mt-8">
      <h1 className={`text-4xl md:text-6xl font-bold font-serif leading-tight has-blurry-glow-2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        Unify Your <span className="text-primary animate-text-glow">Finances</span>
      </h1>
      <p className={`text-lg md:text-xl text-muted-foreground mt-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        Caharaya is your Financial Command Center - connect all your accounts to see your true net worth and take control of your financial life.
      </p>
      <div className={`flex flex-col sm:flex-row gap-4 justify-center mt-10 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Button size="lg" className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-500 text-primary-foreground shadow-lg shadow-primary/30" asChild>
          <Link href="/signup">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="border-orange-500/60 text-orange-600 hover:bg-orange-500/10 hover:border-orange-500" asChild>
          <Link href="/demo">View Demo</Link>
        </Button>
      </div>
    </div>
    
    {/* Sea Animation Section */}
    <div className="relative z-10 w-full max-w-6xl mx-auto mt-12 px-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-muted-foreground">Connect with all your favorite banks and e-wallets</h2>
      </div>
      <SeaAnimation />
    </div>
  </div>

      

      {/* Expanded Features Showcase */}
      <div className="w-full max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-serif">Powerful Features for Smarter Finance</h2>
          <p className="text-muted-foreground mt-4">
            Everything you need to take control of your financial life in one intuitive platform.
          </p>
        </div>

        {/* Dashboard Feature */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-lg border border-orange-500/20">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-serif">Unified Dashboard</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                See your complete financial picture in one glance. Track balances across all your linked accounts in real-time with our intuitive dashboard.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Real-time balance tracking across all accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Support for banks, e-wallets, investments, and loans</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Pinned accounts for quick access to your most important accounts</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full max-w-md mx-auto">
              <div className="bg-card border border-border rounded-2xl p-4">
                {/* Total Balance Card with Chart */}
                <div className="mb-4">
                  <TotalBalance
                    title="Total Net Worth"
                    amount={212200000}
                    transactions={mockTransactions}
                    showHistoryLink={false}
                    isActive={true}
                  />
                </div>
                
                {/* Accounts List - Matching Demo Style */}
                <div className="space-y-2">
                  {/* Pinned Account Section */}
                  {pinnedAccounts.length > 0 && (
                    <div className="space-y-2">
                      <div className="bg-card p-3 rounded-xl border-none shadow-sm">
                        <div className='flex items-center gap-2 text-foreground font-semibold text-xs'>
                          <Pin className='w-3 h-3 text-primary' />
                          <span>Pinned</span>
                        </div>
                        <div className="pt-1 space-y-1">
                         {pinnedAccounts.slice(0, 1).map(account => (
                            <MockAccountCard
                              key={account.id}
                              icon={getAccountIcon(account.institutionSlug)}
                              name={account.name}
                              displayNumber={formatDisplayNumber(account)}
                              balance={formatCurrency(account.balance)}
                              isLoan={account.type === 'loan'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Accounts Section - Only show one example from each category */}
                  {accountGroups.bank.length > 0 && (
                    <div className="bg-card p-3 rounded-xl border-none shadow-sm">
                      <div className='flex items-center gap-2 text-foreground font-semibold text-xs'>
                        <Landmark className='w-3 h-3' />
                        <span>Banks</span>
                      </div>
                      <div className="pt-1 space-y-1">
                        {accountGroups.bank.slice(0, 1).map(account => (
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
                    <div className="bg-card p-3 rounded-xl border-none shadow-sm">
                      <div className='flex items-center gap-2 text-foreground font-semibold text-xs'>
                        <Wallet className='w-3 h-3' />
                        <span>E-Money</span>
                      </div>
                      <div className="pt-1 space-y-1">
                        {accountGroups.ewallet.slice(0, 1).map(account => (
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Budgeting Feature */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-serif">Smart Budgeting</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Set custom budgets, track your spending against them in real-time, and get coached by our AI to stay on track.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Customizable budgets for different spending categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Real-time spending tracking with visual progress indicators</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>AI-powered budget coaching to help you stay on track</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full max-w-md mx-auto">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h4 className="font-semibold mb-4">My Budgets - July 2024</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm flex items-center">
                        <span className="mr-2">🍔</span> Food & Drinks
                      </span>
                      <span className="text-sm">Rp 750rb / Rp 2jt</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '37.5%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm flex items-center">
                        <span className="mr-2">🛍️</span> Shopping
                      </span>
                      <span className="text-sm">Rp 1.2jt / Rp 1.5jt</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm flex items-center">
                        <span className="mr-2">🚗</span> Transport
                      </span>
                      <span className="text-sm">Rp 450rb / Rp 500rb</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 border-dashed">
                  <Plus className="w-4 h-4 mr-2" /> Create New Budget
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Feature */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-lg border border-orange-500/20">
                  <PiggyBank className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-serif">Automated Savings</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Create savings vaults for your goals. Automate contributions with round-ups and scheduled transfers.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Create vaults for specific financial goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Automate savings with round-ups and scheduled transfers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Shared vaults for group saving goals</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full max-w-md mx-auto">
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">✈️</span>
                      <div>
                        <h4 className="font-semibold">Holiday to Japan</h4>
                        <p className="text-sm text-muted-foreground">Rp 28.5jt / Rp 30jt</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">95%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <div className="flex items-center text-xs text-primary mt-2">
                    <Repeat className="w-3 h-3 mr-1" />
                    <span>Round-up savings active</span>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📱</span>
                      <div>
                        <h4 className="font-semibold">New iPhone 16</h4>
                        <p className="text-sm text-muted-foreground">Rp 3.5jt / Rp 25jt</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">14%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '14%' }}></div>
                  </div>
                  <div className="flex items-center text-xs text-primary mt-2">
                    <Banknote className="w-3 h-3 mr-1" />
                    <span>Auto-saving Rp 500rb / weekly</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-dashed">
                  <Plus className="w-4 h-4 mr-2" /> Create New Vault
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-serif">Caharaya Pro Features</h2>
          <p className="text-muted-foreground mt-4">
            Upgrade to unlock powerful tools that make you a financial champion.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="rounded-full bg-primary/10 p-4 w-12 h-12 flex items-center justify-center mb-6">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Unified Bills & BNPL Hub</h3>
            <p className="text-muted-foreground">
              Never miss a payment with smart reminders for all your bills and installments.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="rounded-full bg-primary/10 p-4 w-12 h-12 flex items-center justify-center mb-6">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">E-Wallet Optimizer</h3>
            <p className="text-muted-foreground">
              Proactive advice to manage your e-wallet sprawl and maximize cashback.
            </p>
          </div>
          <div className="bg-card border border-orange-500/20 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40">
            <div className="rounded-full bg-gradient-to-br from-primary/10 to-orange-500/10 p-4 w-12 h-12 flex items-center justify-center mb-6">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Financial Advisor (Gray)</h3>
            <p className="text-muted-foreground">
              Chat with your personal AI advisor for hyper-personalized financial guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-serif">Bank-Level Security</h2>
          <p className="text-muted-foreground mt-4">
            Your financial data is secure with us.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="rounded-full bg-primary/10 p-4 w-12 h-12 flex items-center justify-center mb-6">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Read-Only Access</h3>
            <p className="text-muted-foreground">
              We never hold or store your funds. Caharaya is a read-only platform for your data.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="rounded-full bg-primary/10 p-4 w-12 h-12 flex items-center justify-center mb-6">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure Connections</h3>
            <p className="text-muted-foreground">
              One-time linking process powered by licensed Open Banking API partners.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="rounded-full bg-primary/10 p-4 w-12 h-12 flex items-center justify-center mb-6">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Capital Efficient</h3>
            <p className="text-muted-foreground">
              No risk to your funds as we never hold any money or assets.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary via-purple-600 to-orange-500 rounded-3xl p-12 text-center shadow-2xl shadow-purple-500/20">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-foreground">
            Ready to See Your True Financial Picture?
          </h2>
          <p className="text-primary-foreground/90 mt-4 max-w-2xl mx-auto">
            Experience the "Aha!" moment when you see your total net worth for the first time.
          </p>
          <Button
            size="lg"
            className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30 animate-slow-pulse"
            asChild
          >
            <Link href="/signup">
              Connect Your Accounts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <CaharayaIcon className="h-8 w-8 text-primary" />
            <CaharayaIconText className="h-6 hidden md:block" />
          </div>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Support
            </Link>
          </div>
        </div>
        <div className="text-center text-muted-foreground text-sm mt-8">
          © {new Date().getFullYear()} caharaya. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-transparent border border-border rounded-xl p-6 w-full md:w-48 h-48 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow animate-fade-in-up">
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-center">{title}</h3>
      <p className="text-sm text-muted-foreground text-center mt-2">
        {description}
      </p>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="rounded-full bg-primary/10 p-4 w-12 h-12 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
}