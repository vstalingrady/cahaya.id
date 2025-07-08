
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';
import { toast, useToast } from '@/hooks/use-toast';

export default function PinEntryPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPin(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (pin.length !== 6) {
      setError('PIN must be 6 digits.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/flows/verifyPinFlow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'PIN Verified',
          description: 'Welcome to your dashboard.',
        });
        router.push('/dashboard');
      } else {
        setError('Invalid PIN. Please try again.');
        toast({
          title: 'Error',
          description: 'Invalid PIN. Please try again.',
          variant: 'destructive'
        })
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPin = () => {
    // Handle forgot PIN logic, e.g., redirect to a recovery page
    toast({
        title: 'Forgot PIN?',
        description: "You would be redirected to a recovery page.",
      });
    // router.push('/forgot-pin');
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
            For your security, please enter your 6-digit PIN to access your dashboard.
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <div className="mb-4">
            <Input
              type="password"
              value={pin}
              onChange={handlePinChange}
              maxLength={6}
              className="text-center text-2xl tracking-[0.5em] font-bold h-14"
              placeholder="••••••"
              autoFocus
            />
            {error && <p className="text-destructive text-sm mt-2 text-center">{error}</p>}
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Enter'}
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
