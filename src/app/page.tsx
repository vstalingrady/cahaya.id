
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BarChart2, Zap, PiggyBank, Sparkles, ClipboardList } from 'lucide-react';
import CuanLogo from '@/components/icons/cuanlogo';
import NoiseOverlay from '@/components/noise-overlay';
import WelcomeDashboardMockup from '@/components/welcome-dashboard-mockup';
import { financialInstitutions } from '@/lib/data';
import InfiniteLogoScroller from '@/components/infinite-logo-scroller';
import WelcomePaymentMockup from '@/components/welcome-payment-mockup';
import WelcomeInsightsMockup from '@/components/welcome-insights-mockup';
import WelcomeVaultsMockup from '@/components/welcome-vaults-mockup';
import WelcomeBudgetsMockup from '@/components/welcome-budgets-mockup';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react';
import { cn } from '@/lib/utils';

export default function WelcomePage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const partnersRow1 = financialInstitutions
    .filter(f => f.type === 'bank' && ['bca', 'mandiri', 'bri', 'bni', 'cimb'].includes(f.slug))
    .map(f => ({ name: f.name, logo: <Image src={f.logoUrl} alt={f.name} width={90} height={36} className="h-9 w-auto object-contain" data-ai-hint={`${f.name} logo`} /> }));

  const partnersRow2 = financialInstitutions
    .filter(f => ['gopay', 'ovo', 'dana', 'shopeepay', 'linkaja'].includes(f.slug))
    .map(f => ({ name: f.name, logo: <Image src={f.logoUrl} alt={f.name} width={90} height={36} className="h-9 w-auto object-contain" data-ai-hint={`${f.name} logo`} /> }));

  const partnersRow3 = financialInstitutions
    .filter(f => ['bibit', 'pintu', 'jenius', 'dbs', 'ocbc'].includes(f.slug))
    .map(f => ({ name: f.name, logo: <Image src={f.logoUrl} alt={f.name} width={90} height={36} className="h-9 w-auto object-contain" data-ai-hint={`${f.name} logo`} /> }));

  const numSlides = 7;

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden">
      <NoiseOverlay opacity={0.02} />
      <div className="absolute inset-0 -z-10 h-full w-full bg-background has-hero-glow" />
      
      <div className="w-full max-w-md mx-auto h-screen flex flex-col">
        <header className="p-4 z-50 flex-shrink-0">
          <div className="w-full flex justify-between items-center">
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

        <div className="flex-1 overflow-hidden" ref={emblaRef}>
          <div className="h-full flex">
            
            {/* Slide 1: Hero */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-center px-6 pt-12 pb-6 gap-4">
                <div className="text-center space-y-4 animate-fade-in-up max-w-sm">
                    <h1 className="text-3xl text-foreground font-bold font-serif leading-tight">
                        All Your Money, <br />
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            One Single App.
                        </span>
                    </h1>
                    <p className="text-base text-muted-foreground">
                        CuanFlex securely connects to all your accounts, giving you a complete financial overview and AI-powered insights to grow your wealth.
                    </p>
                </div>
            </section>

            {/* Slide 2: Dashboard */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6 pt-12 pb-6 gap-4">
                <div className="text-center max-w-sm">
                    <BarChart2 className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="text-2xl font-bold font-serif mb-1 text-foreground">Unified Dashboard</h2>
                    <p className="text-muted-foreground text-sm">See your complete financial picture in one glance. Track balances across all your linked accounts in real-time.</p>
                </div>
                <div className="w-full px-4">
                    <WelcomeDashboardMockup isActive={selectedIndex === 1} className="h-[400px]" />
                </div>
            </section>

            {/* Slide 3: Payments */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6 pt-12 pb-6 gap-4">
                <div className="text-center max-w-sm">
                    <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="text-2xl font-bold font-serif mb-1 text-foreground">Effortless Payments</h2>
                    <p className="text-muted-foreground text-sm">Pay bills, transfer funds, and top-up e-wallets seamlessly from any of your accounts, all from one central hub.</p>
                </div>
                <div className="w-full px-4">
                    <WelcomePaymentMockup isActive={selectedIndex === 2} />
                </div>
            </section>

            {/* Slide 4: Budgets */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6 pt-12 pb-6 gap-4">
                <div className="text-center max-w-sm">
                    <ClipboardList className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="text-2xl font-bold font-serif mb-1 text-foreground">Smart Budgeting</h2>
                    <p className="text-muted-foreground text-sm">Set custom budgets, track your spending against them in real-time, and get coached by our AI to stay on track.</p>
                </div>
                <div className="w-full px-4">
                    <WelcomeBudgetsMockup isActive={selectedIndex === 3} className="h-[400px]" />
                </div>
            </section>

            {/* Slide 5: Insights */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6 pt-12 pb-6 gap-4">
                <div className="text-center max-w-sm">
                    <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="text-2xl font-bold font-serif mb-1 text-foreground">AI-Powered Insights</h2>
                    <p className="text-muted-foreground text-sm">Let our AI analyze your spending to find personalized saving opportunities and create actionable financial plans.</p>
                </div>
                <div className="w-full px-4">
                    <WelcomeInsightsMockup isActive={selectedIndex === 4} className="h-[450px]" />
                </div>
            </section>

            {/* Slide 6: Vaults */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6 pt-12 pb-6 gap-4">
                <div className="text-center max-w-sm">
                    <PiggyBank className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="text-2xl font-bold font-serif mb-1 text-foreground">Automated Savings</h2>
                    <p className="text-muted-foreground text-sm">Create savings vaults for your goals. Automate contributions with round-ups and scheduled transfers.</p>
                </div>
                <div className="w-full px-4">
                    <WelcomeVaultsMockup isActive={selectedIndex === 5} className="h-[450px]" />
                </div>
            </section>
            
            {/* Slide 7: Sign Up */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6 pt-12 pb-6 gap-4">
                <div className="text-center space-y-6 animate-fade-in-up max-w-sm">
                    <h2 className="text-3xl font-bold font-serif text-foreground">Ready to take control?</h2>
                    <p className="text-muted-foreground text-sm mt-4 mb-6">
                        We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon.
                    </p>
                    <div className="space-y-4">
                        <InfiniteLogoScroller institutions={partnersRow1} speed="normal" direction="forward" />
                        <InfiniteLogoScroller institutions={partnersRow2} speed="slow" direction="reverse" />
                        <InfiniteLogoScroller institutions={partnersRow3} speed="fast" direction="forward" />
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

        {/* Dot Indicator */}
        <div className="flex justify-center items-center gap-2 py-4">
            {Array.from({ length: numSlides }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={cn(
                        "transition-all duration-300 rounded-full",
                        selectedIndex === index ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-muted hover:bg-muted-foreground/50"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
