'use client';
import { useState } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Sector } from 'recharts';
import { transactions, accounts } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import NoiseOverlay from '@/components/noise-overlay';

const spendingData = [
  { name: 'Food & Drink', value: 450000, color: '#f87171' },
  { name: 'Transportation', value: 150000, color: '#fb923c' },
  { name: 'Shopping', value: 799000, color: '#facc15' },
  { name: 'Bills', value: 186000, color: '#a3e635' },
  { name: 'Groceries', value: 550000, color: '#4ade80' },
  { name: 'Entertainment', value: 100000, color: '#34d399' },
];

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

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#fff" className="font-bold text-lg">
        {payload.name}
      </text>
       <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#fca5a5" className="text-sm">
        {formatCurrency(payload.value)} ({(percent * 100).toFixed(0)}%)
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};


export default function InsightsPage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeCategory = spendingData[activeIndex]?.name;

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const filteredTransactions = activeCategory
        ? transactions.filter(t => t.category === activeCategory)
        : transactions;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                    Insights
                </h1>
                <p className="text-red-200">Lacak semua pengeluaranmu.</p>
            </div>

            <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
                <NoiseOverlay opacity={0.03} />
                <h3 className="font-bold text-white text-center mb-4">Spending this month</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={spendingData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                dataKey="value"
                                onMouseEnter={onPieEnter}
                            >
                               {spendingData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">History for <span className="text-red-400">{activeCategory}</span></h2>
                </div>
                <div className="space-y-2">
                    {filteredTransactions.map(t => (
                        <div key={t.id} className="bg-gradient-to-r from-red-950/50 to-red-900/50 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {getAccountLogo(t.accountId)}
                                <div>
                                    <p className="font-bold text-white">{t.description}</p>
                                    <p className="text-xs text-red-300">{format(new Date(t.date), 'dd MMM yyyy')}</p>
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
            </div>
        </div>
    );
}
