'use client';

import Link from 'next/link';
import VerifyPhoneForm from '@/components/auth/verify-phone-form';
import NoiseOverlay from '@/components/noise-overlay';

export default function SignupPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
      <NoiseOverlay />
        
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary font-serif">Create your Account</h1>
          <p className="text-muted-foreground text-lg font-light">Let's start by verifying your phone number.</p>
        </div>
        <VerifyPhoneForm />
        <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary/80 hover:text-primary underline">
                  Log In
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
