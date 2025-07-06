
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/actions';
import { Label } from '../ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
    >
      {pending ? 'Logging In...' : 'Log In'}
    </Button>
  );
}

export default function LoginForm() {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(login, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push('/dashboard');
    }
  }, [state.success, router]);


  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
      <form action={dispatch} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="email" name="email" type="email" className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="Email" />
          </div>
          {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="password" name="password" type="password" className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="Password" />
          </div>
          {state?.errors?.password && <p className="text-sm text-red-500">{state.errors.password}</p>}
        </div>
        
        <SubmitButton />

        {state?.message && !state.success && (
          <p className="mt-4 text-sm text-red-500 text-center">{state.message}</p>
        )}
      </form>
    </div>
  );
}
