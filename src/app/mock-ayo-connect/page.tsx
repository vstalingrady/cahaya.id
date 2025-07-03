// src/app/mock-ayo-connect/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { mockInstitutions, db } from '@/lib/mock-api-db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent, Suspense } from 'react';

function MockConnectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const institutionId = searchParams.get('institution_id');
  const redirectUri = searchParams.get('redirect_uri');

  const institution = mockInstitutions.find(inst => inst.institution_id === institutionId);

  if (!institution) {
    return <div className="text-red-500">Institution not found.</div>;
  }
  if (!redirectUri) {
    return <div className="text-red-500">Redirect URI is missing.</div>;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // In our mock DB, we just have one user. We'll check against their credentials.
    const user = db.users[0];
    if (user.bank_login.username === username && user.bank_login.password_plaintext === password) {
      // Success! Redirect back to Cuan with a public_token.
      const callbackUrl = new URL(redirectUri);
      callbackUrl.searchParams.set('public_token', 'good_public_token_for_vstalin');
      callbackUrl.searchParams.set('institution_id', institution.institution_id);
      router.push(callbackUrl.toString());
    } else {
      // Simple error handling
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Connect with {institution.name}</h1>
        <p className="text-slate-600">Enter your credentials to continue.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" type="text" defaultValue={db.users[0].bank_login.username} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" defaultValue={db.users[0].bank_login.password_plaintext} required />
        </div>
        <Button type="submit" className="w-full">
          Log In & Connect
        </Button>
      </form>
      <p className="mt-4 text-xs text-slate-500 text-center">
        This is a mock environment. Cuan will not see your credentials.
      </p>
    </div>
  );
}

export default function MockConnectPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MockConnectContent />
        </Suspense>
    )
}
