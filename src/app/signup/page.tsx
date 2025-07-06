'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SignupForm from '@/components/auth/signup-form';
import NoiseOverlay from '@/components/noise-overlay';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleBypass = () => {
    toast({
        title: 'Dev Bypass Activated',
        description: 'Skipping phone verification step.',
    });
    sessionStorage.setItem('devBypass', 'true');
    router.push('/complete-profile');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
      <NoiseOverlay />
        
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary font-serif">Create your Account</h1>
          <p className="text-muted-foreground text-lg font-light">We'll send you an SMS with a verification code to get started.</p>
        </div>
        <SignupForm />
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
