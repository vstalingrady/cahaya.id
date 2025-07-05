
import { cn } from "@/lib/utils"

export default function WelcomeDashboardMockup({ className }: { className?: string }) {
  return (
    <div className={cn(
        "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-0 backdrop-blur-sm overflow-hidden",
        className
    )}>
        <iframe
            src="/dashboard-mockup"
            title="Cuan Dashboard Mockup"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
        />
    </div>
  )
}
