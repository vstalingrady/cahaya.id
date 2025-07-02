import Link from 'next/link';
import LoginForm from '@/components/auth/login-form';
import NoiseOverlay from '@/components/noise-overlay';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-black via-red-950 to-black text-white p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
      <NoiseOverlay />
        
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-accent/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">Welcome Back</h1>
          <p className="text-red-100 text-lg font-light">Log in to continue to Cuan.</p>
        </div>
        <LoginForm />
        <div className="text-center mt-6">
            <p className="text-sm text-red-300">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold text-red-400 hover:text-red-300 underline">
                  Sign Up
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
