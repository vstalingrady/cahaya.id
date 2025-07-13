
import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, AppState } from 'react-native';
import { Landmark, Briefcase, Wallet, Coins, Pin } from 'lucide-react-native';

// --- Mock Data (Copied from original file) ---
type Account = {
  id: string;
  name: string;
  institutionSlug: string;
  type: 'bank' | 'loan' | 'e-wallet' | 'investment';
  balance: number;
  accountNumber: string;
  isPinned?: boolean;
  holdings?: any[]; // Simplified for this example
};

type Transaction = {
    id: string;
    accountId: string;
    amount: number;
    date: string;
    description: string;
    category: string;
};

const mockAccounts: Account[] = [
    { id: 'acc_bca_tahapan_1', name: 'BCA Tahapan Gold', institutionSlug: 'bca', type: 'bank', balance: 85200501, accountNumber: '2847', isPinned: true },
    { id: 'acc_bca_kredit_2', name: 'BCA Everyday Card', institutionSlug: 'bca', type: 'loan', balance: 4500000, accountNumber: '5588' },
    { id: 'acc_gopay_main_3', name: 'GoPay', institutionSlug: 'gopay', type: 'e-wallet', balance: 1068000, accountNumber: '7890' },
    { id: 'acc_mandiri_payroll_4', name: 'Mandiri Payroll', institutionSlug: 'mandiri', type: 'bank', balance: 42500000, accountNumber: '5566' },
    { id: 'acc_bibit_main_5', name: 'Bibit Portfolio', institutionSlug: 'bibit', type: 'investment', balance: 125000000, accountNumber: 'IVST' },
    { id: 'acc_pintu_main_6', name: 'Pintu Crypto', institutionSlug: 'pintu', type: 'investment', balance: 75000000, accountNumber: 'CRPT' },
    { id: 'acc_kredivo_loan_7', name: 'Kredivo PayLater', institutionSlug: 'kredivo', type: 'loan', balance: 5500000, accountNumber: 'LOAN' },
];

const mockTransactions: Transaction[] = [
    { id: 'txn_1', accountId: 'acc_bca_tahapan_1', amount: 55000000, date: '2024-07-25', description: 'Salary Deposit', category: 'Income' },
    { id: 'txn_11', accountId: 'acc_bibit_main_5', amount: -25000000, date: '2024-07-02', description: 'Invest in Mutual Fund', category: 'Investments' },
    { id: 'txn_14', accountId: 'acc_mandiri_payroll_4', amount: 15000000, date: '2024-07-15', description: 'Project Freelance Payment', category: 'Income' },
];


// --- Helper Functions (Adapted for React Native) ---

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const formatDisplayNumber = (account: Account): string => {
    const { accountNumber, type } = account;
    if (type === 'investment') return '';
    if (type === 'loan') return 'Outstanding debt';
    if (accountNumber && accountNumber.length > 4) {
        return `...${accountNumber.substring(accountNumber.length - 4)}`;
    }
    return `...${accountNumber}`;
};

const getAccountIcon = (slug: string) => {
    const icons: { [key: string]: string } = {
        bca: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia_logo.svg',
        gopay: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg',
        bibit: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bibit.id_logo.svg',
        pintu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pintu_logo.svg/2560px-Pintu_logo.svg.png',
        kredivo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kredivo_logo.svg/2560px-Kredivo_logo.svg.png',
        mandiri: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo.svg',
    };
    // Note: For SVG images, you might need react-native-svg-uri or a similar library.
    // For this example, we assume PNGs or that the app is configured to handle SVGs.
    return <Image source={{ uri: icons[slug] }} style={styles.accountIconImage} resizeMode="contain" />;
};


// --- Placeholder Components ---
// A placeholder for the TotalBalance component which was imported in the original file.
const TotalBalance = ({ title, amount }: { title: string, amount: number }) => (
    <View style={styles.totalBalanceContainer}>
        <Text style={styles.totalBalanceTitle}>{title}</Text>
        <Text style={styles.totalBalanceAmount}>{formatCurrency(amount)}</Text>
    </View>
);


// --- Main Components ---

const MockAccountCard = ({ icon, name, displayNumber, balance, isLoan = false }: { icon: React.ReactNode, name: string, displayNumber: string, balance: string, isLoan?: boolean }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>{icon}</View>
            <View style={styles.cardTextContainer}>
                <Text style={styles.cardName} numberOfLines={1}>{name}</Text>
                {displayNumber && <Text style={styles.cardDisplayNumber}>{displayNumber}</Text>}
            </View>
        </View>
        <Text style={[styles.cardBalance, isLoan && styles.loanBalance]}>{balance}</Text>
    </View>
);

const WelcomeDashboardMockup = ({ isActive }: { isActive?: boolean }) => {
    const scrollRef = useRef<ScrollView>(null);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            appState.current = nextAppState;
        });

        let scrollInterval: NodeJS.Timeout;

        const animateScroll = () => {
             if (appState.current === 'active' && isActive) {
                scrollRef.current?.scrollToEnd({ animated: true });
                setTimeout(() => {
                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                }, 4000);
            }
        };

        if (isActive) {
            scrollInterval = setInterval(animateScroll, 8000);
        }

        return () => {
            subscription.remove();
            if(scrollInterval) clearInterval(scrollInterval);
        };
    }, [isActive]);

    const { netWorth, pinnedAccounts, accountGroups } = useMemo(() => {
        const totalAssets = mockAccounts.filter(acc => acc.type !== 'loan').reduce((sum, acc) => sum + acc.balance, 0);
        const totalLiabilities = mockAccounts.filter(acc => acc.type === 'loan').reduce((sum, acc) => sum + acc.balance, 0);
        const netWorth = totalAssets - totalLiabilities;
        const pinnedAccounts = mockAccounts.filter(a => a.isPinned);
        const accountGroups = {
            bank: mockAccounts.filter(a => a.type === 'bank' && !a.isPinned),
            ewallet: mockAccounts.filter(a => a.type === 'e-wallet'),
            investment: mockAccounts.filter(a => a.type === 'investment'),
            loan: mockAccounts.filter(a => a.type === 'loan'),
        };
        return { netWorth, pinnedAccounts, accountGroups };
    }, []);

    const renderSection = (title: string, icon: React.ReactNode, accounts: Account[]) => {
        if (accounts.length === 0) return null;
        return (
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    {icon}
                    <Text style={styles.sectionTitle}>{title}</Text>
                </View>
                <View style={styles.sectionContent}>
                    {accounts.map(account => (
                        <MockAccountCard
                            key={account.id}
                            icon={getAccountIcon(account.institutionSlug)}
                            name={account.name}
                            displayNumber={formatDisplayNumber(account)}
                            balance={formatCurrency(account.balance)}
                            isLoan={account.type === 'loan'}
                        />
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollViewContent}>
                <TotalBalance title="Total Net Worth" amount={netWorth} />
                
                {renderSection('Pinned', <Pin color="#3b82f6" size={16} />, pinnedAccounts)}
                {renderSection('Banks', <Landmark color="#6b7280" size={16} />, accountGroups.bank)}
                {renderSection('E-Money', <Wallet color="#6b7280" size={16} />, accountGroups.ewallet)}
                {renderSection('Investments', <Briefcase color="#6b7280" size={16} />, accountGroups.investment)}
                {renderSection('Loans', <Coins color="#6b7280" size={16} />, accountGroups.loan)}

            </ScrollView>
        </View>
    );
};

// --- Styles (Translated from Tailwind CSS) ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: 400,
        backgroundColor: '#0F0F0F', // A dark background
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
        padding: 8,
    },
    scrollViewContent: {
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    totalBalanceContainer: {
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    totalBalanceTitle: {
        color: '#A0A0A0',
        fontSize: 14,
        marginBottom: 4,
    },
    totalBalanceAmount: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
    },
    sectionContainer: {
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        color: '#E5E5EA',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    sectionContent: {
        marginTop: 8,
    },
    card: {
        backgroundColor: 'rgba(44, 44, 46, 0.8)',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    accountIconImage: {
        width: 32,
        height: 32,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    cardDisplayNumber: {
        color: '#8E8E93',
        fontSize: 12,
    },
    cardBalance: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    loanBalance: {
        color: '#FF453A', // iOS destructive red
    },
});

export default WelcomeDashboardMockup;
