
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart2, Zap, PiggyBank, Sparkles, ClipboardList, ShieldCheck } from 'lucide-react';
import CahayaLogo from '@/components/icons/cuanlogo';
import WelcomeDashboardMockup from '@/components/welcome-dashboard-mockup';
import WelcomePaymentMockup from '@/components/welcome-payment-mockup';
import WelcomeInsightsMockup from '@/components/welcome-insights-mockup';
import WelcomeVaultsMockup from '@/components/welcome-vaults-mockup';
import WelcomeBudgetsMockup from '@/components/welcome-budgets-mockup';
import WelcomeSecurityMockup from '@/components/welcome-security-mockup';
import WelcomeSignupSlide from '@/components/welcome-signup-slide';
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

  const numSlides = 8;

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background has-hero-glow" />
      
      <div className="w-full max-w-md mx-auto h-screen flex flex-col">
        <header className="p-4 z-50 flex-shrink-0">
          <div className="w-full flex justify-between items-center">
            <CahayaLogo className="w-32 h-auto" />
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
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-center px-6 pb-6 gap-4 overflow-y-auto custom-scrollbar">
                <div className="text-center space-y-4 animate-fade-in-up max-w-sm">
                    <h1 className="text-3xl text-foreground font-bold font-serif leading-tight">
                        All Your Money, <br />
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            One Single App.
                        </span>
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Cahaya securely connects to all your accounts, giving you a complete financial overview and AI-powered insights to grow your wealth.
                    </p>
                </div>
            </section>

            {/* Slide 2: Dashboard */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6 pt-12 pb-6 gap-4 overflow-y-auto custom-scrollbar">
                <div className="text-center max-w-sm min-h-36">
                    <BarChart2 className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="text-2xl font-bold font-serif mb-1 text-foreground">Unified Dashboard</h2>
                    <p className="text-muted-foreground text-sm">See your complete financial picture in one glance. Track balances across all your linked accounts in real-time.</p>
                </div>
                <div className="w-full px-4">
                    <WelcomeDashboardMockup isActive={selectedIndex === 1} className="h-[500px]" />
                </div>
            </section>

            {/* Slide 3: Payments */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6 pt-12 pb-6 gap-4 overflow-y-auto custom-scrollbar">
                <div className="text-center max-w-sm min-h-36">
                    <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="text-2xl font-bold font-serif mb-1 text-foreground">Effortless Payments</h2>
                    <p className="text-muted-foreground text-sm">Pay bills, transfer funds, and top-up e-wallets seamlessly from any of your accounts, all from one central hub.</p>
                </div>
                <div className="w-full px-4">
                    <WelcomePaymentMockup isActive={selectedIndex === 2} className="h-[500px]" />
                </div>
            </section>

            {/* Slide 4: Budgets */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6 pt-12 pb-6 gap-4 overflow-y-auto custom-scrollbar">
                <div className="text-center max-w-sm min-h-36">
                    <ClipboardList className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="text-2xl font-bold font-serif mb-1 text-foreground">Smart Budgeting</h2>
                    <p className="text-muted-foreground text-sm">Set custom budgets, track your spending against them in real-time, and get coached by our AI to stay on track.</p>
                </div>
                <div className="w-full px-4">
                    <WelcomeBudgetsMockup isActive={selectedIndex === 3} className="h-[500px]" />
                </div>
            </section>

            {/* Slide 5: Insights */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6 pt-12 pb-6 gap-4 overflow-y-auto custom-scrollbar">
                <div className="text-center max-w-sm min-h-36">
                    <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="text-2xl font-bold font-serif mb-1 text-foreground">AI-Powered Insights</h2>
                    <p className="text-muted-foreground text-sm">Let our AI analyze your spending to find personalized saving opportunities and create actionable financial plans.</p>
                </div>
                <div className="w-full px-4">
                    <WelcomeInsightsMockup isActive={selectedIndex === 4} className="h-[500px]" />
                </div>
            </section>

            {/* Slide 6: Vaults */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6 pt-12 pb-6 gap-4 overflow-y-auto custom-scrollbar">
                <div className="text-center max-w-sm min-h-36">
                    <PiggyBank className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="text-2xl font-bold font-serif mb-1 text-foreground">Automated Savings</h2>
                    <p className="text-muted-foreground text-sm">Create savings vaults for your goals. Automate contributions with round-ups and scheduled transfers.</p>
                </div>
                <div className="w-full px-4">
                    <WelcomeVaultsMockup isActive={selectedIndex === 5} className="h-[500px]" />
                </div>
            </section>

            {/* Slide 7: Security */}
            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6 pt-12 pb-6 gap-4 overflow-y-auto custom-scrollbar">
                <div className="text-center max-w-sm min-h-36">
                    <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h2 className="text-2xl font-bold font-serif mb-1 text-foreground">Bank-Grade Security</h2>
                    <p className="text-muted-foreground text-sm">Your data is protected with the highest bank-grade security standards, including 256-bit AES encryption. Your privacy is our priority.</p>
                </div>
                <div className="w-full px-4">
                    <WelcomeSecurityMockup isActive={selectedIndex === 6} className="h-[500px]" />
                </div>
            </section>
            
            {/* Slide 8: Sign Up */}
            <WelcomeSignupSlide />

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
                        selectedIndex === index ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
