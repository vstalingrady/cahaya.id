'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SetupSecurityForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const confirmPinInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);


  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    setPin(value);
    if (value.length === 8) {
      confirmPinInputRef.current?.focus();
    }
  };

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    setConfirmPin(value);
    if (value.length === 8) {
        submitButtonRef.current?.focus();
    }
  };


  const handleSetPin = () => {
    if (pin.length < 8) {
      toast({
        variant: 'destructive',
        title: 'PIN is too short',
        description: 'Your Cuan PIN must be 8 characters long.',
      });
      return;
    }
    
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
      <form onSubmit={(e) => { e.preventDefault(); handleSetPin(); }} className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="pin">Create 8-Character PIN</Label>
            <Input 
                id="pin"
                type="password" 
                className="bg-input border-border h-14 text-center text-xl tracking-[0.5em] placeholder:text-muted-foreground" 
                placeholder="••••••••"
                value={pin}
                onChange={handlePinChange}
                maxLength={8}
                autoComplete="new-password"
                autoFocus
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="confirmPin">Confirm PIN</Label>
             <Input
                ref={confirmPinInputRef} 
                id="confirmPin"
                type="password" 
                className="bg-input border-border h-14 text-center text-xl tracking-[0.5em] placeholder:text-muted-foreground" 
                placeholder="••••••••"
                value={confirmPin}
                onChange={handleConfirmPinChange}
                maxLength={8}
                autoComplete="new-password"
            />
        </div>
        
        <Button 
            ref={submitButtonRef}
            type="submit"
            disabled={pin.length < 8 || confirmPin.length < 8 || loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
        >
            {loading ? <Loader2 className="animate-spin" /> : 'Set & Continue'}
        </Button>
      </form>
    </div>
  );
}
