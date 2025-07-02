
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
import PhoneMockup from '@/components/phone-mockup';


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
      title: 'Connect Everything. See Everything.',
      description: 'BCA, GoPay, OVO, Bibit—all your accounts, in one stunning dashboard. Finally understand your true net worth in real-time.',
      imgSrc: 'https://placehold.co/375x812.png',
      imgHint: 'app dashboard',
      reverse: false
    },
    {
      type: 'feature',
      title: 'Pay Any Bill, From Any Source.',
      description: 'Settle your PLN, BPJS, or credit card bills in seconds. Choose which account to pay from on the fly. No more juggling apps or checking balances.',
      imgSrc: 'https://placehold.co/375x812.png',
      imgHint: 'bill payment ui',
      reverse: true
    },
    {
      type: 'feature',
      title: 'Save Smarter with Cuan Vaults.',
      description: 'Create savings goals and fund them from any of your connected accounts. Ring-fence money for a holiday or a new gadget without touching your main spending balance.',
      imgSrc: 'https://placehold.co/375x812.png',
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
    <div className="w-full h-screen bg-background text-white">
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative w-full h-screen flex flex-col items-center justify-center p-6 overflow-y-auto">
                <div className="absolute inset-0 bg-hero-glow animate-hero-glow -z-10"></div>
                
                {slide.type === 'hero' && (
                  <div className="text-center relative z-10 animate-fade-in-up">
                     <CuanLogo className="w-24 h-auto mx-auto mb-8" />
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-tr from-primary via-purple-400 to-accent bg-clip-text text-transparent leading-tight font-serif whitespace-pre-line">
                      {slide.title}
                    </h1>
                     <p className="text-base text-muted-foreground max-w-xl mx-auto my-6 font-light">
                      {slide.description}
                    </p>
                  </div>
                )}

                {slide.type === 'feature' && (
                   <div className={cn(
                       "flex flex-col items-center justify-center gap-8 max-w-6xl mx-auto lg:gap-16 w-full",
                       slide.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
                    )}>
                    <div className="flex-1 text-center lg:text-left animate-fade-in-up">
                      <h2 className="text-2xl lg:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-serif">
                        {slide.title}
                      </h2>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {slide.description}
                      </p>
                    </div>
                    <div className="flex-1 mt-8 lg:mt-0 w-full flex justify-center animate-fade-in-up [animation-delay:0.2s]">
                      <PhoneMockup>
                        <Image 
                            src={slide.imgSrc!}
                            alt={slide.title!}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            data-ai-hint={slide.imgHint!}
                            className="object-cover"
                          />
                      </PhoneMockup>
                    </div>
                  </div>
                )}

                {slide.type === 'cta' && (
                  <div className="text-center relative z-10 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-tr from-primary via-purple-400 to-accent bg-clip-text text-transparent leading-tight font-serif">
                      {slide.title}
                    </h2>
                     <p className="text-base text-muted-foreground max-w-lg mx-auto my-6 font-light">
                      {slide.description}
                    </p>
                    <Button asChild size="lg" className="w-64 h-14 text-lg animate-slow-pulse">
                      <Link href="/signup">Create Free Account <ArrowRight className="ml-2" /></Link>
                    </Button>
                     <div className="mt-6 text-center">
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
