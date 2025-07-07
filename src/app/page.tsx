
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart2, Zap, PiggyBank, ClipboardList, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Import all mockups
import WelcomeDashboardMockup from '@/components/welcome-dashboard-mockup';
import WelcomePaymentMockup from '@/components/welcome-payment-mockup';
import WelcomeInsightsMockup from '@/components/welcome-insights-mockup';
import WelcomeVaultsMockup from '@/components/welcome-vaults-mockup';
import WelcomeBudgetsMockup from '@/components/welcome-budgets-mockup';
import WelcomeSecurityMockup from '@/components/welcome-security-mockup';

import NoiseOverlay from '@/components/noise-overlay';

const featureSlides = [
  {
    id: 'dashboard',
    icon: BarChart2,
    title: 'Unified Dashboard',
    description: 'See your complete financial picture in one glance. Track balances across all your linked accounts in real-time.',
    mockup: WelcomeDashboardMockup,
  },
  {
    id: 'payments',
    icon: Zap,
    title: 'Effortless Payments',
    description: 'Pay bills, transfer funds, and top-up e-wallets seamlessly from any of your accounts, all from one central hub.',
    mockup: WelcomePaymentMockup,
  },
  {
    id: 'insights',
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Let our AI analyze your spending to find personalized saving opportunities and create actionable financial plans.',
    mockup: WelcomeInsightsMockup,
  },
  {
    id: 'vaults',
    icon: PiggyBank,
    title: 'Automated Savings',
    description: 'Create savings vaults for your goals. Automate contributions with round-ups and scheduled transfers.',
    mockup: WelcomeVaultsMockup,
  },
  {
    id: 'budgets',
    icon: ClipboardList,
    title: 'Smart Budgets',
    description: 'Take control of your spending. Set custom budgets for different categories and get alerts before you go over.',
    mockup: WelcomeBudgetsMockup,
  },
  {
    id: 'security',
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    description: 'Your data is encrypted and protected with the highest security standards. Your privacy is our priority.',
    mockup: WelcomeSecurityMockup,
  },
];

export default function WelcomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (activeSlide < featureSlides.length - 1) {
      setActiveSlide((prev) => prev + 1);
    } else {
      router.push('/signup');
    }
  };
  
  const CurrentMockup = featureSlides[activeSlide].mockup;
  const isLastSlide = activeSlide === featureSlides.length - 1;
  
  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 flex flex-col min-h-screen relative overflow-hidden">
      <NoiseOverlay opacity={0.02} />
      <div className="absolute inset-0 -z-10 h-full w-full bg-background has-hero-glow"></div>

      <header className="absolute top-6 right-6 z-20">
        <Button variant="ghost" asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </header>
      
      <main className="flex-1 flex flex-col justify-center items-center text-center pt-12 pb-8">
        <div className="relative w-full h-[450px] mb-8 flex items-center justify-center">
            <CurrentMockup isActive={true} className="absolute inset-0 m-auto" />
        </div>
        
        <h1 className="text-3xl font-bold font-serif mb-4 text-foreground">
          {featureSlides[activeSlide].title}
        </h1>
        <p className="text-muted-foreground max-w-xs mx-auto min-h-[60px]">
          {featureSlides[activeSlide].description}
        </p>
      </main>

      <footer className="pb-8 pt-4 space-y-4">
        <div className="flex justify-center gap-2">
            {featureSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  activeSlide === index ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/50'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
        </div>
         <Button size="lg" className="w-full h-14 text-lg" onClick={handleNext}>
            {isLastSlide ? 'Get Started' : 'Continue'}
        </Button>
        <div className="text-center">
            <p className="text-sm text-muted-foreground">
                {isLastSlide ? "Already have an account? " : "Don't have an account? "}
                <Link href={isLastSlide ? "/login" : "/signup"} className="font-semibold text-primary/80 hover:text-primary underline">
                  {isLastSlide ? "Log In" : "Sign Up Now"}
                </Link>
            </p>
        </div>
      </footer>
    </div>
  );
}
