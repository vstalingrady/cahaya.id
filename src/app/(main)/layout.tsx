import MainNav from '@/components/main-nav';
import { AuthProvider } from '@/components/auth/auth-provider';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="w-full max-w-md mx-auto bg-background text-foreground min-h-screen relative flex flex-col overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background">
          <div className="absolute -top-1/2 left-0 right-0 h-full bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,hsl(var(--primary)/0.1),transparent_70%)]"></div>
          <div className="absolute -bottom-1/2 left-0 right-0 h-full bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,hsl(var(--accent)/0.15),transparent_70%)]"></div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 relative z-10 pb-24">
          {children}
        </main>
        
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-md">
          <MainNav />
        </div>
      </div>
    </AuthProvider>
  );
}
