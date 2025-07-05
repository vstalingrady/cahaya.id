
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { financialInstitutions } from '@/lib/data';

const pln = financialInstitutions.find(i => i.slug === 'pln');
const indihome = financialInstitutions.find(i => i.slug === 'indihome');
const bca = financialInstitutions.find(i => i.slug === 'bca');
const gopay = financialInstitutions.find(i => i.slug === 'gopay');

const billers = [
  { name: 'PLN', logoUrl: pln?.logoUrl || '', amount: 'Rp 245.120' },
  { name: 'IndiHome', logoUrl: indihome?.logoUrl || '', amount: 'Rp 350.000' },
];

const sources = [
  { name: 'BCA', logoUrl: bca?.logoUrl || '', balance: 'Balance: Rp 85.2M' },
  { name: 'GoPay', logoUrl: gopay?.logoUrl || '', balance: 'Balance: Rp 1.0M' },
];

export default function WelcomePaymentMockup() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => (prev + 1) % 4); // 0: initial, 1: bill selected, 2: source selected, 3: success
    }, 2500);

    return () => clearInterval(timer);
  }, []);
  
  const isBillSelected = step >= 1;
  const isSourceSelected = step >= 2;
  const isSuccess = step === 3;

  return (
    <div className="w-full max-w-sm h-80 bg-card/50 rounded-2xl p-6 border border-border flex flex-col justify-between overflow-hidden relative shadow-lg shadow-primary/10">
      {/* Background Glows */}
      <div className={cn("absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl transition-opacity duration-1000", isBillSelected ? 'opacity-100' : 'opacity-0')} />
      <div className={cn("absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full blur-3xl transition-opacity duration-1000", isSourceSelected ? 'opacity-100' : 'opacity-0')} />
      
      {/* Success Overlay */}
      <div className={cn(
          "absolute inset-0 bg-secondary/80 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-500 z-20",
          isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-in zoom-in-50">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-white" />
              </div>
          </div>
          <p className="mt-4 font-semibold text-white text-lg animate-in fade-in-0 slide-in-from-bottom-5">Payment Successful!</p>
          <p className="text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-5 delay-100">PLN Bill Paid from BCA.</p>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">Choose a bill to pay:</h3>
        <div className="space-y-3">
          {billers.map((biller, index) => (
            <div key={biller.name} className={cn(
              "bg-secondary p-3 rounded-xl flex items-center justify-between border-2 transition-all duration-500",
              isBillSelected && index === 0 ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent',
              isBillSelected && index !== 0 ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
            )}>
              <div className="flex items-center gap-3">
                <Image src={biller.logoUrl} alt={biller.name} width={40} height={40} className="rounded-lg bg-white p-1" data-ai-hint={`${biller.name} logo`} />
                <div>
                  <p className="font-semibold text-white">{biller.name}</p>
                  <p className="text-xs text-muted-foreground">Due in 5 days</p>
                </div>
              </div>
              <p className="font-mono text-white font-semibold">{biller.amount}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <h3 className={cn("text-sm font-semibold text-muted-foreground mb-4 transition-opacity duration-500", isBillSelected ? 'opacity-100' : 'opacity-0')}>Choose a payment source:</h3>
        <div className="space-y-3">
          {sources.map((source, index) => (
            <div key={source.name} className={cn(
                "bg-secondary p-3 rounded-xl flex items-center justify-between border-2 transition-all duration-500",
                isBillSelected ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
                isSourceSelected && index === 0 ? 'border-accent shadow-lg shadow-accent/20' : 'border-transparent',
                isSourceSelected && index !== 0 ? 'opacity-30 scale-95' : 'opacity-100 scale-100',
            )} style={{ transitionDelay: `${index * 100}ms`}}>
              <div className="flex items-center gap-3">
                <Image src={source.logoUrl} alt={source.name} width={40} height={40} className="rounded-lg bg-white p-1" data-ai-hint={`${source.name} logo`} />
                <div>
                  <p className="font-semibold text-white">{source.name}</p>
                  <p className="text-xs text-muted-foreground">{source.balance}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
