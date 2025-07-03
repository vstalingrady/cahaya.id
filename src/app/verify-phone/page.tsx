import VerifyPhoneForm from '@/components/auth/verify-phone-form';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyPhonePage() {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 flex flex-col justify-center min-h-screen">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-primary font-serif">Enter Your Code</h1>
            <Suspense>
                <VerifyPhoneDescription />
            </Suspense>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyPhoneForm />
        </Suspense>
      </div>
  );
}

function VerifyPhoneDescription() {
    const searchParams = useSearchParams();
    const phone = searchParams.get('phone');
    return (
        <p className="text-muted-foreground text-lg font-light">
          We sent a 6-digit code to {phone}.
        </p>
    )
}
