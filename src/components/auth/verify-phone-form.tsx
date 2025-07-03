'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUserWithPhoneNumber } from '@/lib/actions'; // Our new server action

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
    >
      {pending ? 'Verifying...' : 'Verify Account'}
    </Button>
  );
}

export default function VerifyPhoneForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get('phone');
  const email = searchParams.get('email');
  const password = searchParams.get('password');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!window.confirmationResult) {
        setError('Verification session expired or not found. Please try sending the code again.');
        setLoading(false);
        return;
      }

      const userCredential = await window.confirmationResult.confirm(code);
      const user = userCredential.user;

      // Now, call the server action to create the user in Firestore
      if (user.uid && email && phone && password) {
        await createUserWithPhoneNumber(user.uid, email, phone, password);
        router.push('/dashboard');
      } else {
        setError('User data incomplete after verification.');
      }

    } catch (err: any) {
      console.error("Error verifying code:", err);
      setError(err.message || 'Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
      <form onSubmit={handleVerifyCode} className="space-y-6">
        <input type="hidden" name="phone" value={phone || ''} />
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input 
            id="code" 
            name="code" 
            type="text" 
            className="bg-input h-14 text-center text-2xl tracking-[1em] placeholder:text-muted-foreground" 
            placeholder="------"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
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