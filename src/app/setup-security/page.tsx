'use client';

import SetupSecurityForm from '@/components/auth/setup-security-form';
import NoiseOverlay from '@/components/noise-overlay';

export default function SetupSecurityPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
      <NoiseOverlay />
        
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary font-serif">Secure Your Account</h1>
          <p className="text-muted-foreground text-lg font-light">Set up a PIN to protect your account and approve transactions.</p>
        </div>
        <SetupSecurityForm />
      </div>
    </div>
  );
}
