import { cn } from "@/lib/utils";
import { ArrowLeftRight, Home, PieChart, PiggyBank, ClipboardList } from "lucide-react";

export default function WelcomeDashboardMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto border-neutral-800 bg-neutral-900 border-[8px] rounded-t-[2.5rem] h-[600px] w-[300px] shadow-2xl shadow-primary/20", className)}>
      <div className="w-[120px] h-[18px] bg-neutral-900 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
      <div className="rounded-t-[2rem] w-full h-full overflow-hidden bg-background">
        <div className="p-4 text-white flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-bold font-serif">
                Good morning,
              </h1>
              <h1 className="text-xl font-bold font-serif -mt-1">
                Vstalin
              </h1>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary/20"></div>
          </div>

          {/* Balance Card */}
          <div className="bg-card/80 p-4 rounded-xl border border-border/50">
            <h2 className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Total Net Worth</h2>
            <p className="text-2xl font-bold text-white mt-1">Rp 281.078.502</p>
            {/* Static SVG Graph */}
            <div className="h-24 mt-2">
               <svg width="100%" height="100%" viewBox="0 0 260 96" preserveAspectRatio="none">
                 <defs>
                    <linearGradient id="mockupGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                    </linearGradient>
                     <linearGradient id="mockupStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                <path d="M0,70 Q 30,20 60,50 T 120,60 T 180,30 T 260, 40" stroke="url(#mockupStroke)" fill="url(#mockupGradient)" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* Bottom Nav */}
          <div className="bg-background/70 backdrop-blur-sm -mx-4 -mb-4 border-t border-border mt-4">
             <div className="flex justify-around items-center h-16">
                <div className="flex flex-col items-center gap-1 text-primary">
                    <Home className="w-5 h-5" />
                    <span className="text-xs font-semibold">Home</span>
                    <div className="w-6 h-0.5 bg-primary rounded-full mt-0.5"></div>
                </div>
                 <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <ArrowLeftRight className="w-5 h-5" />
                    <span className="text-xs font-semibold">Pay</span>
                </div>
                 <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <ClipboardList className="w-5 h-5" />
                    <span className="text-xs font-semibold">Budgets</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <PieChart className="w-5 h-5" />
                    <span className="text-xs font-semibold">Insights</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <PiggyBank className="w-5 h-5" />
                    <span className="text-xs font-semibold">Vaults</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
