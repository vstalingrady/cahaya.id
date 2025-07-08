
'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Sparkles, Loader2, Check, Info, Send } from "lucide-react";
import { Button } from '@/components/ui/button';
import GeminiLogo from '@/components/icons/GeminiLogo';

const ScoreCircle = ({ score, isActive }: { score: number, isActive: boolean }) => {
    const circumference = 2 * Math.PI * 20; // radius is 20
    const strokeDashoffset = isActive ? circumference - (score / 100) * circumference : circumference;
    const scoreColor = score > 75 ? 'text-primary' : score > 40 ? 'text-yellow-400' : 'text-destructive';

    return (
        <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 44 44">
                <circle
                    className="stroke-current text-secondary"
                    strokeWidth="3"
                    cx="22"
                    cy="22"
                    r="20"
                    fill="transparent"
                />
                <circle
                    className={cn("stroke-current transition-all duration-[2s] ease-out", scoreColor)}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeWidth="3"
                    strokeLinecap="round"
                    cx="22"
                    cy="22"
                    r="20"
                    fill="transparent"
                    transform="rotate(-90 22 22)"
                />
            </svg>
            <div className={cn("absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500", isActive ? 'opacity-100' : 'opacity-0')}>
                <span className="text-5xl font-bold text-foreground">{score}</span>
                <span className="text-sm text-muted-foreground">Score</span>
            </div>
        </div>
    );
};


export default function WelcomeInsightsMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
  const [animationState, setAnimationState] = useState<'initial' | 'loading' | 'finished'>('initial');
  const [showUserPrompt, setShowUserPrompt] = useState(false);
  const [typedUserMessage, setTypedUserMessage] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [showAiTyping, setShowAiTyping] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [typedAiResponse, setTypedAiResponse] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Main animation cycle controller
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
  
    const cycleAnimation = () => {
      // Hard reset for all states
      setAnimationState('initial');
      setShowUserPrompt(false);
      setTypedUserMessage('');
      setIsUserTyping(false);
      setShowAiTyping(false);
      setShowAiResponse(false);
      setTypedAiResponse('');

      timeouts.push(setTimeout(() => {
        setAnimationState('loading');
        timeouts.push(setTimeout(() => {
          setAnimationState('finished');
          // Wait for results to show before starting chat animation
          timeouts.push(setTimeout(() => setShowUserPrompt(true), 1000));
          // Reset the whole cycle after a while
          timeouts.push(setTimeout(cycleAnimation, 10000)); // Total cycle time
        }, 500)); // Loading duration
      }, 1500)); // Initial button view duration
    };
  
    if (isActive) {
      cycleAnimation();
    } else {
      // Hard reset if component becomes inactive
      setAnimationState('initial');
      setShowUserPrompt(false);
      setTypedUserMessage('');
      setIsUserTyping(false);
      setShowAiTyping(false);
      setShowAiResponse(false);
      setTypedAiResponse('');
    }
  
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isActive]);
  
  // Typing animation for user prompt
  useEffect(() => {
    if (showUserPrompt) {
      setIsUserTyping(true);
      const fullMessage = "How can I invest in an index fund?";
      let index = 0;
      const intervalId = setInterval(() => {
        setTypedUserMessage(fullMessage.slice(0, index + 1));
        index++;
        if (index >= fullMessage.length) {
          clearInterval(intervalId);
          setIsUserTyping(false);
          // Trigger AI typing indicator after user is done
          setTimeout(() => {
              setShowAiTyping(true);
              setTimeout(() => {
                  setShowAiTyping(false);
                  setShowAiResponse(true);
              }, 800); // AI "thinks"
          }, 500);
        }
      }, 40); // Faster user typing speed
      
      return () => clearInterval(intervalId);
    }
  }, [showUserPrompt]);

  // Typing animation for AI response (word by word)
  useEffect(() => {
    if (showAiResponse) {
      const fullMessage = "Great question, Budi! You can start with a low-cost index fund ETF like 'BBCA' through a stockbroker app. It's a simple way to diversify.";
      const words = fullMessage.split(' ');
      let wordIndex = 0;
      const intervalId = setInterval(() => {
        if (wordIndex < words.length) {
            setTypedAiResponse(words.slice(0, wordIndex + 1).join(' '));
            wordIndex++;
        } else {
            clearInterval(intervalId);
        }
      }, 80); // Speed for word-by-word typing

      return () => clearInterval(intervalId);
    }
  }, [showAiResponse]);

  // Scroll to bottom when chat updates
  useEffect(() => {
    if (scrollRef.current && (showUserPrompt || showAiResponse)) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [typedUserMessage, typedAiResponse, showUserPrompt, showAiResponse]);


  return (
    <div className={cn(
        "relative w-full max-w-sm h-[550px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col gap-4",
        className
    )}>
        {/* Initial State: Button */}
        <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center text-center p-6 transition-all duration-500",
            animationState === 'initial' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}>
            <div className="flex items-center justify-center gap-2 mb-2">
                <GeminiLogo size={24} />
                <p className="flashy-gemini-text text-lg">Powered by Gemini</p>
            </div>
            <h3 className="text-xl font-bold font-serif text-foreground">Your Personal Financial Analyst</h3>
            <p className="text-muted-foreground mt-2 mb-6">Let Gemini build your personalized financial plan, find saving opportunities, and answer your toughest money questions.</p>
            <div className="rounded-xl">
              <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-xl font-semibold text-lg shadow-lg h-auto">
                  <Sparkles className="w-5 h-5 mr-2" />
                  <span>Generate My Financial Plan</span>
              </Button>
            </div>
        </div>

        {/* Loading State */}
        <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
            animationState === 'loading' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}>
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>

        {/* Finished State: Insights + Chat */}
        <div className={cn(
            "w-full h-full flex flex-col gap-4 transition-opacity duration-500",
            animationState === 'finished' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}>
            {/* Scrollable container for results and chat */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 -mr-3">
                <div className="text-center p-4 bg-secondary/50 rounded-lg border border-border/50">
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">Your Spender Personality</p>
                    <h3 className="text-2xl font-bold font-serif text-foreground mt-1">"The Foodie Explorer"</h3>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-secondary/50 rounded-lg border border-border/50 min-h-[220px]">
                     <ScoreCircle score={78} isActive={animationState === 'finished'} />
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-foreground font-serif">Summary:</h3>
                    <p className="text-muted-foreground text-sm">
                        Your Financial Health Score is a solid 78! You're doing great with savings. As a "Foodie Explorer," your largest spending area is dining out, which presents a great opportunity to save without impacting your lifestyle too much.
                    </p>
                </div>
                
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-foreground font-serif">Your Action Plan:</h3>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3 bg-secondary/80 p-3 rounded-lg border border-border/50">
                            <div className="w-5 h-5 bg-primary rounded-full flex-shrink-0 mt-1 flex items-center justify-center"><Check className="w-3 h-3 text-primary-foreground" /></div>
                            <span className="text-foreground text-sm">You spent Rp 2.5jt on Food & Drink. Try reducing this by 30% to save Rp 750rb.</span>
                        </li>
                        <li className="flex items-start gap-3 bg-secondary/80 p-3 rounded-lg border border-border/50">
                            <div className="w-5 h-5 bg-primary rounded-full flex-shrink-0 mt-1 flex items-center justify-center"><Info className="w-3 h-3 text-primary-foreground" /></div>
                            <span className="text-foreground text-sm">With an income of Rp 55jt, you could start investing Rp 5jt/month in a low-cost index fund.</span>
                        </li>
                         <li className="flex items-start gap-3 bg-secondary/80 p-3 rounded-lg border border-border/50">
                            <div className="w-5 h-5 bg-primary rounded-full flex-shrink-0 mt-1 flex items-center justify-center"><Check className="w-3 h-3 text-primary-foreground" /></div>
                            <span className="text-foreground text-sm">Local Deal: Get 50% cashback at Kopi Kenangan when you pay with OVO.</span>
                        </li>
                    </ul>
                </div>
                
                {/* Chat interaction area (now inside scrollable div) */}
                <div className={cn("pt-4 border-t border-border/50 transition-opacity duration-500 space-y-2", showUserPrompt ? 'opacity-100' : 'opacity-0')}>
                    {/* User Prompt */}
                    <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm max-w-[80%]">
                            {typedUserMessage}
                            {isUserTyping && <span className="cursor-blink">|</span>}
                        </div>
                    </div>

                    {/* AI Typing Indicator */}
                    {showAiTyping && (
                        <div className="flex justify-start">
                             <div className="bg-secondary text-foreground rounded-lg px-3 py-2 text-sm">
                                <Loader2 className="w-4 h-4 animate-spin" />
                             </div>
                        </div>
                    )}
                    
                    {/* AI Response */}
                    {showAiResponse && (
                         <div className="flex justify-start">
                             <div className="bg-secondary text-foreground rounded-lg px-3 py-2 text-sm max-w-[80%] whitespace-pre-wrap">
                               {typedAiResponse}
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}
