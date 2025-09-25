
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import SetupSecurityForm from '@/components/auth/setup-security-form';
import { checkUserOnboardingStatus } from '@/lib/actions';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function SetupSecurityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This check prevents an already-onboarded user from seeing this page.
    // e.g., if they revisit the URL in their browser history.
    if (user) {
      checkUserOnboardingStatus(user.uid).then(({ onboardingComplete }) => {
        if (onboardingComplete) {
          router.replace('/dashboard');
        } else {
          setLoading(false);
        }
      });
    } else {
        // If there's no user, they shouldn't be here. Send them to login.
        router.replace('/login');
    }
  }, [user, router]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-background text-foreground p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary font-serif">Create Your caharaya PIN</h1>
          <p className="text-muted-foreground text-lg font-light">Create a 6-character PIN with numbers and letters for secure access and transaction approvals.</p>
        </div>
        <SetupSecurityForm />
      </div>
    </div>
  );
}
