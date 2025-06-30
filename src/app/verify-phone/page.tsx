import SignupForm from '@/components/auth/signup-form';
import NoiseOverlay from '@/components/noise-overlay';

export default function CompleteProfilePage() {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-black via-red-950 to-black text-white p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
      <NoiseOverlay />
        
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent font-serif">Complete Your Profile</h1>
          <p className="text-red-100 text-lg font-light">Just a few more details to get you started.</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
