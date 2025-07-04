'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { financialInstitutions, FinancialInstitution } from '@/lib/data';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import NoiseOverlay from '@/components/noise-overlay';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

  return Object.entries(grouped).filter(([, items]) => items.length > 0);
};

export default function LinkAccountPage() {
  const groupedInstitutions = groupInstitutions(financialInstitutions);

  const [callbackUrl, setCallbackUrl] = useState('');

  useEffect(() => {
    // This ensures window.location.origin is only accessed on the client
    setCallbackUrl(`${window.location.origin}/link-account/callback`);
  }, []); // Runs once on mount

  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 min-h-screen relative overflow-hidden flex flex-col">
       <div className="absolute inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute -top-1/2 left-0 right-0 h-full bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,hsl(var(--primary)/0.15),transparent_70%)]"></div>
      </div>
      <NoiseOverlay opacity={0.02} />
      
      <div className="pt-12 pb-8 relative z-10 text-center">
        <h1 className="text-3xl font-bold mb-3 text-primary font-serif">Let's get you connected.</h1>
        <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">Select an account to link. You will be redirected to a secure portal to log in.</p>
      </div>

      <div className="space-y-8 relative z-10 flex-1">
        {groupedInstitutions.map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sm font-bold text-primary/70 mb-4 uppercase tracking-widest">{category}</h3>
            <div className="grid grid-cols-1 gap-4">
              {items.map(item => {
                const connectUrl = callbackUrl ? `/mock-ayo-connect?institution_id=${item.slug}&redirect_uri=${encodeURIComponent(callbackUrl)}` : '#';
                return (
                  <Link 
                    key={item.id}
                    href={connectUrl}
                    className={cn(
                        "bg-card p-5 rounded-2xl flex items-center justify-between hover:bg-secondary transition-all duration-300 transform hover:scale-105 border border-border shadow-lg shadow-primary/10 group",
                        !callbackUrl && 'pointer-events-none opacity-50'
                    )}
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
       <div className="py-6 text-center relative z-10">
        <Button asChild variant="link" className="text-muted-foreground font-semibold hover:text-primary transition-colors">
          <Link href="/dashboard">
            I'll just look around for now
          </Link>
        </Button>
      </div>
    </div>
  );
}
