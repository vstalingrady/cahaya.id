
import { cn } from "@/lib/utils"
import DashboardMockup from "./dashboard/dashboard-mockup";

export default function WelcomeDashboardMockup({ className }: { className?: string }) {
  return (
    <div className={cn(
        "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-0 backdrop-blur-sm overflow-hidden",
        className
    )}>
        <DashboardMockup />
    </div>
  )
}
