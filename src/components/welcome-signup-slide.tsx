
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
        <div className="w-full h-full flex flex-col items-center justify-start gap-3 pt-2 pb-4">
            <div className="w-full max-w-sm mx-auto text-center space-y-5">
                <div className="text-center max-w-sm mx-auto flex-shrink-0">
                    <div className="w-8 h-8 mx-auto mb-2">
                        <ArrowRight className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold font-serif mb-2 text-foreground">Ready to get started?</h2>
                    <p className="text-muted-foreground text-sm">We support all major banks and e-wallets in Indonesia.</p>
                </div>

                <div className="space-y-2">
                    <InfiniteLogoScroller institutions={partnersRow1} speed="slow" direction="forward" />
                    <InfiniteLogoScroller institutions={partnersRow2} speed="slow" direction="reverse" />
                    <InfiniteLogoScroller institutions={partnersRow3} speed="slow" direction="forward" />
                </div>

                <div className="space-y-3">
                    <div className="animate-slow-pulse rounded-lg">
                        <Button asChild size="lg" className="w-full h-11 text-base">
                            <Link href="/signup">
                                Get Started for Free <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Already have an account?{' '}
                        <Button asChild variant="link" className="p-0 h-auto text-xs">
                            <Link href="/login" className="font-semibold underline">
                                Log In
                            </Link>
                        </Button>
                    </p>
                </div>
            </div>

            <div className="text-center text-muted-foreground text-xs pt-2">
                <p>&copy; {new Date().getFullYear()} Cahaya. All Rights Reserved.</p>
            </div>
        </div>
    );
}
