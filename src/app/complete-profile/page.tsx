'use client';

import CompleteProfileForm from '@/components/auth/complete-profile-form';
import NoiseOverlay from '@/components/noise-overlay';
import { Suspense } from 'react';

export default function CompleteProfilePage() {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
      <NoiseOverlay />
        
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary font-serif">One Last Step</h1>
          <p className="text-muted-foreground text-lg font-light">Complete your profile to secure your account.</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <CompleteProfileForm />
        </Suspense>
      </div>
    </div>
  );
}
