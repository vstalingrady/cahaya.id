'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BarChart2, ShieldCheck, Zap, PiggyBank } from 'lucide-react';
import { useState } from 'react';
import CuanLogo from '@/components/icons/cuanlogo';
import NoiseOverlay from '@/components/noise-overlay';
import WelcomeDashboardMockup from '@/components/welcome-dashboard-mockup';
import { financialInstitutions } from '@/lib/data';
import InfiniteLogoScroller from '@/components/infinite-logo-scroller';
import WelcomePaymentMockup from '@/components/welcome-payment-mockup';
import WelcomeInsightsMockup from '@/components/welcome-insights-mockup';
import WelcomeVaultsMockup from '@/components/welcome-vaults-mockup';
import Image from 'next/image';

// Define the content for each feature slide
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
    icon: CuanLogo,
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
];

export default function WelcomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Data for the logo scroller
  const partnersRow1 = financialInstitutions
    .filter(f => f.type === 'bank' && ['bca', 'mandiri', 'bri', 'bni', 'cimb'].includes(f.slug))
    .map(f => ({ name: f.name, logo: <Image src={f.logoUrl} alt={f.name} width={90} height={36} className="h-9 w-auto object-contain" /> }));

  const partnersRow2 = financialInstitutions
    .filter(f => ['gopay', 'ovo', 'dana', 'shopeepay', 'linkaja'].includes(f.slug))
    .map(f => ({ name: f.name, logo: <Image src={f.logoUrl} alt={f.name} width={90} height={36} className="h-9 w-auto object-contain" /> }));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <NoiseOverlay opacity={0.02} />
      <div className="absolute inset-0 -z-10 h-full w-full bg-background has-hero-glow"></div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-4 z-50 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
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
      
      {/* Main Hero Section */}
      <main className="flex-1 flex items-center justify-center pt-24 pb-12">
        <div className="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side: Text Content & Controls */}
          <div className="text-center lg:text-left space-y-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight">
              All Your Money, <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                One Single App.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
              CuanFlex securely connects to all your bank and e-wallet accounts,
              giving you a complete financial overview and AI-powered insights to grow your wealth.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button size="lg" className="h-12 text-lg" asChild>
                <Link href="/signup">
                  Get Started for Free <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Right Side: Animated Mockup */}
          <div className="relative w-full h-[550px] flex items-center justify-center">
            {featureSlides.map((slide, index) => {
              const MockupComponent = slide.mockup;
              return (
                <div
                  key={slide.id}
                  className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${activeSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <MockupComponent isActive={activeSlide === index} className="absolute inset-0 m-auto" />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Feature Selector Section */}
      <section className="py-12 bg-background/50 backdrop-blur-sm">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featureSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(index)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${activeSlide === index ? 'border-primary bg-primary/10' : 'border-border bg-card/50 hover:bg-secondary/50'}`}
              >
                <slide.icon className={`w-8 h-8 mb-3 transition-colors ${activeSlide === index ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="font-semibold text-lg text-foreground">{slide.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{slide.description}</p>
              </button>
            ))}
          </div>
      </section>

      {/* Compatibility Section */}
       <section className="py-24 bg-card/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif">Broad Compatibility</h2>
          <p className="text-muted-foreground mt-4 mb-12 max-w-2xl mx-auto">
            We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon.
          </p>
          <div className="space-y-6">
            <InfiniteLogoScroller institutions={partnersRow1} speed="normal" direction="forward" />
            <InfiniteLogoScroller institutions={partnersRow2} speed="slow" direction="reverse" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background">
          <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CuanFlex. All Rights Reserved.</p>
          </div>
      </footer>
    </div>
  );
}
