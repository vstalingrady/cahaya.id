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

  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [confirmPin1, setConfirmPin1] = useState('');
  const [confirmPin2, setConfirmPin2] = useState('');

  const pin2Ref = useRef<HTMLInputElement>(null);
  const confirmPin1Ref = useRef<HTMLInputElement>(null);
  const confirmPin2Ref = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);


  const handlePin1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setPin1(value);
    if (value.length === 4) {
      pin2Ref.current?.focus();
    }
  };

  const handlePin2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setPin2(value);
     if (value.length === 4) {
      confirmPin1Ref.current?.focus();
    }
  };

  const handleConfirmPin1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setConfirmPin1(value);
    if (value.length === 4) {
      confirmPin2Ref.current?.focus();
    }
  };
  
   const handleConfirmPin2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setConfirmPin2(value);
    if (value.length === 4) {
        submitButtonRef.current?.focus();
    }
  };


  const handleSetPin = () => {
    const pin = `${pin1}${pin2}`;
    const confirmPin = `${confirmPin1}${confirmPin2}`;

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

  const fullPin = `${pin1}${pin2}`;
  const fullConfirmPin = `${confirmPin1}${confirmPin2}`;

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10 relative z-10">
      <form onSubmit={(e) => { e.preventDefault(); handleSetPin(); }} className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="pin1">Create 8-Character PIN</Label>
            <div className="flex items-center gap-2">
                <Input 
                    id="pin1"
                    type="password" 
                    className="bg-input border-border h-14 text-center text-xl tracking-[0.2em] placeholder:text-muted-foreground" 
                    placeholder="••••"
                    value={pin1}
                    onChange={handlePin1Change}
                    maxLength={4}
                    autoFocus
                />
                <span className="text-muted-foreground font-bold">-</span>
                 <Input 
                    ref={pin2Ref}
                    id="pin2"
                    type="password" 
                    className="bg-input border-border h-14 text-center text-xl tracking-[0.2em] placeholder:text-muted-foreground" 
                    placeholder="••••"
                    value={pin2}
                    onChange={handlePin2Change}
                    maxLength={4}
                />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="confirmPin1">Confirm PIN</Label>
             <div className="flex items-center gap-2">
                <Input
                    ref={confirmPin1Ref} 
                    id="confirmPin1"
                    type="password" 
                    className="bg-input border-border h-14 text-center text-xl tracking-[0.2em] placeholder:text-muted-foreground" 
                    placeholder="••••"
                    value={confirmPin1}
                    onChange={handleConfirmPin1Change}
                    maxLength={4}
                />
                 <span className="text-muted-foreground font-bold">-</span>
                 <Input 
                    ref={confirmPin2Ref}
                    id="confirmPin2"
                    type="password" 
                    className="bg-input border-border h-14 text-center text-xl tracking-[0.2em] placeholder:text-muted-foreground" 
                    placeholder="••••"
                    value={confirmPin2}
                    onChange={handleConfirmPin2Change}
                    maxLength={4}
                />
            </div>
        </div>
        
        <Button 
            ref={submitButtonRef}
            type="submit"
            disabled={fullPin.length < 8 || fullConfirmPin.length < 8 || loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
        >
            {loading ? <Loader2 className="animate-spin" /> : 'Set & Continue'}
        </Button>
      </form>
    </div>
  );
}
