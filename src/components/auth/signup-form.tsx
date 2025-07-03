'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendVerificationCode } from '@/lib/actions'; // We'll create this action

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
    >
      {pending ? 'Sending Code...' : 'Send Verification Code'}
    </Button>
  );
}

export default function SignupForm() {
  const router = useRouter();
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(sendVerificationCode, initialState);

  // Handle successful code sending
  if (state.message === 'Code sent successfully!') {
    router.push(`/verify-phone?phone=${state.phone}`);
  }

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
      <form action={dispatch} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            name="phone" 
            type="tel" 
            className="bg-input h-14 text-lg" 
            placeholder="e.g., +6281234567890"
          />
          {state?.errors?.phone && <p className="text-sm text-red-500">{state.errors.phone}</p>}
        </div>
        
        <SubmitButton />

        {state?.message && state.message !== 'Code sent successfully!' && (
          <p className="mt-4 text-sm text-red-500 text-center">{state.message}</p>
        )}
      </form>
    </div>
  );
}