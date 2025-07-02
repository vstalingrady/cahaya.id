'use client';

import React, { useMemo } from 'react';
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
import { ArrowRight, Landmark } from 'lucide-react';
import EwalletIcon from '@/components/icons/ewallet-icon';
import { accounts as initialAccounts, transactions, type Account } from '@/lib/data';
import TotalBalance from '@/components/dashboard/total-balance';
import AccountCard from '@/components/dashboard/account-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const FeatureShowcase = () => {
    const { netWorth, accountGroups } = useMemo(() => {
        const accountList = initialAccounts;
        const totalAssets = accountList
            .filter(acc => acc.type !== 'loan')
            .reduce((sum, acc) => sum + acc.balance, 0);
        
        const totalLiabilities = accountList
            .filter(acc => acc.type === 'loan')
            .reduce((sum, acc) => sum + acc.balance, 0);
            
        const netWorth = totalAssets - totalLiabilities;

        const accountGroups = {
            bank: accountList.filter(a => a.type === 'bank'),
            'e-wallet': accountList.filter(a => a.type === 'e-wallet'),
        };

        return { netWorth, accountGroups };
    }, []);

  return (
    <div className="bg-card/50 p-2 md:p-4 rounded-3xl border shadow-lg shadow-primary/10 border-border/50 backdrop-blur-sm overflow-hidden">
        <div className="w-[420px] h-[750px] md:w-full md:h-full transform scale-[0.8] md:scale-100 origin-top-left pointer-events-none select-none">
            <div className="space-y-6 p-6">
                <header>
                    <h1 className="text-3xl font-bold text-white font-serif">
                        Good morning, Vstalin
                    </h1>
                </header>

                <TotalBalance title="Total Net Worth" amount={netWorth} transactions={transactions} showHistoryLink={false} />

                <div>
                    <h2 className="text-xl font-semibold text-white font-serif">Your Accounts</h2>
                    <Accordion type="multiple" defaultValue={['bank', 'e-wallet']} className="w-full space-y-2 mt-4">
                        {accountGroups.bank.length > 0 && (
                            <AccordionItem value="bank" className="bg-card/80 backdrop-blur-xl rounded-2xl border-none shadow-lg shadow-primary/10 px-5">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className='flex items-center gap-3'>
                                        <Landmark className='w-5 h-5 text-primary/80' />
                                        <span className='font-semibold text-white'>Banks</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 space-y-2">
                                    {accountGroups.bank.map(account => (
                                        <AccountCard key={account.id} account={account} />
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {accountGroups['e-wallet'].length > 0 && (
                            <AccordionItem value="e-wallet" className="bg-card/80 backdrop-blur-xl rounded-2xl border-none shadow-lg shadow-primary/10 px-5">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className='flex items-center gap-3'>
                                        <EwalletIcon className='w-5 h-5 text-primary/80' />
                                        <span className='font-semibold text-white'>E-Wallets</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 space-y-2">
                                    {accountGroups['e-wallet'].map(account => (
                                        <AccountCard key={account.id} account={account} />
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                </div>
            </div>
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
      title: 'Connect Everything. See Everything.',
      description: 'BCA, GoPay, OVO, Bibit—all your accounts, in one stunning dashboard. Finally understand your true net worth in real-time.',
      customComponent: <FeatureShowcase />,
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
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
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
                      {slide.customComponent ? slide.customComponent : (
                        <div className="bg-card/50 p-4 rounded-3xl border shadow-lg shadow-primary/10 border-border/50 backdrop-blur-sm">
                          <Image 
                              src={slide.imgSrc!}
                              alt={slide.title!}
                              width={800}
                              height={600}
                              data-ai-hint={slide.imgHint!}
                              className="rounded-2xl shadow-lg"
                            />
                        </div>
                      )}
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
