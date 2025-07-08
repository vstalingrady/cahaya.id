'use client';

import SetupSecurityForm from '@/components/auth/setup-security-form';

export default function SetupSecurityPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-foreground p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
        
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary font-serif">Create Your Cahaya PIN</h1>
          <p className="text-muted-foreground text-lg font-light">Create a 6-character PIN with numbers and letters for secure access and transaction approvals.</p>
        </div>
        <SetupSecurityForm />
      </div>
    </div>
  );
}
