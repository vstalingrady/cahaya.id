/**
 * @file src/app/page.tsx
 * @fileoverview This is the main welcome and onboarding page for the CuanFlex application.
 * It features a full-screen, scrollable carousel that introduces users to the
 * app's key features before they sign up. This component is client-side rendered
 * due to its interactive nature.
 */

'use client';

// Import necessary React hooks for state management and side effects.
import React, { useState, useEffect, useCallback } from 'react';
// Import Next.js Link component for client-side navigation.
import Link from 'next/link';
// Import the core hook from the Embla Carousel library to power the carousel.
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react';
// Import standard UI components from ShadCN.
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// Import icons from the lucide-react library.
import { ArrowRight, Sparkles } from 'lucide-react';
// Import a utility function for conditional class names.
import { cn } from '@/lib/utils';
// Import the app's logo component.
import CuanLogo from '@/components/icons/cuanlogo';
// Import the custom mockup components used in the feature slides.
import WelcomeDashboardMockup from '@/components/welcome-dashboard-mockup';
import { financialInstitutions } from '@/lib/data';
import Image from 'next/image';
import InfiniteLogoScroller from '@/components/infinite-logo-scroller';
import WelcomePaymentMockup from '@/components/welcome-payment-mockup';
import WelcomeInsightsMockup from '@/components/welcome-insights-mockup';
import WelcomeVaultsMockup from '@/components/welcome-vaults-mockup';
import WelcomeSecurityMockup from '@/components/welcome-security-mockup';
import WelcomeBudgetsMockup from '@/components/welcome-budgets-mockup';

/**
 * An array of slide objects that define the content for the onboarding carousel.
 * Each object contains metadata about the slide and its content, which can be
 * a static JSX element or a function that returns JSX (useful for passing props like `isActive`).
 */
const slides = [
    // Slide 1: Hero section with the main value proposition.
    {
      type: 'hero',
      title: 'All your money,\nin one place.',
      description: 'Welcome to CuanFlex. The secure, unified way to manage your entire financial life from a single, beautiful app.',
      content: (
        <div className="text-center relative z-10">
          <CuanLogo className="w-48 h-auto mx-auto mb-6 animate-logo-blink-glow" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-tr from-primary to-accent bg-clip-text text-transparent leading-tight font-serif whitespace-pre-line drop-shadow-[0_0_5px_hsl(var(--primary)/0.3)]">
            All your money,{'\n'}in one place.
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto my-6 font-light">
            Welcome to CuanFlex. The secure, unified way to manage your entire financial life from a single, beautiful app.
          </p>
        </div>
      )
    },
    // Slide 2: Feature showcase for the unified dashboard.
    {
      type: 'feature_showcase',
      title: 'Connect Everything. See Everything.',
      description: 'BCA, GoPay, OVO, Bibit—all your accounts, in one stunning dashboard. Finally understand your true net worth in real-time.',
      // The content is a function to pass the `isActive` prop, allowing for animations.
      content: (props: { isActive: boolean }) => (
        <div className="flex flex-col items-center justify-center text-center w-full max-w-lg mx-auto py-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            Connect Everything. See Everything.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-6">
            BCA, GoPay, OVO, Bibit—all your accounts, in one stunning dashboard. Finally understand your true net worth in real-time.
          </p>
          <WelcomeDashboardMockup isActive={props.isActive} />
        </div>
      )
    },
    // Slide 3: A "logo wall" to show the breadth of supported institutions.
    {
      type: 'logo_wall',
      title: 'Broad Compatibility',
      description: 'We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon.',
      content: (
        <div className="w-full text-center py-12">
           <div className="max-w-xl mx-auto px-4">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
              Broad Compatibility
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground mb-8">
              We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon.
            </p>
           </div>
          <div className="space-y-4 mt-8">
            <InfiniteLogoScroller 
              institutions={financialInstitutions.slice(0, 10)} 
              direction="reverse" 
              speed="slow" 
            />
            <InfiniteLogoScroller 
              institutions={financialInstitutions.slice(10, 20)} 
              direction="forward" 
              speed="normal" 
            />
            <InfiniteLogoScroller 
              institutions={financialInstitutions.slice(20, 30)} 
              direction="reverse" 
              speed="slow" 
            />
          </div>
        </div>
      )
    },
    // Slide 4: Feature showcase for payments.
    {
      type: 'feature',
      title: 'Pay Any Bill, From Any Source.',
      description: 'Settle your PLN, BPJS, or credit card bills in seconds. Choose which account to pay from on the fly. No more juggling apps or checking balances.',
      content: (props: { isActive: boolean }) => (
        <div className="flex flex-col items-center justify-center text-center w-full max-w-lg mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            Pay Any Bill, From Any Source.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-8">
            Settle your PLN, BPJS, or credit card bills in seconds. Choose which account to pay from on the fly. No more juggling apps or checking balances.
          </p>
          <WelcomePaymentMockup isActive={props.isActive} />
        </div>
      )
    },
    // Slide 5: Feature showcase for budgeting.
    {
      type: 'feature',
      title: 'Track Spending with Smart Budgets.',
      description: "Take control of your spending. Create custom budgets for any category and see at a glance how you're tracking towards your goals.",
      content: (props: { isActive: boolean }) => (
        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            Track Spending with Smart Budgets.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-8">
             Take control of your spending. Create custom budgets for any category and see at a glance how you're tracking towards your goals.
          </p>
          <WelcomeBudgetsMockup isActive={props.isActive} />
        </div>
      )
    },
    // Slide 6: Feature showcase for AI insights.
    {
      type: 'feature',
      title: 'Get Smarter Insights with AI.',
      description: "Unleash the power of Gemini 2.5 Flash Lite, the world's most advanced AI. It analyzes your spending to give you a Financial Health Score, find hidden saving opportunities, and create a personalized action plan.",
      content: (props: { isActive: boolean }) => (
        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            Get Smarter Insights with AI.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-8">
            Unleash the power of{' '}
            <span className="flashy-gemini-text">
                <Sparkles className="w-4 h-4 inline-block -mt-1" /> Gemini 2.5
            </span>
            , one of
            the world's most advanced AI models. It analyzes your spending to give you a
            Financial Health Score, find hidden saving opportunities, and create
            a personalized action plan.
          </p>
          <WelcomeInsightsMockup isActive={props.isActive} />
        </div>
      )
    },
    // Slide 7: Feature showcase for savings vaults.
    {
      type: 'feature',
      title: 'Save Smarter with CuanFlex Vaults.',
      description: 'Create savings goals and fund them from any of your connected accounts. Ring-fence money for a holiday or a new gadget without touching your main spending balance.',
      content: (props: { isActive: boolean }) => (
        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            Save Smarter with CuanFlex Vaults.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-8">
            Create savings goals and fund them from any of your connected accounts. Ring-fence money for a holiday or a new gadget without touching your main spending balance.
          </p>
          <WelcomeVaultsMockup isActive={props.isActive} />
        </div>
      )
    },
    // Slide 8: Feature showcase for security.
    {
      type: 'feature_showcase',
      title: 'Your Security is Our Priority.',
      description: "We use bank-level security, end-to-end encryption, and give you full control over your data. Your trust is our most important asset.",
      content: (
        <div className="flex flex-col items-center justify-center text-center w-full max-w-lg mx-auto py-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            Your Security is Our Priority.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-6">
            We use bank-level security, end-to-end encryption, and give you full control over your data. Your trust is our most important asset.
          </p>
          <WelcomeSecurityMockup />
        </div>
      )
    },
    // Slide 9: Final Call-to-Action (CTA) slide.
    {
      type: 'cta',
      title: 'Ready to take control?',
      description: "Join CuanFlex today and experience a smarter way to manage your money. It's free, secure, and takes minutes to get started.",
      content: (
        <div className="text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-tr from-primary to-accent bg-clip-text text-transparent leading-tight font-serif drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]">
            Ready to take control?
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto my-6 font-light">
            Join CuanFlex today and experience a smarter way to manage your money. It's free, secure, and takes minutes to get started.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-64 h-14 text-lg animate-slow-pulse">
              <Link href="/signup">
                Create Free Account <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      )
    }
  ];

/**
 * The main component for the welcome page.
 * It manages the state and rendering of the onboarding carousel.
 */
export default function WelcomePage() {
  // Initialize the Embla Carousel. `emblaRef` is attached to the carousel container.
  // `emblaApi` is the imperative API to control the carousel.
  // We disable looping so the user progresses linearly through the onboarding.
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  // State to keep track of the currently selected slide index.
  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * A memoized callback function that updates the `currentSlide` state
   * whenever the user scrolls to a new slide in the carousel.
   * This is wrapped in `useCallback` for performance, preventing re-creation on every render.
   */
  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    // Ensure the API is available before using it.
    if (!emblaApi) return;
    // Get the selected slide index from the API and update our state.
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, []);

  /**
   * A side effect hook that runs after the component mounts.
   * It subscribes to the Embla Carousel's 'select' and 'reInit' events.
   * This ensures our `onSelect` callback is fired whenever the slide changes.
   * The cleanup function (`return () => ...`) unsubscribes from the events
   * when the component unmounts to prevent memory leaks.
   */
  useEffect(() => {
    // Ensure the API is available before subscribing.
    if (!emblaApi) return;
    // Run the `onSelect` callback initially to set the first slide.
    onSelect(emblaApi);
    // Subscribe to events.
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    // Cleanup function to run on unmount.
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // The main render output for the component.
  return (
    // The main container, occupying the full screen with a relative position
    // to contain the absolutely positioned dot indicators.
    <div className="w-full h-screen bg-background text-foreground overflow-hidden relative has-hero-glow">
      
      {/* The Embla Carousel container. `emblaRef` is attached here. */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        {/* This inner container holds all the slides and moves horizontally. */}
        <div className="flex h-full">
            {/* Map over the `slides` array to render each slide dynamically. */}
            {slides.map((slide, index) => (
                // Each slide container. `flex-[0_0_100%]` makes each slide take up the full viewport width.
                <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                    {/* This div centers the content and makes it scrollable on smaller screens. */}
                    <div className="h-full overflow-y-auto flex items-center justify-center p-6 custom-scrollbar">
                        <div className={cn(
                            // This wrapper controls the fade-in animation for each slide.
                            // The animation only runs if the slide's index matches the current active slide.
                            index === currentSlide ? 'animate-fade-in-up' : 'opacity-0'
                        )}>
                            {/* Render the slide's content. If it's a function, call it with props.
                                This allows passing the `isActive` state to the slide content for more complex animations. */}
                            {typeof slide.content === 'function' ? slide.content({ isActive: index === currentSlide }) : slide.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* This container holds the carousel navigation dots. It's positioned absolutely at the bottom. */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center gap-4">
        <div className="flex gap-2">
          {/* Map over the slides array again to create a navigation dot for each slide. */}
          {slides.map((_, index) => (
            <button 
              key={index} 
              // When a dot is clicked, use the Embla API to scroll to the corresponding slide.
              onClick={() => emblaApi?.scrollTo(index)}
              // Apply conditional styling: the active dot is wider and has the primary color.
              className={cn(`w-2 h-2 rounded-full transition-all duration-300`,
                index === currentSlide ? "bg-primary w-6" : "bg-muted hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
