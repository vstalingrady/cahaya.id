
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BarChart2, Zap, PiggyBank, Sparkles } from 'lucide-react';
import CuanLogo from '@/components/icons/cuanlogo';
import NoiseOverlay from '@/components/noise-overlay';
import WelcomeDashboardMockup from '@/components/welcome-dashboard-mockup';
import { financialInstitutions } from '@/lib/data';
import InfiniteLogoScroller from '@/components/infinite-logo-scroller';
import WelcomePaymentMockup from '@/components/welcome-payment-mockup';
import WelcomeInsightsMockup from '@/components/welcome-insights-mockup';
import WelcomeVaultsMockup from '@/components/welcome-vaults-mockup';
import Image from 'next/image';

export default function WelcomePage() {
  const partnersRow1 = financialInstitutions
    .filter(f => f.type === 'bank' && ['bca', 'mandiri', 'bri', 'bni', 'cimb'].includes(f.slug))
    .map(f => ({ name: f.name, logo: <Image src={f.logoUrl} alt={f.name} width={90} height={36} className="h-9 w-auto object-contain" data-ai-hint={`${f.name} logo`} /> }));

  const partnersRow2 = financialInstitutions
    .filter(f => ['gopay', 'ovo', 'dana', 'shopeepay', 'linkaja'].includes(f.slug))
    .map(f => ({ name: f.name, logo: <Image src={f.logoUrl} alt={f.name} width={90} height={36} className="h-9 w-auto object-contain" data-ai-hint={`${f.name} logo`} /> }));

  return (
    <div className="relative h-screen w-screen bg-background text-foreground overflow-hidden">
      <NoiseOverlay opacity={0.02} />
      <div className="absolute inset-0 -z-10 h-full w-full bg-background has-hero-glow" />
      
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 p-4 z-50">
        <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
          <CuanLogo className="w-32 h-auto" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button className="bg-primary/90 hover:bg-primary" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Horizontal Scrolling Container */}
      <div className="h-screen snap-x snap-mandatory overflow-x-auto overflow-y-hidden flex">
        
        {/* Slide 1: Hero */}
        <section className="h-screen w-screen flex-shrink-0 snap-center flex items-center justify-center p-6">
            <div className="text-center space-y-4 animate-fade-in-up max-w-md">
                <h1 className="text-4xl font-bold font-serif leading-tight">
                    All Your Money, <br />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        One Single App.
                    </span>
                </h1>
                <p className="text-base text-muted-foreground">
                    CuanFlex securely connects to all your accounts, giving you a complete financial overview and AI-powered insights to grow your wealth.
                </p>
                 <p className="text-sm text-muted-foreground animate-pulse">Scroll to discover features &rarr;</p>
            </div>
        </section>

        {/* Slide 2: Dashboard */}
        <section className="h-screen w-screen flex-shrink-0 snap-center flex items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto grid grid-cols-1 gap-6 items-center">
                <div className="text-center">
                    <BarChart2 className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h2 className="text-2xl font-bold font-serif mb-2">Unified Dashboard</h2>
                    <p className="text-muted-foreground text-sm">See your complete financial picture in one glance. Track balances across all your linked accounts in real-time.</p>
                </div>
                <div>
                    <WelcomeDashboardMockup isActive={true} />
                </div>
            </div>
        </section>

        {/* Slide 3: Payments */}
        <section className="h-screen w-screen flex-shrink-0 snap-center flex items-center justify-center p-6">
             <div className="w-full max-w-md mx-auto grid grid-cols-1 gap-6 items-center">
                <div className="text-center">
                    <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h2 className="text-2xl font-bold font-serif mb-2">Effortless Payments</h2>
                    <p className="text-muted-foreground text-sm">Pay bills, transfer funds, and top-up e-wallets seamlessly from any of your accounts, all from one central hub.</p>
                </div>
                <WelcomePaymentMockup isActive={true} />
            </div>
        </section>

        {/* Slide 4: Insights */}
        <section className="h-screen w-screen flex-shrink-0 snap-center flex items-center justify-center p-6">
             <div className="w-full max-w-md mx-auto grid grid-cols-1 gap-6 items-center">
                <div className="text-center">
                    <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h2 className="text-2xl font-bold font-serif mb-2">AI-Powered Insights</h2>
                    <p className="text-muted-foreground text-sm">Let our AI analyze your spending to find personalized saving opportunities and create actionable financial plans.</p>
                </div>
                <div>
                    <WelcomeInsightsMockup isActive={true} />
                </div>
            </div>
        </section>

        {/* Slide 5: Vaults */}
        <section className="h-screen w-screen flex-shrink-0 snap-center flex items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto grid grid-cols-1 gap-6 items-center">
                <div className="text-center">
                    <PiggyBank className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h2 className="text-2xl font-bold font-serif mb-2">Automated Savings</h2>
                    <p className="text-muted-foreground text-sm">Create savings vaults for your goals. Automate contributions with round-ups and scheduled transfers.</p>
                </div>
                <WelcomeVaultsMockup isActive={true} />
            </div>
        </section>
        
        {/* Slide 6: Sign Up */}
        <section className="h-screen w-screen flex-shrink-0 snap-center flex items-center justify-center p-6">
            <div className="text-center space-y-6 animate-fade-in-up max-w-md">
                 <h2 className="text-3xl font-bold font-serif">Ready to take control?</h2>
                <p className="text-muted-foreground text-sm mt-4 mb-6 max-w-sm mx-auto">
                    We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon.
                </p>
                <div className="space-y-4">
                    <InfiniteLogoScroller institutions={partnersRow1} speed="normal" direction="forward" />
                    <InfiniteLogoScroller institutions={partnersRow2} speed="slow" direction="reverse" />
                </div>
                <div className="pt-6">
                     <Button size="lg" className="h-14 text-lg" asChild>
                        <Link href="/signup">
                        Get Started for Free <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
                <div className="text-center text-muted-foreground text-xs pt-4">
                    <p>&copy; {new Date().getFullYear()} CuanFlex. All Rights Reserved.</p>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
}
