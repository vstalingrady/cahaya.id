'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { financialInstitutions } from '@/lib/data';
import { cn } from '@/lib/utils';
import InfiniteLogoScroller from './infinite-logo-scroller';

// --- Main Component ---
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
        <>
            {/* Styles that were in <style jsx> are now injected here */}
            <style jsx>{`
                /* The keyframes for the breathing animation were updated to create a more prominent "glow" effect. */
                @keyframes breathing {
                    0%, 100% {
                        transform: scale(1);
                        /* A softer, base glow using a centered box-shadow with blur. */
                        box-shadow: 0 0 20px 0px rgba(249, 115, 22, 0.5); /* orange-500 */
                    }
                    50% {
                        transform: scale(1.05);
                        /* A brighter, more expansive glow at the peak of the animation. */
                        box-shadow: 0 0 30px 5px rgba(249, 115, 22, 0.7);
                    }
                }

                .animate-breathing {
                    animation: breathing 3s ease-in-out infinite;
                }
                .bg-custom-orange {
                    background-color: #F97316; /* Corresponds to orange-500 */
                }
                .hover\\:bg-custom-orange-dark:hover {
                    background-color: #EA580C; /* Corresponds to orange-600 */
                }
                .text-custom-orange {
                     color: #F97316;
                }
                .hover\\:text-custom-orange-dark:hover {
                    color: #EA580C;
                }
            `}</style>

            <section className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-center px-6 pb-6 gap-4 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-sm mx-auto text-center">
                    <div className="min-h-36 flex flex-col items-center justify-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Ready to take control?</h2>
                        <p className="text-gray-600 text-sm mt-2">
                            We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon.
                        </p>
                    </div>

                    <div className="space-y-3 mb-8">
                        <InfiniteLogoScroller institutions={partnersRow1} speed="normal" direction="forward" />
                        <InfiniteLogoScroller institutions={partnersRow2} speed="slow" direction="reverse" />
                        <InfiniteLogoScroller institutions={partnersRow3} speed="slow" direction="forward" />
                    </div>

                    <div className="space-y-4">
                         <Link href="/signup" className="h-12 text-base w-full animate-breathing shadow-lg inline-flex items-center justify-center px-6 py-3 bg-custom-orange hover:bg-custom-orange-dark text-white font-semibold rounded-lg transition-colors duration-300">
                            Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
                         </Link>
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-custom-orange hover:text-custom-orange-dark underline">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center text-gray-400 text-xs pt-8">
                    <p>&copy; {new Date().getFullYear()} Cahaya. All Rights Reserved.</p>
                </div>
            </section>
        </>
    );
}