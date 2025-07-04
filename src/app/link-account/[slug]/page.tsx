
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { financialInstitutions } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { linkAccount } from '@/lib/actions';
import NoiseOverlay from '@/components/noise-overlay';

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
    <Button 
        type="submit" 
        disabled={pending}
        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
    >
      {pending ? <Loader2 className="animate-spin" /> : 'Log In & Connect'}
    </Button>
  );
}

export default function InstitutionAuthPage() {
  const params = useParams();
  const slug = params.slug as string;

  const institution = financialInstitutions.find(inst => inst.slug === slug) || defaultInstitution;
  const isBank = institution.type === 'bank';

  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(linkAccount, initialState);

  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
      <NoiseOverlay />
      <Link href="/link-account" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground z-20">
        <ArrowLeft className="w-6 h-6" />
      </Link>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
            <Image src={institution.logoUrl} alt={`${institution.name} logo`} width={64} height={64} className="rounded-2xl mx-auto mb-4 border-2 border-border" />
            <h1 className="text-2xl font-bold mb-2 text-primary font-serif">
            Connect with {institution.name}
            </h1>
            <p className="text-muted-foreground">Enter your credentials to continue.</p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
            <form action={dispatch}>
                <input type="hidden" name="institutionSlug" value={institution.slug} />
                <div className="space-y-6">
                {isBank ? (
                    <>
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" type="text" placeholder="vstalin" defaultValue={`vstalin`} className="bg-input h-12 text-base" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="••••••••" defaultValue="password123" className="bg-input h-12 text-base" />
                    </div>
                    </>
                ) : (
                    <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="081234567890" defaultValue={`0812-cuan-demo`} className="bg-input h-12 text-base" />
                    </div>
                )}
                </div>
                
                <div className="mt-8">
                    <SubmitButton />
                </div>

                {state?.message && (
                <p className="mt-4 text-sm text-red-500 text-center">{state.message}</p>
                )}
            </form>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground max-w-xs mx-auto">
            <p>This is a mock environment. Cuan will not see your credentials.</p>
        </div>
      </div>
    </div>
  );
}
