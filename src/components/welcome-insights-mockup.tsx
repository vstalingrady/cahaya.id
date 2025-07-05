
'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Sparkles, Loader2, Check, Info, Send } from "lucide-react";
import { Button } from '@/components/ui/button';

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
                <span className="text-5xl font-bold text-white">{score}</span>
                <span className="text-sm text-muted-foreground">Score</span>
            </div>
        </div>
    );
};


export default function WelcomeInsightsMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
  const [animationState, setAnimationState] = useState<'initial' | 'loading' | 'finished'>('initial');
  const [showChat, setShowChat] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Main animation cycle controller
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
  
    const cycleAnimation = () => {
      // Reset all sub-states
      setAnimationState('initial');
      setShowChat(false);
      setTypedMessage('');
      setIsTyping(false);

      timeouts.push(setTimeout(() => {
        setAnimationState('loading');
        timeouts.push(setTimeout(() => {
          setAnimationState('finished');
          // Wait for results to show before starting chat animation
          timeouts.push(setTimeout(() => setShowChat(true), 2500));
          // Reset the whole cycle after a while
          timeouts.push(setTimeout(cycleAnimation, 12000)); // Total cycle time
        }, 1500)); // Loading duration
      }, 3000)); // Initial button view duration
    };
  
    if (isActive) {
      cycleAnimation();
    } else {
      // Hard reset if component becomes inactive
      setAnimationState('initial');
      setShowChat(false);
      setTypedMessage('');
      setIsTyping(false);
    }
  
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isActive]);

  // Scroll effect for results
  useEffect(() => {
    if (animationState === 'finished' && scrollRef.current) {
        const scroller = scrollRef.current;
        const scrollTimeout = setTimeout(() => {
            if(scroller) {
                scroller.scrollTo({ top: 0, behavior: 'auto' });
                setTimeout(() => scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' }), 100);
            }
        }, 1500);
        return () => clearTimeout(scrollTimeout);
    }
  }, [animationState]);
  
  // Typing animation for chat
  useEffect(() => {
    if (showChat) {
      setIsTyping(true);
      const fullMessage = "How can I invest in an index fund?";
      let index = 0;
      const intervalId = setInterval(() => {
        setTypedMessage(fullMessage.slice(0, index + 1));
        index++;
        if (index >= fullMessage.length) {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, 60); // Typing speed
      
      return () => clearInterval(intervalId);
    }
  }, [showChat]);


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
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold font-serif text-white">Your Personal Financial Analyst</h3>
            <p className="text-muted-foreground mt-2 mb-6">Let our AI analyze your spending patterns to uncover personalized insights and saving opportunities.</p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-xl font-semibold text-lg shadow-lg h-auto animate-slow-pulse">
                <Sparkles className="w-5 h-5 mr-2" />
                <span>Generate My Financial Plan</span>
            </Button>
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
            {/* Scrollable results area */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 -mr-3">
                <div className="text-center p-4 bg-secondary/50 rounded-lg border border-border/50">
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">Your Spender Personality</p>
                    <h3 className="text-2xl font-bold font-serif text-white mt-1">"The Foodie Explorer"</h3>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-secondary/50 rounded-lg border border-border/50 min-h-[220px]">
                     <ScoreCircle score={78} isActive={animationState === 'finished'} />
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-white font-serif">Summary:</h3>
                    <p className="text-muted-foreground text-sm">
                        Your Financial Health Score is a solid 78! You're doing great with savings. As a "Foodie Explorer," your largest spending area is dining out, which presents a great opportunity to save without impacting your lifestyle too much.
                    </p>
                </div>
                
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-white font-serif">Your Action Plan:</h3>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3 bg-secondary/80 p-3 rounded-lg border border-border/50">
                            <div className="w-5 h-5 bg-primary rounded-full flex-shrink-0 mt-1 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                            <span className="text-foreground text-sm">You spent Rp 2.5jt on Food & Drink. Try reducing this by 30% to save Rp 750rb.</span>
                        </li>
                        <li className="flex items-start gap-3 bg-secondary/80 p-3 rounded-lg border border-border/50">
                            <div className="w-5 h-5 bg-primary rounded-full flex-shrink-0 mt-1 flex items-center justify-center"><Info className="w-3 h-3 text-white" /></div>
                            <span className="text-foreground text-sm">With an income of Rp 55jt, you could start investing Rp 5jt/month in a low-cost index fund.</span>
                        </li>
                         <li className="flex items-start gap-3 bg-secondary/80 p-3 rounded-lg border border-border/50">
                            <div className="w-5 h-5 bg-primary rounded-full flex-shrink-0 mt-1 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                            <span className="text-foreground text-sm">Local Deal: Get 50% cashback at Kopi Kenangan when you pay with OVO.</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            {/* Chat input area */}
            <div className={cn("mt-auto pt-3 border-t border-border/50 transition-opacity duration-500", showChat ? 'opacity-100' : 'opacity-0')}>
                <div className="relative h-11 rounded-xl border border-input bg-input/50 px-4 py-2 text-sm text-left flex items-center justify-between">
                    <p className="text-white">
                        {typedMessage}
                        {isTyping && <span className="cursor-blink">|</span>}
                    </p>
                    <Send className="w-5 h-5 text-primary"/>
                </div>
            </div>
        </div>
    </div>
  )
}
