import SignupForm from '@/components/auth/signup-form';
import CuanFlexLogo from '@/components/cuanflex-logo';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/30 rounded-full filter blur-xl opacity-50 animate-subtle-float animation-delay-2000"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent/20 rounded-full filter blur-xl opacity-50 animate-subtle-float"></div>
        
        <div className="relative z-10 w-full animate-float-in">
           <div className="text-center mb-8">
            <CuanFlexLogo className="w-48 h-auto mx-auto mb-2 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-headline">Create Your Account</h1>
            <p className="text-muted-foreground">Start your surreal financial journey.</p>
          </div>
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
