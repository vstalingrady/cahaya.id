
'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { setSecurityPin } from '@/lib/actions';
import { auth } from '@/lib/firebase';
import { PinInput } from '@/components/ui/pin-input';


export default function SetupSecurityForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [pin, setPin] = useState(Array(6).fill(''));
  const [confirmPin, setConfirmPin] = useState(Array(6).fill(''));
  
  const confirmPinRef = useRef<{ focus: () => void }>(null);


  const handleSetPin = async () => {
    const pinString = pin.join('');
    const confirmPinString = confirmPin.join('');

    if (pinString.length < 6) {
      toast({
        variant: 'destructive',
        title: 'PIN is too short',
        description: 'Your Cahaya PIN must be 6 characters long.',
      });
      return;
    }
    
    if (pinString !== confirmPinString) {
      toast({
        variant: 'destructive',
        title: 'PIN Mismatch',
        description: 'The PINs you entered do not match. Please try again.',
      });
      setConfirmPin(Array(6).fill(''));
      confirmPinRef.current?.focus();
      return;
    }
    
    setLoading(true);

    const currentUser = auth.currentUser;
    if (!currentUser) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'User session not found. Please try logging in again.',
        });
        setLoading(false);
        router.push('/login');
        return;
    }

    try {
        await setSecurityPin(currentUser.uid, pinString);
        toast({
          title: 'Security Set Up!',
          description: `Your Cahaya PIN has been configured.`,
        });
        router.push('/dashboard');
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error setting PIN',
            description: error.message || 'Could not save your PIN.',
        });
    } finally {
        setLoading(false);
    }
  };
  
  const isSubmitDisabled = pin.join('').length < 6 || confirmPin.join('').length < 6 || loading;

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10 relative z-10">
      <form onSubmit={(e) => { e.preventDefault(); handleSetPin(); }} className="space-y-6">
        <div className="space-y-2">
            <Label>Create 6-Character PIN</Label>
            <PinInput 
                value={pin} 
                onChange={setPin}
                onComplete={() => {
                  confirmPinRef.current?.focus();
                }}
            />
        </div>

        <div className="space-y-2">
            <Label>Confirm PIN</Label>
            <PinInput
                ref={confirmPinRef}
                value={confirmPin}
                onChange={setConfirmPin}
            />
        </div>
        
        <Button 
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
        >
            {loading ? <Loader2 className="animate-spin" /> : 'Set & Continue'}
        </Button>
      </form>
    </div>
  );
}
