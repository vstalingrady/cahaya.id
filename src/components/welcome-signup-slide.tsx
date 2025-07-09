
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { financialInstitutions } from '@/lib/data';
import InfiniteLogoScroller from './infinite-logo-scroller';
import { Button } from './ui/button';

// --- Main Component ---
export default function WelcomeSignupSlide({ onSignUp, isSigningUp }: { onSignUp?: () => void; isSigningUp?: boolean }) {
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
        <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-center px-6 pb-6 gap-4 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-sm mx-auto text-center">
                <div className="min-h-[180px] flex flex-col items-center justify-center mb-6">
                    <h2 className="text-3xl font-bold font-serif text-primary animate-text-glow">Ready to take control?</h2>
                    <p className="text-muted-foreground text-sm mt-2">
                        We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon.
                    </p>
                </div>

                <div className="space-y-3 mb-8">
                    <InfiniteLogoScroller institutions={partnersRow1} speed="slow" direction="forward" />
                    <InfiniteLogoScroller institutions={partnersRow2} speed="slow" direction="reverse" />
                    <InfiniteLogoScroller institutions={partnersRow3} speed="slow" direction="forward" />
                </div>

                <div className="space-y-4">
                    <div className="animate-slow-pulse rounded-lg">
                        <Button asChild size="lg" className="w-full h-12 text-lg">
                            <Link href="/signup">
                                Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Button asChild variant="link" className="p-0 h-auto">
                            <Link href="/login" className="font-semibold underline">
                                Log In
                            </Link>
                        </Button>
                    </p>
                </div>
            </div>

            <div className="text-center text-muted-foreground text-xs pt-8">
                <p>&copy; {new Date().getFullYear()} Semua. All Rights Reserved.</p>
            </div>
        </section>
    );
}
