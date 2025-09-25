
import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Landmark, Briefcase, Wallet, Coins, Pin, Calendar, EyeOff, TrendingUp, TrendingDown, Wallet as WalletIcon, Loader2 } from 'lucide-react-native';
import { cn } from "@/lib/utils";
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";
import { format, isSameDay } from 'date-fns';

// Mock Data
const mockAccounts = [
  { id: 'acc_bca_tahapan_1', name: 'BCA Tahapan Gold', institutionSlug: 'bca', type: 'bank', balance: 85200501, accountNumber: '2847', isPinned: true },
  { id: 'acc_bca_kredit_2', name: 'BCA Everyday Card', institutionSlug: 'bca', type: 'loan', balance: 4500000, accountNumber: '5588' },
  { id: 'acc_gopay_main_3', name: 'GoPay', institutionSlug: 'gopay', type: 'e-wallet', balance: 1068000, accountNumber: '7890' },
  { id: 'acc_mandiri_payroll_4', name: 'Mandiri Payroll', institutionSlug: 'mandiri', type: 'bank', balance: 42500000, accountNumber: '5566' },
  { id: 'acc_bibit_main_5', name: 'Bibit Portfolio', institutionSlug: 'bibit', type: 'investment', balance: 125000000, accountNumber: 'IVST' },
  { id: 'acc_pintu_main_6', name: 'Pintu Crypto', institutionSlug: 'pintu', type: 'investment', balance: 75000000, accountNumber: 'CRPT' },
  { id: 'acc_kredivo_loan_7', name: 'Kredivo PayLater', institutionSlug: 'kredivo', type: 'loan', balance: 5500000, accountNumber: 'LOAN' },
];

const mockTransactions = [
  { id: 'txn_1', accountId: 'acc_bca_tahapan_1', amount: 55000000, date: '2024-07-25', description: 'Salary Deposit', category: 'Income' },
  { id: 'txn_2', accountId: 'acc_bca_tahapan_1', amount: -1800000, date: '2024-07-24', description: 'Dinner at SKYE', category: 'Food and Drink' },
  { id: 'txn_3', accountId: 'acc_bca_tahapan_1', amount: -3200000, date: '2024-07-19', description: 'Garuda Flight to Bali', category: 'Travel' },
  { id: 'txn_4', accountId: 'acc_gopay_main_3', amount: -120000, date: '2024-07-26', description: "GoFood McDonald's", category: 'Food and Drink' },
];

// Formatting Helpers
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
const formatDisplayNumber = (account) => {
    if (account.type === 'investment') return '';
    if (account.type === 'loan') return 'Outstanding debt';
    if (account.accountNumber && account.accountNumber.length > 4) {
        const firstTwo = account.accountNumber.substring(0, 2);
        const lastTwo = account.accountNumber.substring(account.accountNumber.length - 2);
        return `${firstTwo}********${lastTwo}`;
    }
    return `...${account.accountNumber}`;
};

// Icon mapping - replace with your actual icon components or image sources
const iconMap = {
    bca: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia_logo.svg',
    gopay: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg',
    mandiri: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo.svg',
    bibit: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bibit.id_logo.svg',
    pintu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pintu_logo.svg/2560px-Pintu_logo.svg.png',
    kredivo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kredivo_logo.svg/2560px-Kredivo_logo.svg.png',
};
const getAccountIcon = (slug) => <Image source={{ uri: iconMap[slug] }} style={{ width: 32, height: 32, resizeMode: 'contain' }} />;


const AccountCard = ({ icon, name, displayNumber, balance, isLoan }) => (
    <View style={styles.accountCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={styles.accountIconContainer}>{icon}</View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.accountName}>{name}</Text>
                {displayNumber ? <Text style={styles.accountNumber}>{displayNumber}</Text> : null}
            </View>
        </View>
        <Text style={[styles.accountBalance, isLoan && { color: '#dc2626' }]}>{balance}</Text>
    </View>
);

const UnifiedDashboard = ({ isActive }) => {
    const [displayData, setDisplayData] = useState(null);
    const [activeRange, setActiveRange] = useState('30D');

    const { totalAssets, totalLiabilities, netWorth, pinnedAccounts, accountGroups } = useMemo(() => {
        const totalAssets = mockAccounts.filter(a => a.type !== 'loan').reduce((sum, acc) => sum + acc.balance, 0);
        const totalLiabilities = mockAccounts.filter(a => a.type === 'loan').reduce((sum, acc) => sum + acc.balance, 0);
        const netWorth = totalAssets - totalLiabilities;
        const pinnedAccounts = mockAccounts.filter(a => a.isPinned);
        const accountGroups = {
            bank: mockAccounts.filter(a => a.type === 'bank' && !a.isPinned),
            ewallet: mockAccounts.filter(a => a.type === 'e-wallet'),
            investment: mockAccounts.filter(a => a.type === 'investment'),
            loan: mockAccounts.filter(a => a.type === 'loan'),
        };
        return { totalAssets, totalLiabilities, netWorth, pinnedAccounts, accountGroups };
    }, []);

    const generateChartData = useCallback((currentBalance, allTransactions, range) => {
        // This logic is simplified for brevity. A full implementation would be more complex.
        const dataPoints = {
            '7D': [200, 450, 280, 800, 990, 430, 560],
            '30D': [200, 450, 280, 800, 990, 430, 560, 300, 700, 400, 900, 600, 800, 500, 750, 650, 850, 950, 1050, 1100, 1000, 900, 800, 700, 600, 500, 400, 300, 200, 500],
            '1Y': new Array(12).fill(0).map(() => Math.random() * 1000),
            'ALL': new Array(24).fill(0).map(() => Math.random() * 1000),
        };
        const labels = {
            '7D': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            '30D': ['W1', 'W2', 'W3', 'W4'],
            '1Y': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'ALL': ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        };

        return {
            labels: labels[range],
            datasets: [{ data: dataPoints[range] }]
        };
    }, []);

    const chartData = useMemo(() => {
        if (!isActive) return { labels: [], datasets: [{ data: [] }] };
        return generateChartData(netWorth, mockTransactions, activeRange);
    }, [netWorth, mockTransactions, activeRange, isActive, generateChartData]);

    useEffect(() => {
        if (chartData.datasets[0].data.length > 1) {
            const lastPoint = chartData.datasets[0].data[chartData.datasets[0].data.length - 1];
            const secondLastPoint = chartData.datasets[0].data[chartData.datasets[0].data.length - 2];
            const change = lastPoint - secondLastPoint;
            const percentageChange = secondLastPoint === 0 ? 0 : (change / secondLastPoint) * 100;
            setDisplayData({
                amount: lastPoint,
                change: change,
                percentageChange: percentageChange,
                date: new Date()
            });
        }
    }, [chartData]);


    return (
        <ScrollView style={styles.container}>
            {/* Total Balance Card */}
            <View style={styles.totalBalanceCard}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4}}>
                    <Text style={styles.totalBalanceTitle}><WalletIcon size={16} color="#64748b" /> Total Net Worth</Text>
                </View>
                {displayData ? (
                    <>
                        <Text style={styles.dateText}>{format(displayData.date, 'PPP')}</Text>
                        <Text style={styles.totalBalanceAmount}>{formatCurrency(netWorth)}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                             {displayData.change >= 0 ? <TrendingUp size={16} color="#10b981"/> : <TrendingDown size={16} color="#dc2626"/>}
                             <Text style={{color: displayData.change >= 0 ? '#10b981' : '#dc2626', fontWeight: '600', marginLeft: 4 }}>
                                 {formatCurrency(displayData.change)} ({displayData.percentageChange.toFixed(2)}%)
                             </Text>
                        </View>
                    </>
                ) : <Loader2 size={24} color="#64748b" />}

                 <View style={{ height: 200, marginTop: 16, marginLeft: -16 }}>
                    <LineChart
                        data={chartData}
                        width={Dimensions.get("window").width - 40}
                        height={200}
                        chartConfig={chartConfig}
                        bezier
                        style={{ borderRadius: 16 }}
                        withDots={false}
                        withInnerLines={false}
                        withOuterLines={false}
                    />
                </View>

                <View style={styles.rangeSelector}>
                    {['7D', '30D', '1Y', 'ALL'].map((range) => (
                        <TouchableOpacity key={range} onPress={() => setActiveRange(range)} style={[styles.rangeButton, activeRange === range && styles.activeRangeButton]}>
                            <Text style={[styles.rangeButtonText, activeRange === range && styles.activeRangeButtonText]}>{range}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Pinned Accounts */}
            {pinnedAccounts.length > 0 && (
                <View style={styles.accountSection}>
                    <Text style={styles.sectionHeader}><Pin size={16} color="#3b82f6" /> Pinned</Text>
                    {pinnedAccounts.map(account => <AccountCard key={account.id} icon={getAccountIcon(account.institutionSlug)} name={account.name} displayNumber={formatDisplayNumber(account)} balance={formatCurrency(account.balance)} isLoan={account.type === 'loan'} />)}
                </View>
            )}

            {/* Other Account Groups */}
            <View style={styles.accountSection}>
                <Text style={styles.sectionHeader}><Landmark size={16} /> Banks</Text>
                {accountGroups.bank.map(account => <AccountCard key={account.id} icon={getAccountIcon(account.institutionSlug)} name={account.name} displayNumber={formatDisplayNumber(account)} balance={formatCurrency(account.balance)} />)}
            </View>
            <View style={styles.accountSection}>
                 <Text style={styles.sectionHeader}><Wallet size={16} /> E-Money</Text>
                {accountGroups.ewallet.map(account => <AccountCard key={account.id} icon={getAccountIcon(account.institutionSlug)} name={account.name} displayNumber={formatDisplayNumber(account)} balance={formatCurrency(account.balance)} />)}
            </View>
             <View style={styles.accountSection}>
                <Text style={styles.sectionHeader}><Briefcase size={16} /> Investments</Text>
                {accountGroups.investment.map(account => <AccountCard key={account.id} icon={getAccountIcon(account.institutionSlug)} name={account.name} displayNumber={formatDisplayNumber(account)} balance={formatCurrency(account.balance)} />)}
            </View>
             <View style={styles.accountSection}>
                <Text style={styles.sectionHeader}><Coins size={16} /> Loans</Text>
                {accountGroups.loan.map(account => <AccountCard key={account.id} icon={getAccountIcon(account.institutionSlug)} name={account.name} displayNumber={formatDisplayNumber(account)} balance={formatCurrency(account.balance)} isLoan={true} />)}
            </View>
        </ScrollView>
    );
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // primary color
  strokeWidth: 3,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  propsForDots: {
    r: "0", // no dots
  }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9', // slate-100
        padding: 16,
    },
    totalBalanceCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    totalBalanceTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b', // slate-500
        textTransform: 'uppercase',
    },
    dateText: {
        fontSize: 14,
        color: '#64748b',
    },
    totalBalanceAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0f172a', // slate-900
    },
    accountSection: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    accountIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    accountName: {
        fontWeight: '600',
        color: '#0f172a',
    },
    accountNumber: {
        fontSize: 12,
        color: '#64748b',
    },
    accountBalance: {
        fontWeight: '600',
    },
    rangeSelector: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
    },
    rangeButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    activeRangeButton: {
      backgroundColor: '#e2e8f0', // slate-200
    },
    rangeButtonText: {
      fontWeight: '600',
      color: '#475569', // slate-600
    },
    activeRangeButtonText: {
      color: '#0f172a', // slate-900
    }
});

export default UnifiedDashboard;
