import Link from 'next/link';
import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-foreground p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
        
      <div className="relative z-10">
        {/* The LoginForm component already contains the "Welcome Back" heading and the "Don't have an account? Sign Up" link, so these are removed from here to avoid duplication. */}
        <LoginForm />
      </div>
    </div>
  );
}
