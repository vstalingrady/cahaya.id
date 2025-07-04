'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SetupSecurityForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    setPin(value);
  };
  
  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    setConfirmPin(value);
  };

  const handleSetPin = () => {
    if (pin !== confirmPin) {
      toast({
        variant: 'destructive',
        title: 'PIN Mismatch',
        description: 'The PINs you entered do not match. Please try again.',
      });
      return;
    }
    
    setLoading(true);
    // In a real app, you would save the hashed PIN to the database here.
    // For this prototype, we'll just simulate success.
    setTimeout(() => {
        toast({
          title: 'Security Set Up!',
          description: `Your Cuan PIN has been configured.`,
        });
        router.push('/link-account');
        setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10 relative z-10">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
            <h2 className="text-xl text-foreground font-semibold">
                Create Your Cuan PIN
            </h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                Create an 8-character PIN with numbers and letters for secure access and transaction approvals.
            </p>
        </div>

        <div className="w-full space-y-4">
            <div className="relative w-full">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
                type="password" 
                className="bg-input border-border h-14 pl-12 text-center text-xl tracking-[0.5em] placeholder:text-muted-foreground" 
                placeholder="••••••••"
                value={pin}
                onChange={handlePinChange}
                maxLength={8}
            />
            </div>
             <div className="relative w-full">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
                type="password" 
                className="bg-input border-border h-14 pl-12 text-center text-xl tracking-[0.5em] placeholder:text-muted-foreground" 
                placeholder="••••••••"
                value={confirmPin}
                onChange={handleConfirmPinChange}
                maxLength={8}
            />
            </div>
        </div>
        
        <Button 
            onClick={handleSetPin}
            disabled={pin.length < 8 || confirmPin.length < 8 || loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
        >
            {loading ? <Loader2 className="animate-spin" /> : 'Set & Continue'}
        </Button>
      </div>
    </div>
  );
}
