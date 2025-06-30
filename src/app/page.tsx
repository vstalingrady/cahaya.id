import LoginForm from '@/components/auth/login-form';
import CuanLogo from '@/components/cuanflex-logo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-20 -left-10 w-48 h-48 bg-primary/30 rounded-full filter blur-xl opacity-50 animate-subtle-float"></div>
        <div className="absolute -bottom-20 -right-10 w-48 h-48 bg-accent/20 rounded-full filter blur-xl opacity-50 animate-subtle-float animation-delay-2000"></div>

        <div className="relative z-10 w-full animate-float-in">
          <div className="text-center mb-8">
            <CuanLogo className="w-40 h-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground font-headline">Welcome Back to Cuan</h1>
            <p className="text-muted-foreground">Your financial playground awaits.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
