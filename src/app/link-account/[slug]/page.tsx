'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { Check, ArrowLeft } from 'lucide-react';
import { financialInstitutions } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { linkAccount } from '@/lib/actions';

const defaultInstitution = {
  id: 'unknown',
  slug: 'unknown',
  name: 'Institution',
  logoUrl: 'https://placehold.co/48x48.png',
  type: 'bank' as 'bank' | 'e-wallet',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full !mt-8" size="lg" disabled={pending}>
      {pending ? 'Connecting...' : 'Connect Securely'}
    </Button>
  );
}

export default function InstitutionAuthPage() {
  const params = useParams();
  const slug = params.slug as string;

  const institution = financialInstitutions.find(inst => inst.slug === slug) || defaultInstitution;
  const isBank = institution.type === 'bank';

  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(linkAccount, initialState);

  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 min-h-screen">
      <Link href="/link-account" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-6 h-6" />
      </Link>
      
      <div className="text-center mb-8 pt-12">
        <Image src={institution.logoUrl} alt={`${institution.name} logo`} width={64} height={64} className="rounded-2xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-primary font-serif">
          Link with {institution.name}
        </h1>
        <p className="text-muted-foreground">Enter your credentials to securely connect.</p>
      </div>

      <form action={dispatch}>
        <input type="hidden" name="institutionSlug" value={institution.slug} />
        <div className="space-y-6">
          {isBank ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input id="userId" name="userId" type="text" placeholder="Your User ID" defaultValue={`cuan-demo`} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" defaultValue="password123" />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="081234567890" defaultValue={`0812-cuan-demo`} />
            </div>
          )}
        </div>
        
        <SubmitButton />

        {state?.message && (
          <p className="mt-4 text-sm text-red-500 text-center">{state.message}</p>
        )}
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>By connecting, you agree to Cuan's Terms of Service and allow us to securely access your account information.</p>
      </div>
    </div>
  );
}
