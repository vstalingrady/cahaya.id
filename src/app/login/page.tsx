import Link from 'next/link';
import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-foreground p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
        
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary font-serif">Welcome Back</h1>
          <p className="text-muted-foreground text-lg font-light">Log in to continue to Cahaya.</p>
        </div>
        <LoginForm />
        <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold text-primary/80 hover:text-primary underline">
                  Sign Up
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
