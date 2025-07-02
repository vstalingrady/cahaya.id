'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import NoiseOverlay from '@/components/noise-overlay';

export default function TermsOfServicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const mainElement = document.querySelector('main');

    const handleScroll = () => {
      if (mainElement) {
         // Check if user is near the bottom
        if (mainElement.scrollTop + mainElement.clientHeight >= mainElement.scrollHeight - 50) {
          setIsAtBottom(true);
          mainElement.removeEventListener('scroll', handleScroll);
        }
      }
    };

    if (mainElement) {
        mainElement.addEventListener('scroll', handleScroll);
        // Initial check in case content is not scrollable
        handleScroll();
    }
    
    return () => {
        if(mainElement) {
            mainElement.removeEventListener('scroll', handleScroll);
        }
    };
  }, []);

  const handleContinue = async () => {
    setIsSubmitting(true);
    const signupDataString = sessionStorage.getItem('signupData');
    if (!signupDataString) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Sign up data not found. Please start over.',
      });
      router.push('/signup');
      return;
    }
    
    // Simulate account creation
    console.log("Creating account with data:", JSON.parse(signupDataString));
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    sessionStorage.removeItem('signupData');

    toast({
      title: 'Profile Created!',
      description: "Now let's secure your account.",
    });

    router.push('/setup-security');
  };

  const loremIpsumParagraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nisl augue, tincidunt eget ex sit amet, ultrices pellentesque sapien. In hac habitasse platea dictumst. Praesent et eros sit amet massa vehicula pulvinar. Vivamus nec quam ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed et arcu sed justo blandit efficitur. Integer quis ligula nec justo cursus sodales. Nam non ex sit amet enim semper mollis. Sed non enim viverra, efficitur tellus sed, dapibus massa. Donec sit amet quam sit amet lorem aliquam auctor. Nullam ac orci at quam rhoncus semper. Quisque sed massa quis arcu facilisis blandit."

  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 min-h-screen flex flex-col relative overflow-hidden">
        <NoiseOverlay />
       <header className="text-center mb-8 pt-8 z-10">
        <h1 className="text-3xl font-bold mb-2 text-primary font-serif">Terms of Service</h1>
        <p className="text-muted-foreground">Please read carefully before proceeding.</p>
       </header>
       <main className="flex-grow overflow-y-auto space-y-4 text-muted-foreground pr-2 custom-scrollbar z-10">
          <p>{loremIpsumParagraph}</p>
          <p>Phasellus ut ante sit amet ipsum faucibus pretium. In eu elit at enim pulvinar finibus. Aliquam erat volutpat. Fusce quis turpis vitae arcu varius tincidunt. Curabitur scelerisque quam nec ante hendrerit, id varius mauris interdum. Sed feugiat, magna sed vestibulum commodo, elit quam consequat tortor, ut efficitur nisi eros et magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris et mauris vel est consequat scelerisque.</p>
          <h2 className="text-xl font-semibold text-foreground pt-4">1. Acceptance of Terms</h2>
          <p>{loremIpsumParagraph}</p>
          <h2 className="text-xl font-semibold text-foreground pt-4">2. Description of Service</h2>
          <p>{loremIpsumParagraph}</p>
          <p>{loremIpsumParagraph}</p>
          <h2 className="text-xl font-semibold text-foreground pt-4">3. Your Responsibilities</h2>
          <p>{loremIpsumParagraph}</p>
          <h2 className="text-xl font-semibold text-foreground pt-4">4. Privacy Policy</h2>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. {loremIpsumParagraph}</p>
           <h2 className="text-xl font-semibold text-foreground pt-4">5. Disclaimers and Limitation of Liability</h2>
          <p>{loremIpsumParagraph}</p>
          <p>{loremIpsumParagraph}</p>
       </main>
       <footer className="py-6 sticky bottom-0 bg-background/80 backdrop-blur-sm -mx-6 px-6 -mb-6 border-t border-border z-20">
        <Button
          onClick={handleContinue}
          disabled={!isAtBottom || isSubmitting}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto disabled:shadow-none"
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'I Agree & Create Account'}
        </Button>
        {!isAtBottom && <p className="text-center text-xs text-muted-foreground mt-2">Please scroll to the bottom to continue.</p>}
       </footer>
    </div>
  );
}
