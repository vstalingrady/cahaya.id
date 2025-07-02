'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import CuanLogo from '@/components/cuanflex-logo';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const LogoSphere = () => {
  const logos = [
    { name: 'BCA', class: 'bg-blue-600' },
    { name: 'GP', fullName: 'GoPay', class: 'bg-sky-500' },
    { name: 'OVO', class: 'bg-purple-600' },
    { name: 'BB', fullName: 'Bibit', class: 'bg-green-600' },
    { name: 'PT', fullName: 'Pintu', class: 'bg-indigo-600' },
    { name: 'AJ', fullName: 'Ajaib', class: 'bg-teal-500' },
    { name: 'KR', fullName: 'Kredivo', class: 'bg-orange-500' },
    { name: 'MDR', fullName: 'Mandiri', class: 'bg-sky-700' },
    { name: 'BNI', class: 'bg-orange-600' },
  ];

  return (
    <div className="flex items-center justify-center w-full h-80" style={{ perspective: '1000px' }}>
      <div className="relative w-64 h-64 animate-spin-3d" style={{ transformStyle: 'preserve-3d' }}>
        {logos.map((logo, index) => {
          const angle = (360 / logos.length) * index;
          return (
            <div
              key={logo.fullName || logo.name}
              className={cn(
                'absolute top-[calc(50%-32px)] left-[calc(50%-32px)] w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg',
                logo.class
              )}
              style={{
                transform: `rotateY(${angle}deg) translateZ(150px)`,
              }}
            >
              {logo.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function WelcomePage() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  
  const slides = [
    {
      type: 'hero',
      title: 'All your money,\nin one place.',
      description: 'Welcome to Cuan. The secure, unified way to manage your entire financial life from a single, beautiful app.',
    },
    {
      type: 'feature',
      title: 'One Dashboard, Total Control.',
      description: 'See your complete financial picture. BCA, GoPay, OVO, Bibit—all your accounts, one stunning dashboard. Finally understand your true net worth in real-time.',
      customComponent: <LogoSphere />,
      reverse: false
    },
    {
      type: 'feature',
      title: 'Pay Any Bill, From Any Source.',
      description: 'Settle your PLN, BPJS, or credit card bills in seconds. Choose which account to pay from on the fly. No more juggling apps or checking balances.',
      imgSrc: 'https://placehold.co/800x600.png',
      imgHint: 'bill payment ui',
      reverse: true
    },
    {
      type: 'feature',
      title: 'Save Smarter with Cuan Vaults.',
      description: 'Create savings goals and fund them from any of your connected accounts. Ring-fence money for a holiday or a new gadget without touching your main spending balance.',
      imgSrc: 'https://placehold.co/800x600.png',
      imgHint: 'savings goals progress',
      reverse: false
    },
    {
      type: 'cta',
      title: 'Ready to take control?',
      description: "Join Cuan today and experience a smarter way to manage your money. It's free, secure, and takes minutes to get started.",
    }
  ];

  React.useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap());
    
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full h-screen bg-background text-white overflow-hidden">
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-screen flex items-center justify-center p-6 overflow-hidden">
                <div className="absolute inset-0 bg-hero-glow animate-hero-glow -z-10"></div>
                
                {slide.type === 'hero' && (
                  <div className="text-center relative z-10 animate-fade-in-up">
                     <CuanLogo className="w-28 h-auto mx-auto mb-8" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-tr from-primary via-purple-400 to-accent bg-clip-text text-transparent leading-tight font-serif whitespace-pre-line">
                      {slide.title}
                    </h1>
                     <p className="text-lg text-muted-foreground max-w-xl mx-auto my-8 font-light">
                      {slide.description}
                    </p>
                  </div>
                )}

                {slide.type === 'feature' && (
                   <div className={`flex flex-col ${slide.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center justify-center gap-8 lg:gap-16 max-w-5xl mx-auto`}>
                    <div className="flex-1 text-center lg:text-left animate-fade-in-up">
                      <h2 className="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-serif">
                        {slide.title}
                      </h2>
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        {slide.description}
                      </p>
                    </div>
                    <div className="flex-1 mt-8 lg:mt-0 w-full max-w-md animate-fade-in-up [animation-delay:0.2s]">
                      <div className="bg-card/50 p-4 rounded-3xl border shadow-lg shadow-primary/10 border-border/50 backdrop-blur-sm">
                        {slide.customComponent ? slide.customComponent : (
                          <Image 
                              src={slide.imgSrc!}
                              alt={slide.title!}
                              width={800}
                              height={600}
                              data-ai-hint={slide.imgHint!}
                              className="rounded-2xl shadow-lg"
                            />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {slide.type === 'cta' && (
                  <div className="text-center relative z-10 animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-tr from-primary via-purple-400 to-accent bg-clip-text text-transparent leading-tight font-serif">
                      {slide.title}
                    </h2>
                     <p className="text-lg text-muted-foreground max-w-xl mx-auto my-8 font-light">
                      {slide.description}
                    </p>
                    <Button asChild size="lg" className="w-64 h-14 text-lg animate-slow-pulse">
                      <Link href="/signup">Create Free Account <ArrowRight className="ml-2" /></Link>
                    </Button>
                     <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-primary/80 hover:text-primary underline">
                              Log In
                            </Link>
                        </p>
                    </div>
                  </div>
                )}

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center gap-4">
        <div className="flex gap-2">
            {slides.map((_, index) => (
                <button 
                    key={index} 
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        index === current ? "bg-primary w-6" : "bg-muted hover:bg-muted-foreground/50"
                    )}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
