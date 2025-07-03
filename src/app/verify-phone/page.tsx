import VerifyPhoneForm from '@/components/auth/verify-phone-form';
import { Suspense } from 'react';

export default function VerifyPhonePage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-2">Verify Your Account</h1>
        <p className="text-muted-foreground text-center mb-8">
          Enter the 6-digit code sent to your WhatsApp.
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyPhoneForm />
        </Suspense>
      </div>
    </main>
  );
}