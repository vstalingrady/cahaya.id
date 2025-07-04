'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

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
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!window.confirmationResult) {
        throw new Error('Verification session expired or not found. Please try sending the code again.');
      }
      
      // Confirm the code
      await window.confirmationResult.confirm(code);
      
      // On success, redirect to the next step
      router.push('/complete-profile');

    } catch (err: any) {
      console.error("Error verifying code:", err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('The code you entered is invalid. Please try again.');
      } else {
        setError(err.message || 'Failed to verify code. Please try again.');
      }
    } finally {
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

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
