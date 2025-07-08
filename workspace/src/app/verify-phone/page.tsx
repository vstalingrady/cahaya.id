'use client';

import VerifyPhoneForm from '@/components/auth/verify-phone-form';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function VerifyPhonePageContent() {
    const searchParams = useSearchParams();
    const phone = searchParams.get('phone');
    const next = searchParams.get('next');

    const censorPhoneNumber = (phoneNumber: string | null): string => {
      if (!phoneNumber) {
        return 'your phone';
      }
      // Remove non-digit characters, but keep the `+`
      const rawNumber = phoneNumber.replace(/[^0-9+]/g, '');
  
      if (rawNumber.length < 5) {
          return phoneNumber; // Not enough digits to censor
      }
      
      // Assumes an international format like +62...
      const lastTwoDigits = rawNumber.slice(-2);
      const countryCodeAndStart = rawNumber.slice(0, 3); // e.g. +62
      const maskedPart = '•'.repeat(rawNumber.length - 5); // The length of the part to be masked
  
      return `${countryCodeAndStart}${maskedPart}${lastTwoDigits}`;
    };
    
    return (
        <div className="w-full max-w-md mx-auto bg-background text-foreground p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
            <div className="relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4 text-primary font-serif">Enter Your Code</h1>
                    <div className="text-muted-foreground text-lg font-light">
                      <p>We sent a 6-digit SMS code to</p>
                      <p className="font-semibold text-foreground text-xl mt-1">{censorPhoneNumber(phone)}</p>
                    </div>
                </div>
                <VerifyPhoneForm phone={phone} next={next} />
            </div>
        </div>
    );
}

export default function VerifyPhonePage() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
    }>
        <VerifyPhonePageContent />
    </Suspense>
  );
}
