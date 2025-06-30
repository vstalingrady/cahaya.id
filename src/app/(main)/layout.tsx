import MainNav from '@/components/main-nav';
import NoiseOverlay from '@/components/noise-overlay';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-black via-red-950 to-black text-white min-h-screen relative overflow-hidden flex flex-col">
      <NoiseOverlay />
      
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 relative z-10 pb-24">
        {children}
      </main>
      
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <MainNav />
      </div>
    </div>
  );
}
