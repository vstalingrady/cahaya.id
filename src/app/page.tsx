'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import NoiseOverlay from '@/components/noise-overlay';
import CuanLogo from '@/components/icons/cuanlogo';
import WelcomeDashboardMockup from '@/components/welcome-dashboard-mockup';
import WelcomePaymentMockup from '@/components/welcome-payment-mockup';
import WelcomeInsightsMockup from '@/components/welcome-insights-mockup';
import WelcomeVaultsMockup from '@/components/welcome-vaults-mockup';
import WelcomeSecurityMockup from '@/components/welcome-security-mockup';
import WelcomeBudgetsMockup from '@/components/welcome-budgets-mockup';
import InfiniteLogoScroller from '@/components/infinite-logo-scroller';

// --- SVG Logo Components for Scroller ---
const PermataBankLogo = () => (
  <svg height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18 0C8.059 0 0 8.059 0 18C0 27.941 8.059 36 18 36C27.941 36 36 27.941 36 18C36 8.059 27.941 0 18 0ZM18.9 25.2H14.4V10.8H21.6C24.48 10.8 26.1 12.24 26.1 14.85C26.1 16.56 25.29 17.82 23.76 18.54L27 25.2H22.95L19.98 19.8H18.9V25.2Z" fill="#1A9483"/><path d="M18.9 18H21.06C22.5 18 23.4 17.19 23.4 15.75C23.4 14.22 22.5 13.5 21.06 13.5H18.9V18Z" fill="white"/></svg>
);
const BankDanamonLogo = () => (
  <svg height="36" viewBox="0 0 50 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 36V0H50V36H0Z" fill="#00A79D"/><path d="M25 28C32.1797 28 38 22.1797 38 15C38 7.8203 32.1797 2 25 2C17.8203 2 12 7.8203 12 15C12 22.1797 17.8203 28 25 28Z" fill="white"/><path d="M25 28C17.8203 28 12 22.1797 12 15C12 7.8203 17.8203 2 25 2V28Z" fill="#F36F21"/></svg>
);
const GopayLogo = () => (
  <svg height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="#00AED5"/><path d="M24.832 16.5L18 21.05L11.168 16.5V15.5L18 10.95L24.832 15.5V16.5Z" fill="#0083A3"/><path d="M18.463 20.627L24.832 16.5V15.5L18.463 11.373V20.627Z" fill="white"/></svg>
);
const DbsLogo = () => (
  <svg height="36" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0L0 9.5V12.35L20 2.85L40 12.35V9.5L20 0Z" fill="#D82D2D"/><path d="M20 12.825L0 22.325V25.175L20 15.675L40 25.175V22.325L20 12.825Z" fill="#D82D2D"/><path d="M20 25.65L0 35.15V38L20 28.5L40 38V35.15L20 25.65Z" fill="#D82D2D"/></svg>
);
const ShopeePayLogo = () => (
    <svg height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="#EE4D2D"/><path d="M22.043 12.035C21.439 11.459 20.363 11.303 19.343 11.591C19.319 11.519 9.923 14.639 12.635 22.823C12.683 22.967 12.755 23.087 12.827 23.231C12.827 23.231 12.851 23.255 12.851 23.279C14.123 21.023 16.547 21.107 17.699 21.923C18.827 22.715 18.707 24.347 17.627 25.115C16.547 25.883 15.115 25.739 14.123 24.779C14.075 24.731 13.523 24.179 13.931 23.699L13.523 24.179C13.523 24.179 13.499 24.227 13.475 24.227C12.455 21.995 14.939 14.735 19.463 12.719C20.387 13.919 21.215 15.395 21.431 17.027C22.679 16.283 23.591 14.951 23.591 13.547C23.567 12.923 23.015 12.179 22.043 12.035Z" fill="white"/></svg>
);
const LinkAjaLogo = () => (
    <svg height="30" viewBox="0 0 110 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.8 29.2H4.4L14.6 0H35L24.8 29.2Z" fill="#EF232A"/><path d="M51.6 15.8C51.6 23.6 45.4 29.2 38.2 29.2H24.8L35 0H44.8C48.8 0 51.6 3.6 51.6 7.6C51.6 10.4 50 13 47.6 14.4C50 15.6 51.6 17.6 51.6 15.8ZM42.8 19.8C43.8 19.8 44.6 19 44.6 18V13.2C44.6 12.2 43.8 11.4 42.8 11.4H38.2L35.6 19.8H42.8ZM42.6 8.6C43.6 8.6 44.4 7.8 44.4 6.8V4.2C44.4 3.2 43.6 2.4 42.6 2.4H39.6L37.8 8.6H42.6Z" fill="#EF232A"/><text x="55" y="24" fontFamily="Arial, Helvetica, sans-serif" fontSize="28" fontWeight="bold" fill="#181818">LinkAja</text></svg>
);
const XLAxiataLogo = () => (
    <svg height="36" viewBox="0 0 114 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 36L18 0H30L12 36H0Z" fill="#00AEEF"/><path d="M21 36L39 0H51L33 36H21Z" fill="#592C88"/><text x="55" y="28" fontFamily="Arial, Helvetica, sans-serif" fontSize="28" fontWeight="bold" fill="#181818">axiata</text></svg>
);
const SmartfrenLogo = () => (
  <svg height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="#ED1C24"/><path d="M17.8926 25.166C15.8236 25.166 14.2486 24.491 13.1686 23.141C12.0886 21.791 11.5486 19.9535 11.5486 17.6285C11.5486 15.3035 12.0886 13.466 13.1686 12.116C14.2486 10.766 15.8236 10.091 17.8926 10.091C19.9616 10.091 21.5366 10.766 22.6166 12.116C23.6966 13.466 24.2366 15.3035 24.2366 17.6285C24.2366 19.9535 23.6966 21.791 22.6166 23.141C21.5366 24.491 19.9616 25.166 17.8926 25.166ZM17.8926 22.5635C19.2016 22.5635 20.0616 21.6035 20.4716 19.6835H15.3136C15.7236 21.6035 16.5836 22.5635 17.8926 22.5635ZM20.4716 15.4885C20.0616 13.5685 19.2016 12.6085 17.8926 12.6085C16.5836 12.6085 15.7236 13.5685 15.3136 15.4885H20.4716Z" fill="white"/></svg>
);
const PlnLogo = () => (
    <svg height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.498 0L0 19.333H11.01L6.608 36L28 13.333H16.498V0Z" fill="#0093DD"/></svg>
);


const slides = [
  { 
    component: WelcomeDashboardMockup, 
    title: "All Your Money in One Place", 
    description: "Get a crystal-clear overview of your entire financial world. Link all your bank accounts and e-wallets for a single, unified view." 
  },
  { 
    component: WelcomePaymentMockup, 
    title: "Pay Bills & Transfer with Ease", 
    description: "Settle all your monthly bills, top up e-wallets, and transfer funds to any account in Indonesia from one central hub."
  },
  { 
    component: "CompatibilityCarousel", 
    title: "Broad Compatibility", 
    description: "We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon."
  },
  { 
    component: WelcomeBudgetsMockup, 
    title: "Smart Budgeting", 
    description: "Take control of your spending. Set monthly or one-time budgets for specific categories and track your progress in real-time."
  },
  { 
    component: WelcomeVaultsMockup, 
    title: "Save Smarter with Vaults", 
    description: "Create goal-based savings accounts. Automate your savings with recurring transfers and round-ups to reach your dreams faster."
  },
  { 
    component: WelcomeInsightsMockup, 
    title: "AI-Powered Financial Insights", 
    description: "Let our AI analyze your habits to find personalized saving opportunities and create an actionable financial plan just for you." 
  },
  { 
    component: WelcomeSecurityMockup, 
    title: "Bank-Grade Security", 
    description: "Your data is protected with 256-bit AES encryption and biometric authentication, using APIs from OJK-licensed partners."
  }
];

const partnersRow1 = [
    { name: 'Permata Bank', logo: <PermataBankLogo /> }, { name: 'Bank Danamon', logo: <BankDanamonLogo /> }, { name: 'gopay', logo: <GopayLogo /> }, { name: 'DBS Indonesia', logo: <DbsLogo /> }, { name: 'PLN', logo: <PlnLogo /> },
];
const partnersRow2 = [
    { name: 'DBS Indonesia', logo: <DbsLogo /> }, { name: 'ShopeePay', logo: <ShopeePayLogo /> }, { name: 'LinkAja', logo: <LinkAjaLogo /> }, { name: 'XL Axiata', logo: <XLAxiataLogo /> }, { name: 'gopay', logo: <GopayLogo /> },
];
const partnersRow3 = [
    { name: 'XL Axiata', logo: <XLAxiataLogo /> }, { name: 'Smartfren', logo: <SmartfrenLogo /> }, { name: 'PLN', logo: <PlnLogo /> }, { name: 'Bank Danamon', logo: <BankDanamonLogo /> }, { name: 'ShopeePay', logo: <ShopeePayLogo /> },
];


export default function WelcomePage() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <NoiseOverlay />
        <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[50vh] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

        <div className="text-center mb-8 mt-24 relative z-20 max-w-2xl mx-auto">
            <CuanLogo className="w-48 h-auto mx-auto mb-6 animate-logo-blink-glow" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif transition-all duration-500">
                {slides[current].title}
            </h1>
            <p className="text-lg text-muted-foreground transition-all duration-500 max-w-xl mx-auto">
                {slides[current].description}
            </p>
        </div>
        
        <Carousel setApi={setApi} className="w-full max-w-6xl relative z-20">
            <CarouselContent>
                {slides.map((slide, index) => {
                  const SlideComponent = slide.component;
                  return (
                    <CarouselItem key={index}>
                        <div className="p-1 flex items-center justify-center">
                            {typeof SlideComponent === 'string' ? (
                                <div className="space-y-4 py-8">
                                    <InfiniteLogoScroller institutions={partnersRow1} />
                                    <InfiniteLogoScroller institutions={partnersRow2} direction="reverse" />
                                    <InfiniteLogoScroller institutions={partnersRow3} />
                                </div>
                            ) : (
                                <SlideComponent isActive={index === current} />
                            )}
                        </div>
                    </CarouselItem>
                  )
                })}
            </CarouselContent>
        </Carousel>

        <div className="flex justify-center gap-2 mt-4 relative z-20">
            {slides.map((_, index) => (
                <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        current === index ? "bg-primary w-6" : "bg-muted hover:bg-muted-foreground/50"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
        
        <div className="mt-12 mb-16 relative z-20">
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-bold shadow-lg shadow-primary/20 transition-transform transform hover:scale-105">
                <Link href="/signup">Get Started for Free</Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
                Already have an account? <Link href="/login" className="font-semibold text-primary/80 hover:text-primary underline">Log In</Link>
            </p>
        </div>
    </div>
  );
}
