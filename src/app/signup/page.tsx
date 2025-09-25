import Link from 'next/link';
import SignupForm from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-foreground p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
        
      <div className="relative z-10">
        {/* The SignupForm component already contains the "Create your Account" heading and other text, so these are removed from here to avoid duplication. */}
        <SignupForm />
      </div>
    </div>
  );
}
