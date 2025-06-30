import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CuanLogo from '@/components/cuanflex-logo';
import BankIcon from '@/components/icons/bank-icon';
import EwalletIcon from '@/components/icons/ewallet-icon';
import { cn } from '@/lib/utils';

const BackgroundAsset = ({ icon: Icon, className, style }: { icon: React.ElementType, className?: string, style?: React.CSSProperties }) => (
    <div 
        className={cn(
            "absolute rounded-2xl bg-card/10 backdrop-blur-sm p-4 border border-white/10 shadow-lg transform-gpu",
            className
        )}
        style={style}
    >
        <Icon className="w-10 h-10 text-white/50" />
    </div>
);

export default function WelcomePage() {
  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full overflow-hidden bg-black">
      
      <div className="absolute inset-0 -z-10 opacity-70">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-primary/30" style={{backgroundSize: '400% 400%', animation: 'background-pan 15s ease infinite'}}></div>
          
          <BackgroundAsset icon={BankIcon} className="top-[10%] left-[5%] animate-subtle-float" />
          <BackgroundAsset icon={EwalletIcon} className="top-[20%] right-[10%] animate-subtle-float" style={{ animationDelay: '1s' }} />
          <BackgroundAsset icon={BankIcon} className="bottom-[30%] left-[15%] animate-subtle-float" style={{ animationDelay: '2s' }} />
          <BackgroundAsset icon={EwalletIcon} className="bottom-[10%] right-[20%] animate-subtle-float" style={{ animationDelay: '3s' }} />
          <BackgroundAsset icon={BankIcon} className="top-[55%] right-[35%] animate-subtle-float" style={{ animationDelay: '1.5s' }} />
          <BackgroundAsset icon={EwalletIcon} className="bottom-[5%] left-[40%] animate-subtle-float" style={{ animationDelay: '2.5s' }} />
          <BackgroundAsset icon={BankIcon} className="top-[60%] left-[25%] animate-subtle-float" style={{ animationDelay: '0.5s' }} />
          <BackgroundAsset icon={EwalletIcon} className="top-[5%] right-[45%] animate-subtle-float" style={{ animationDelay: '3.5s' }} />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center flex-grow p-4 text-center">
        <div className="animate-float-in" style={{ animationDelay: '0ms' }}>
          <CuanLogo className="w-32 h-auto mb-12" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground mb-4 animate-float-in" style={{ animationDelay: '100ms' }}>
          All your money,
          <br />
          in one place.
        </h1>
        <p className="max-w-md text-lg text-muted-foreground mb-12 animate-float-in" style={{ animationDelay: '200ms' }}>
          Welcome to Cuan. The secure way to manage your finances.
        </p>
      </main>

      <footer className="relative z-10 w-full max-w-sm p-8 animate-float-in" style={{ animationDelay: '300ms' }}>
        <div className="grid grid-cols-1 gap-4">
          <Button asChild size="lg" className="font-bold text-lg h-14 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/signup">Create Account</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-bold text-lg h-14 border-muted-foreground/50 text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground hover:border-foreground">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}