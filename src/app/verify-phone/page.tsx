'use client';

import VerifyPhoneForm from '@/components/auth/verify-phone-form';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NoiseOverlay from '@/components/noise-overlay';
import { Loader2 } from 'lucide-react';

function VerifyPhonePageContent() {
    const searchParams = useSearchParams();
    const phone = searchParams.get('phone');
    
    return (
        <div className="w-full max-w-md mx-auto bg-background text-white p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
            <NoiseOverlay />
            <div className="relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4 text-primary font-serif">Enter Your Code</h1>
                    <div className="text-muted-foreground text-lg font-light">
                      <p>We sent a 6-digit code to</p>
                      <p className="font-semibold text-white text-xl mt-1">{phone || 'your phone'}</p>
                    </div>
                </div>
                <VerifyPhoneForm />
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
