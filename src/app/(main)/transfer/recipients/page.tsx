
'use client';

import { useState, useEffect } from 'react';
import { Plus, ChevronRight, ArrowLeft, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { type Beneficiary } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/auth-provider';
import { getBeneficiaries } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const getBankLogo = (bankName: string) => {
    const lowerName = bankName.toLowerCase();
    const initials = bankName.split(' ').map(n => n[0]).join('');

    if (lowerName.includes('bca')) return <div className="w-12 h-12 bg-blue-600 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg text-white">BCA</div>;
    if (lowerName.includes('mandiri')) return <div className="w-12 h-12 bg-sky-600 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg text-white">MDR</div>;
    if (lowerName.includes('bni')) return <div className="w-12 h-12 bg-orange-500 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg text-white">BNI</div>;
    return <div className="w-12 h-12 bg-secondary rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">{initials.substring(0, 3)}</div>;
}

export default function SelectRecipientPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getBeneficiaries(user.uid);
                setBeneficiaries(data);
            } catch (error) {
                console.error("Failed to fetch beneficiaries:", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load recipients.' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user, toast]);

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
                    <ArrowLeft className="w-6 h-6 text-foreground" />
                </Link>
                <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Select Recipient
                </h1>
            </header>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search name, bank, or account no..."
                    className="bg-input border-border h-14 pl-12 text-base placeholder:text-muted-foreground"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-foreground font-serif">Saved Recipients</h2>
                    <Link href="/transfer/add-recipient" className="text-sm font-semibold text-primary hover:text-primary/90 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add New
                    </Link>
                </div>
                 {isLoading ? (
                    <div className="flex items-center justify-center pt-10">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                    {filteredBeneficiaries.length > 0 ? filteredBeneficiaries.map((beneficiary) => (
                        <Link key={beneficiary.id} href={`/transfer/${beneficiary.id}`} className="w-full text-left bg-card p-5 rounded-2xl flex items-center justify-between hover:bg-secondary transition-all duration-300 border border-border shadow-lg shadow-primary/10 group">
                            <div className="flex items-center gap-3">
                                {getBankLogo(beneficiary.bankName)}
                                <div>
                                    <p className="font-semibold text-lg text-card-foreground">{beneficiary.name}</p>
                                    <p className="text-muted-foreground text-sm">{beneficiary.bankName} &bull; {beneficiary.accountNumber}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Link>
                    )) : (
                        <div className="text-center py-10 bg-card rounded-2xl border border-border">
                            <p className="text-muted-foreground">No recipients found.</p>
                        </div>
                    )}
                    </div>
                )}
            </div>
        </div>
    )
}
