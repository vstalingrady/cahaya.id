
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const ScoreCircle = ({ score }: { score: number }) => {
    const circumference = 2 * Math.PI * 15.9155; // 2 * pi * r
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const scoreColor = score > 75 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-destructive';

    return (
        <div className="relative w-24 h-24">
             <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                    className="stroke-current text-secondary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                />
                <path
                    className={cn("stroke-current transition-all duration-1000 ease-in-out", scoreColor)}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{score}</span>
            </div>
        </div>
    );
};


export default function WelcomeInsightsMockup({ className }: { className?: string }) {
  return (
    <div className={cn(
        "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col gap-4",
        className
    )}>
        <div className="bg-secondary/50 rounded-xl p-4 border border-border/50 text-center">
            <h3 className="font-bold font-serif text-white text-lg">Your Spender Personality</h3>
            <p className="text-primary font-semibold">"The Weekend Warrior"</p>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 border border-border/50 text-center flex-1 flex flex-col items-center justify-center">
             <h3 className="text-sm font-semibold text-muted-foreground mb-2">Financial Health Score</h3>
             <ScoreCircle score={78} />
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"><Sparkles className="text-primary w-4 h-4" /> AI Action Plan</h3>
            <div className="space-y-2 text-sm">
                <p className="bg-background/40 p-2 rounded-md text-foreground">Cut your 'Food & Drink' spending by 20% to save Rp 1.5M.</p>
                <p className="bg-background/40 p-2 rounded-md text-foreground">Your shopping is high. Try using local deals to save more.</p>
            </div>
        </div>
    </div>
  )
}
