'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type CarouselApi } from '@/components/ui/carousel';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import NoiseOverlay from '@/components/noise-overlay';

const FeatureSection = ({ title, description, imgSrc, imgHint, reverse = false }: { title: string, description: string, imgSrc: string, imgHint: string, reverse?: boolean }) => {
    const titleColor = 'from-red-400 via-purple-500 to-purple-600';
    const textColor = 'text-purple-200';
    const boxColor = 'from-purple-900/50 to-purple-800/30 border-purple-600/20';

    return (
      <section className="h-screen flex items-center justify-center p-6 lg:p-12">
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center justify-center gap-8 lg:gap-16 max-w-5xl mx-auto`}>
          <div className="flex-1 text-center lg:text-left">
            <h2 className={`text-4xl lg:text-6xl font-black mb-6 bg-gradient-to-r bg-clip-text text-transparent ${titleColor}`}>
              {title}
            </h2>
            <p className={`text-lg lg:text-xl leading-relaxed ${textColor}`}>
              {description}
            </p>
          </div>
          <div className="flex-1 mt-8 lg:mt-0 w-full max-w-sm">
            <div className={`bg-gradient-to-br p-4 rounded-3xl backdrop-blur-xl border shadow-2xl ${boxColor}`}>
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
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])
  
  const slides = [
    // Hero Section
    <section key="hero" className="h-screen flex flex-col justify-center items-center text-center p-6 relative z-10">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-red-600/30 to-rose-600/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      <div className="mb-8">
        <h1 className="text-6xl lg:text-8xl font-black mb-4 bg-gradient-to-r from-red-400 via-purple-500 to-purple-600 bg-clip-text text-transparent leading-tight">
          All your money,<br />in one place.
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
      </div>
      <p className="text-purple-100 text-xl max-w-2xl mx-auto mb-12 font-light">Welcome to Cuan. The secure, unified way to manage your entire financial life from a single, beautiful app.</p>
    </section>,

    // Feature Section 1
    <FeatureSection 
      key="feature1"
      title="One Dashboard, Total Control."
      description="See your complete financial picture. BCA, GoPay, OVO, Bibit—all your accounts, one stunning dashboard. Finally understand your true net worth in real-time."
      imgSrc="https://placehold.co/600x400.png"
      imgHint="finance dashboard"
    />,

    // Connect Everything Section
    <section key="connect" className="h-screen flex flex-col items-center justify-center p-6 lg:p-12 text-center">
      <h2 className="text-4xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-red-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
        Connect Everything in Seconds.
      </h2>
      <p className="text-lg lg:text-xl text-purple-200 leading-relaxed max-w-3xl mx-auto mb-12">
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
                <div className={`flex items-center justify-center w-32 h-32 rounded-3xl ${logo.color} text-xl font-black shadow-2xl border border-white/10 ${logo.name === 'Jago' ? 'text-black' : 'text-white'}`}>
                  {logo.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>,
    
    // Feature Section 2
    <FeatureSection 
      key="feature2"
      title="Pay Any Bill, From Any Source."
      description="Settle your PLN, BPJS, or credit card bills in seconds. Choose which account to pay from on the fly. No more juggling apps or checking balances."
      imgSrc="https://placehold.co/600x400.png"
      imgHint="bill payment"
      reverse={true}
    />,

    // Feature Section 3
    <FeatureSection 
      key="feature3"
      title="Save Smarter with Cuan Vaults."
      description="Create savings goals and fund them from any of your connected accounts. Ring-fence money for a holiday or a new gadget without touching your main spending balance."
      imgSrc="https://placehold.co/600x400.png"
      imgHint="savings goal"
    />,
    
    // Feature Section 4
    <FeatureSection 
      key="feature4"
      title="Automatic Insights, Zero Effort."
      description="Finally understand where your money goes. Get a unified view of all your transactions and a clear breakdown of your spending habits, automatically."
      imgSrc="https://placehold.co/600x400.png"
      imgHint="pie chart finance"
      reverse={true}
    />,

    // Final CTA
    <section key="cta" className="h-screen flex flex-col justify-center items-center text-center p-6 relative z-10">
      <div className="mb-8">
        <h1 className="text-6xl lg:text-8xl font-black mb-4 bg-gradient-to-r from-red-400 via-purple-500 to-purple-600 bg-clip-text text-transparent leading-tight">
          Ready to<br/>take control?
        </h1>
      </div>
      <p className="text-purple-100 text-xl max-w-2xl mx-auto mb-12 font-light">Join Cuan today and experience a smarter way to manage your money. It's free, secure, and takes minutes to get started.</p>
      <div className="space-y-4 relative z-10">
        <Link 
          href="/signup"
          className="block w-64 bg-gradient-to-r from-red-600 via-purple-500 to-purple-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl border border-purple-400/30 hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group text-center"
        >
          <NoiseOverlay opacity={0.05} />
          <span className="relative z-10">Create Account</span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        <Link href="/login" className="block w-full text-purple-300 py-3 font-semibold hover:text-purple-200 transition-colors text-center">Log In</Link>
      </div>
    </section>
  ];

  return (
    <div className="bg-gradient-to-br from-black via-purple-950 to-black text-white h-screen relative overflow-hidden">
      <NoiseOverlay opacity={0.03} />

      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>{slide}</CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {Array.from({ length: count }).map((_, i) => (
            <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${current === i ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/50 hover:bg-muted-foreground'}`}
                aria-label={`Go to slide ${i + 1}`}
            />
        ))}
      </div>
    </div>
  );
}
