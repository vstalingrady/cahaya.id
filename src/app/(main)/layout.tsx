import MainNav from '@/components/main-nav';
import NoiseOverlay from '@/components/noise-overlay';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-white min-h-screen relative flex flex-col">
      <NoiseOverlay />
      
      <main className="flex-1 overflow-y-auto p-6 relative z-10 pb-24">
        {children}
      </main>
      
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-md">
        <MainNav />
      </div>
    </div>
  );
}
