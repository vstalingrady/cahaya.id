
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react'
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CreditCard, PiggyBank, TrendingUp, Shield, Zap, Target, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import CuanLogo from '@/components/icons/CuanLogo';
import WelcomeDashboardMockup from '@/components/welcome-dashboard-mockup';
import { financialInstitutions } from '@/lib/data';
import Image from 'next/image';
import InfiniteLogoScroller from '@/components/infinite-logo-scroller';
import WelcomePaymentMockup from '@/components/welcome-payment-mockup';
import WelcomeInsightsMockup from '@/components/welcome-insights-mockup';
import WelcomeVaultsMockup from '@/components/welcome-vaults-mockup';
import WelcomeSecurityMockup from '@/components/welcome-security-mockup';
import WelcomeBudgetsMockup from '@/components/welcome-budgets-mockup';

const slides = [
    {
      type: 'hero',
      title: 'All your money,\nin one place.',
      description: 'Welcome to Cuan. The secure, unified way to manage your entire financial life from a single, beautiful app.',
      content: (
        <div className="text-center relative z-10">
          <CuanLogo className="w-32 h-auto mx-auto mb-6 animate-logo-blink-glow" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-tr from-primary to-accent bg-clip-text text-transparent leading-tight font-serif whitespace-pre-line drop-shadow-[0_0_5px_hsl(var(--primary)/0.3)]">
            All your money,{'\n'}in one place.
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto my-6 font-light">
            Welcome to Cuan. The secure, unified way to manage your entire financial life from a single, beautiful app.
          </p>
        </div>
      )
    },
    {
      type: 'feature_showcase',
      title: 'Connect Everything. See Everything.',
      description: 'BCA, GoPay, OVO, Bibit—all your accounts, in one stunning dashboard. Finally understand your true net worth in real-time.',
      content: (props: { isActive: boolean }) => (
        <div className="flex flex-col items-center justify-center text-center w-full max-w-lg mx-auto py-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            Connect Everything. See Everything.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-6">
            BCA, GoPay, OVO, Bibit—all your accounts, in one stunning dashboard. Finally understand your true net worth in real-time.
          </p>
          <WelcomeDashboardMockup isActive={props.isActive} />
        </div>
      )
    },
    {
      type: 'logo_wall',
      title: 'Broad Compatibility',
      description: 'We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon.',
      content: (
        <div className="w-full text-center py-12">
           <div className="max-w-xl mx-auto px-4">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
              Broad Compatibility
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground mb-8">
              We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon.
            </p>
           </div>
          <div className="w-full space-y-4 mt-8">
            <InfiniteLogoScroller 
              institutions={financialInstitutions.slice(0, 10)} 
              direction="reverse" 
              speed="slow" 
            />
            <InfiniteLogoScroller 
              institutions={financialInstitutions.slice(10, 20)} 
              direction="forward" 
              speed="normal" 
            />
            <InfiniteLogoScroller 
              institutions={financialInstitutions.slice(20, 30)} 
              direction="reverse" 
              speed="slow" 
            />
          </div>
        </div>
      )
    },
    {
      type: 'feature',
      title: 'Pay Any Bill, From Any Source.',
      description: 'Settle your PLN, BPJS, or credit card bills in seconds. Choose which account to pay from on the fly. No more juggling apps or checking balances.',
      content: (props: { isActive: boolean }) => (
        <div className="flex flex-col items-center justify-center text-center w-full max-w-lg mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            Pay Any Bill, From Any Source.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-8">
            Settle your PLN, BPJS, or credit card bills in seconds. Choose which account to pay from on the fly. No more juggling apps or checking balances.
          </p>
          <WelcomePaymentMockup isActive={props.isActive} />
        </div>
      )
    },
    {
      type: 'feature',
      title: 'Track Spending with Smart Budgets.',
      description: "Take control of your spending. Create custom budgets for any category and see at a glance how you're tracking towards your goals.",
      content: (props: { isActive: boolean }) => (
        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            Track Spending with Smart Budgets.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-8">
             Take control of your spending. Create custom budgets for any category and see at a glance how you're tracking towards your goals.
          </p>
          <WelcomeBudgetsMockup isActive={props.isActive} />
        </div>
      )
    },
    {
      type: 'feature',
      title: 'Get Smarter Insights with AI.',
      description: "Unleash the power of Gemini 2.5 Flash Lite, the world's most advanced AI. It analyzes your spending to give you a Financial Health Score, find hidden saving opportunities, and create a personalized action plan.",
      content: (props: { isActive: boolean }) => (
        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            Get Smarter Insights with AI.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-8">
            Unleash the power of{' '}
            <span className="flashy-gemini-text">Gemini 2.5</span>, one of
            the world's most advanced AI models. It analyzes your spending to give you a
            Financial Health Score, find hidden saving opportunities, and create
            a personalized action plan.
          </p>
          <WelcomeInsightsMockup isActive={props.isActive} />
        </div>
      )
    },
    {
      type: 'feature',
      title: 'Save Smarter with Cuan Vaults.',
      description: 'Create savings goals and fund them from any of your connected accounts. Ring-fence money for a holiday or a new gadget without touching your main spending balance.',
      content: (props: { isActive: boolean }) => (
        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            Save Smarter with Cuan Vaults.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-8">
            Create savings goals and fund them from any of your connected accounts. Ring-fence money for a holiday or a new gadget without touching your main spending balance.
          </p>
          <WelcomeVaultsMockup isActive={props.isActive} />
        </div>
      )
    },
    {
      type: 'feature_showcase',
      title: 'Your Security is Our Priority.',
      description: "We use bank-level security, end-to-end encryption, and give you full control over your data. Your trust is our most important asset.",
      content: (
        <div className="flex flex-col items-center justify-center text-center w-full max-w-lg mx-auto py-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            Your Security is Our Priority.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-6">
            We use bank-level security, end-to-end encryption, and give you full control over your data. Your trust is our most important asset.
          </p>
          <WelcomeSecurityMockup />
        </div>
      )
    },
    {
      type: 'cta',
      title: 'Ready to take control?',
      description: "Join Cuan today and experience a smarter way to manage your money. It's free, secure, and takes minutes to get started.",
      content: (
        <div className="text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-tr from-primary via-purple-400 to-accent bg-clip-text text-transparent leading-tight font-serif drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]">
            Ready to take control?
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto my-6 font-light">
            Join Cuan today and experience a smarter way to manage your money. It's free, secure, and takes minutes to get started.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-64 h-14 text-lg animate-slow-pulse">
              <Link href="/signup">
                Create Free Account <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Bank-level security</p>
              </div>
              <div className="text-center">
                <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Setup in minutes</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Free forever</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80 underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      )
    }
  ];

export default function WelcomePage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [currentSlide, setCurrentSlide] = useState(0);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
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

  return (
    <div className="w-full h-screen bg-background text-foreground overflow-hidden relative">
      <div className="absolute -top-1/2 left-0 right-0 h-full bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,hsl(var(--primary)/0.25),transparent_70%)] -z-10"></div>
      
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
            {slides.map((slide, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                    <div className="h-full overflow-y-auto flex items-center justify-center p-6 custom-scrollbar">
                        <div className={cn(
                            // This wrapper controls the animation for each slide
                            index === currentSlide ? 'animate-fade-in-up' : 'opacity-0'
                        )}>
                            {typeof slide.content === 'function' ? slide.content({ isActive: index === currentSlide }) : slide.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center gap-4">
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button 
              key={index} 
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(`w-2 h-2 rounded-full transition-all duration-300`,
                index === currentSlide ? "bg-primary w-6" : "bg-muted hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
