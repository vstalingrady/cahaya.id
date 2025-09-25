import Link from 'next/link';
import LoginForm from '@/components/auth/login-form';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-foreground p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
        
      <div className="relative z-10">
        <Suspense fallback={<div className="flex justify-center items-center h-40"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
