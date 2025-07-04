'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
    >
      {pending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Phone Number'}
    </Button>
  );
}

export default function VerifyPhoneForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (code === '000000') {
      toast({
        title: 'Dev Bypass Activated',
        description: 'Skipping phone verification.',
      });
      // Set a flag for the next page to know we're in bypass mode
      sessionStorage.setItem('devBypass', 'true');
      router.push('/complete-profile');
      return;
    }

    try {
      if (!window.confirmationResult) {
        toast({
          variant: 'destructive',
          title: 'Verification Expired',
          description: 'The verification session was not found. Please go back and try sending the code again.',
        });
        setLoading(false);
        return;
      }
      
      const result = await window.confirmationResult.confirm(code);
      
      toast({
        title: 'Success!',
        description: 'Your phone number has been verified.',
      });

      console.log("Phone verification successful, user:", result.user);

      router.push('/complete-profile');

    } catch (err: any) {
      console.error("Error verifying code:", err);
      let description = 'Failed to verify code. Please try again.';
      if (err.code === 'auth/invalid-verification-code') {
        description = 'The code you entered is invalid. Please try again.';
      } else if (err.code === 'auth/code-expired') {
        description = 'The verification code has expired. Please request a new one.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description,
      });

      setLoading(false);
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
      <form onSubmit={handleVerifyCode} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input 
            id="code" 
            name="code" 
            type="tel" 
            className="bg-input h-14 text-center text-2xl tracking-[1em] placeholder:text-muted-foreground" 
            placeholder="------"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            required
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </div>
        
        <SubmitButton pending={loading} />
      </form>
    </div>
  );
}
