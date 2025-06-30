'use client';

import { useState } from 'react';
import { Plus, ChevronRight, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

import NoiseOverlay from '@/components/noise-overlay';
import { beneficiaries } from '@/lib/data';
import { Input } from '@/components/ui/input';

const getBankLogo = (bankName: string) => {
    const lowerName = bankName.toLowerCase();
    const initials = bankName.split(' ').map(n => n[0]).join('');

    if (lowerName.includes('bca')) return <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BCA</div>;
    if (lowerName.includes('mandiri')) return <div className="w-12 h-12 bg-gradient-to-br from-sky-600 to-sky-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">MDR</div>;
    if (lowerName.includes('bni')) return <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BNI</div>;
    return <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">{initials.substring(0, 3)}</div>;
}

export default function SelectRecipientPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBeneficiaries = beneficiaries.filter(
        b =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.accountNumber.includes(searchQuery)
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <header className="flex items-center relative">
                <Link href="/transfer" className="absolute left-0">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-2xl font-black mx-auto bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
                    Select Recipient
                </h1>
            </header>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                <Input
                    type="text"
                    placeholder="Search name, bank, or account no..."
                    className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-base placeholder:text-red-300/70"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white font-serif">Saved Recipients</h2>
                    <Link href="/transfer/add-recipient" className="text-sm font-semibold text-accent hover:text-accent/90 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add New
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-4">
                {filteredBeneficiaries.map((beneficiary) => (
                    <Link key={beneficiary.id} href={`/transfer/${beneficiary.id}`} className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden">
                        <NoiseOverlay opacity={0.03} />
                        <div className="flex items-center gap-3">
                            {getBankLogo(beneficiary.bankName)}
                            <div>
                                <p className="font-bold text-lg text-white">{beneficiary.name}</p>
                                <p className="text-red-300 text-sm">{beneficiary.bankName} &bull; {beneficiary.accountNumber}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                    </Link>
                ))}
                </div>
            </div>
        </div>
    )
}
