'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import CuanLogo from '@/components/cuanflex-logo';

const FeatureSection = ({ title, description, imgSrc, imgHint, reverse = false }: { title: string, description: string, imgSrc: string, imgHint: string, reverse?: boolean }) => {
    return (
      <section className="py-20 md:py-32 px-6">
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center justify-center gap-8 lg:gap-16 max-w-6xl mx-auto`}>
          <div className="flex-1 text-center lg:text-left">
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-serif`}>
              {title}
            </h2>
            <p className={`text-lg lg:text-xl leading-relaxed text-muted-foreground`}>
              {description}
            </p>
          </div>
          <div className="flex-1 mt-8 lg:mt-0 w-full max-w-sm">
            <div className={`bg-card p-4 rounded-3xl border shadow-lg shadow-primary/10 border-border/50`}>
               <Image 
                  src={imgSrc}
                  alt={title}
                  width={600}
                  height={400}
                  data-ai-hint={imgHint}
                  className="rounded-2xl shadow-lg"
                />
            </div>
          </div>
        </div>
      </section>
    );
};

const serviceLogos = [
  { name: 'BCA', color: 'bg-blue-600' },
  { name: 'GoPay', color: 'bg-sky-500' },
  { name: 'OVO', color: 'bg-purple-600' },
  { name: 'DANA', color: 'bg-blue-400' },
  { name: 'Bibit', color: 'bg-green-500' },
  { name: 'Pintu', color: 'bg-indigo-500' },
  { name: 'Jago', color: 'bg-yellow-400' },
  { name: 'Kredivo', color: 'bg-orange-500' },
];

export default function WelcomePage() {
  return (
    <div className="w-full bg-background text-white">
       <header className="fixed top-0 left-0 right-0 z-30 p-4 bg-background/50 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <CuanLogo className="w-24 h-auto" />
          <div className="space-x-2">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="animate-pulsing-glow">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="h-screen flex flex-col justify-center items-center text-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-glow animate-hero-glow pointer-events-none -z-10"></div>
          <div className="mb-8 relative z-10 animate-fade-in-up">
            <h1 className="text-5xl lg:text-7xl font-bold mb-4 bg-gradient-to-tr from-primary via-purple-400 to-accent bg-clip-text text-transparent leading-tight font-serif">
              All your money,<br />in one place.
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto my-8 rounded-full"></div>
          </div>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-12 font-light relative z-10 animate-fade-in-up [animation-delay:0.2s]">Welcome to Cuan. The secure, unified way to manage your entire financial life from a single, beautiful app.</p>
        </section>

        {/* Feature Section 1 */}
        <FeatureSection 
          title="One Dashboard, Total Control."
          description="See your complete financial picture. BCA, GoPay, OVO, Bibit—all your accounts, one stunning dashboard. Finally understand your true net worth in real-time."
          imgSrc="https://placehold.co/600x400.png"
          imgHint="finance dashboard"
        />

        {/* Connect Everything Section */}
        <section className="py-20 md:py-32 px-6 text-center overflow-hidden">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-serif">
            Connect Everything in Seconds.
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-16">
            Link your banks, e-wallets, and investment apps with official, secure APIs. We never see or store your credentials.
          </p>
          <div className="relative w-full h-48 flex items-center justify-center [perspective:1000px]">
            <div className="relative w-32 h-32 [transform-style:preserve-3d] animate-spin-3d">
              {serviceLogos.map((logo, index) => {
                const angle = (360 / serviceLogos.length) * index;
                return (
                  <div
                    key={logo.name}
                    className="absolute w-full h-full"
                    style={{ transform: `rotateY(${angle}deg) translateZ(150px)` }}
                  >
                    <div className={`flex items-center justify-center w-32 h-32 rounded-3xl ${logo.color} text-xl font-bold shadow-2xl border border-white/10 ${logo.name === 'Jago' ? 'text-black' : 'text-white'}`}>
                      {logo.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Other Feature Sections */}
        <FeatureSection 
          title="Pay Any Bill, From Any Source."
          description="Settle your PLN, BPJS, or credit card bills in seconds. Choose which account to pay from on the fly. No more juggling apps or checking balances."
          imgSrc="https://placehold.co/600x400.png"
          imgHint="bill payment"
          reverse={true}
        />

        <FeatureSection 
          title="Save Smarter with Cuan Vaults."
          description="Create savings goals and fund them from any of your connected accounts. Ring-fence money for a holiday or a new gadget without touching your main spending balance."
          imgSrc="https://placehold.co/600x400.png"
          imgHint="savings goal"
        />
        
        <FeatureSection 
          title="Automatic Insights, Zero Effort."
          description="Finally understand where your money goes. Get a unified view of all your transactions and a clear breakdown of your spending habits, automatically."
          imgSrc="https://placehold.co/600x400.png"
          imgHint="pie chart finance"
          reverse={true}
        />

        {/* Final CTA */}
        <section className="py-20 md:py-32 px-6 text-center relative z-10 overflow-hidden">
          <div className="mb-8 relative z-10 max-w-4xl mx-auto">
            <h2 className="text-5xl lg:text-7xl font-bold mb-4 bg-gradient-to-tr from-primary via-purple-400 to-accent bg-clip-text text-transparent leading-tight font-serif">
              Ready to<br/>take control?
            </h2>
          </div>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-12 font-light relative z-10">Join Cuan today and experience a smarter way to manage your money. It's free, secure, and takes minutes to get started.</p>
          <div className="flex justify-center items-center gap-4 relative z-10">
            <Button asChild variant="link" className="text-muted-foreground hover:text-white">
               <Link href="/login">Log In</Link>
            </Button>
            <Button asChild size="lg" className="w-64 h-14 text-lg animate-pulsing-glow">
               <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
