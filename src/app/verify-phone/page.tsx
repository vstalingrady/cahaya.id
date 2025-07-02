import SignupForm from '@/components/auth/signup-form';
import NoiseOverlay from '@/components/noise-overlay';

export default function CompleteProfilePage() {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
      <NoiseOverlay />
        
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary font-serif">Complete Your Profile</h1>
          <p className="text-muted-foreground text-lg font-light">Just a few more details to get you started.</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
