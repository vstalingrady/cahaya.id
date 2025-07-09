
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PinInput } from '@/components/ui/pin-input';
import { Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';
import { verifySecurityPin } from '@/lib/actions';

export default function PinEntryPage() {
  const { user } = useAuth();
  const [pin, setPin] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const pinString = pin.join('');

    if (!user) {
      setError('User session not found. Please log in again.');
      setIsLoading(false);
      router.push('/login');
      return;
    }

    if (pinString.length !== 6) {
      setError('PIN must be 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await verifySecurityPin(user.uid, pinString);

      if (result.success) {
        document.cookie = "hasEnteredPin=true; path=/";
        toast({
          title: 'PIN Verified',
          description: 'Welcome to your dashboard.',
        });
        router.push('/dashboard');
      } else {
        setError(result.reason || 'Invalid PIN. Please try again.');
        toast({
          title: 'Error',
          description: result.reason || 'Invalid PIN. Please try again.',
          variant: 'destructive',
        });
        setPin(Array(6).fill(''));
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPin = () => {
    toast({
      title: 'Forgot PIN?',
      description: "You would be redirected to a recovery page.",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-background text-foreground p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-serif">Enter Your PIN</h1>
          <p className="text-muted-foreground mt-2">
            For your security, please enter your 6-character PIN to access your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-6">
            <PinInput
                value={pin}
                onChange={setPin}
            />
            {error && <p className="text-destructive text-sm mt-2 text-center">{error}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || pin.join('').length < 6}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enter'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={handleForgotPin} className="text-primary/80 hover:text-primary">
            Forgot PIN?
          </Button>
        </div>
      </div>
    </div>
  );
}
