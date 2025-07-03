
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { financialInstitutions, FinancialInstitution } from '@/lib/data';
import Image from 'next/image';
import { useMemo } from 'react';

const groupInstitutions = (institutions: FinancialInstitution[]) => {
  const grouped: { [key: string]: FinancialInstitution[] } = {
    'Major Banks': [],
    'E-Wallets': [],
  };

  institutions.forEach(inst => {
    if (inst.type === 'bank') {
      grouped['Major Banks'].push(inst);
    } else if (inst.type === 'e-wallet') {
      grouped['E-Wallets'].push(inst);
    }
  });

  return Object.entries(grouped).map(([category, items]) => ({ category, items }));
};

export default function LinkAccountPage() {
  const groupedInstitutions = groupInstitutions(financialInstitutions);

  const callbackUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    return `${window.location.origin}/link-account/callback`;
  }, []);

  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 min-h-screen relative overflow-hidden">
      
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold mb-3 text-primary font-serif">Let's get you connected.</h1>
        <p className="text-muted-foreground leading-relaxed">Select an account to link. You will be redirected to a secure portal to log in.</p>
      </div>

      <div className="space-y-8 relative z-10">
        {groupedInstitutions.map(group => (
          <div key={group.category}>
            <h3 className="text-sm font-bold text-primary/70 mb-4 uppercase tracking-widest">{group.category}</h3>
            <div className="grid grid-cols-1 gap-4">
              {group.items.map(item => {
                const connectUrl = `/mock-ayo-connect?institution_id=${item.slug}&redirect_uri=${encodeURIComponent(callbackUrl)}`;
                return (
                  <Link 
                    key={item.id}
                    href={connectUrl}
                    className="bg-card p-5 rounded-2xl flex items-center justify-between hover:bg-secondary transition-all duration-300 transform hover:scale-105 border border-border shadow-lg shadow-primary/10 group"
                  >
                    <div className="flex items-center relative z-10">
                      <Image src={item.logoUrl} alt={`${item.name} logo`} width={48} height={48} className="rounded-xl mr-4" />
                      <div className="text-left">
                        <div className="font-semibold text-lg text-white">{item.name}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors relative z-10" />
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
