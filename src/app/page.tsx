'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import CuanLogo from '@/components/icons/cuanlogo';


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
      type: 'feature_showcase',
      title: 'Connect Everything. See Everything.',
      description: 'BCA, GoPay, OVO, Bibit—all your accounts, in one stunning dashboard. Finally understand your true net worth in real-time.',
    },
    {
      type: 'feature',
      title: 'Pay Any Bill, From Any Source.',
      description: 'Settle your PLN, BPJS, or credit card bills in seconds. Choose which account to pay from on the fly. No more juggling apps or checking balances.',
    },
    {
      type: 'feature',
      title: 'Save Smarter with Cuan Vaults.',
      description: 'Create savings goals and fund them from any of your connected accounts. Ring-fence money for a holiday or a new gadget without touching your main spending balance.',
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
            <CarouselItem key={index} className="pl-0 basis-full overflow-hidden">
              <div className="relative w-full h-screen flex flex-col items-center justify-center p-6">
                <div className="absolute inset-0 bg-hero-glow -z-10"></div>
                
                {slide.type === 'hero' && (
                  <div className="text-center relative z-10 animate-fade-in-up">
                    <CuanLogo className="w-24 h-auto mx-auto mb-6" />
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-tr from-primary via-purple-400 to-accent bg-clip-text text-transparent leading-tight font-serif whitespace-pre-line">
                      {slide.title}
                    </h1>
                     <p className="text-lg text-muted-foreground max-w-lg mx-auto my-6 font-light">
                      {slide.description}
                    </p>
                  </div>
                )}

                {slide.type === 'feature' && (
                   <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-fade-in-up">
                      <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-serif">
                        {slide.title}
                      </h2>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {slide.description}
                      </p>
                  </div>
                )}
                
                {slide.type === 'feature_showcase' && (
                  <div className="flex flex-col items-center justify-center h-full text-center w-full max-w-lg mx-auto animate-fade-in-up">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-serif">
                      {slide.title}
                    </h2>
                    <p className="text-base leading-relaxed text-muted-foreground mb-8">
                      {slide.description}
                    </p>
                    <div className="relative w-full max-w-sm rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-2">
                       <Image
                        src="https://placehold.co/600x400.png"
                        alt="CuanFlex Dashboard Preview"
                        width={600}
                        height={400}
                        className="rounded-xl"
                        data-ai-hint="app dashboard finance"
                      />
                    </div>
                  </div>
                )}

                {slide.type === 'cta' && (
                  <div className="text-center relative z-10 animate-fade-in-up">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-tr from-primary via-purple-400 to-accent bg-clip-text text-transparent leading-tight font-serif">
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
