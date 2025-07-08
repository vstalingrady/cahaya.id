
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import InfiniteLogoScroller from '@/components/infinite-logo-scroller';
import { financialInstitutions } from '@/lib/data';

export default function WelcomeSignupSlide() {
    const partnersRow1 = financialInstitutions
        .filter(f => f.type === 'bank' && ['bca', 'mandiri', 'bri', 'bni', 'cimb'].includes(f.slug))
        .map(f => ({ name: f.name, logo: <Image src={f.logoUrl} alt={f.name} width={90} height={36} className="h-9 w-auto object-contain" data-ai-hint={`${f.name} logo`} /> }));

    const partnersRow2 = financialInstitutions
        .filter(f => ['gopay', 'ovo', 'dana', 'shopeepay', 'linkaja'].includes(f.slug))
        .map(f => ({ name: f.name, logo: <Image src={f.logoUrl} alt={f.name} width={90} height={36} className="h-9 w-auto object-contain" data-ai-hint={`${f.name} logo`} /> }));

    const partnersRow3 = financialInstitutions
        .filter(f => ['bibit', 'pintu', 'jenius', 'dbs', 'ocbc'].includes(f.slug))
        .map(f => ({ name: f.name, logo: <Image src={f.logoUrl} alt={f.name} width={90} height={36} className="h-9 w-auto object-contain" data-ai-hint={`${f.name} logo`} /> }));

    return (
        <section className="flex-[0_0_100%] min-w-0 flex flex-col">
            <div className="flex-1 flex flex-col justify-center px-6 pb-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-6 animate-fade-in-up max-w-sm mx-auto text-center">
                    <div className="min-h-36 flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-bold font-serif text-foreground">Ready to take control?</h2>
                        <p className="text-muted-foreground text-sm mt-2">
                            We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <InfiniteLogoScroller institutions={partnersRow1} speed="normal" direction="forward" />
                        <InfiniteLogoScroller institutions={partnersRow2} speed="slow" direction="reverse" />
                        <InfiniteLogoScroller institutions={partnersRow3} speed="fast" direction="forward" />
                    </div>

                    <div className="pt-6 space-y-4">
                         <Link href="/signup" className="h-12 text-base w-full animate-breathing shadow-lg inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors duration-300">
                            Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
                         </Link>
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:text-primary/90 underline">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0 text-center text-muted-foreground text-xs pt-4">
                <p>&copy; {new Date().getFullYear()} Cahaya. All Rights Reserved.</p>
            </div>
            <style jsx>{`
                @keyframes breathing {
                  0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.7); /* Match --primary HSL */
                  }
                  50% {
                    transform: scale(1.05);
                    box-shadow: 0 0 25px 12px rgba(255, 140, 0, 0);
                  }
                }
                .animate-breathing {
                  animation: breathing 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
