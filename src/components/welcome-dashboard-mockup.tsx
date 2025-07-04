import { cn } from "@/lib/utils"

export default function WelcomeDashboardMockup({ className }: { className?: string }) {
  // This component is intentionally left blank to avoid layout issues.
  return (
    <div className={cn("relative w-full max-w-sm rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-2", className)}>
        <div className="aspect-video w-full h-auto rounded-xl bg-secondary animate-pulse" />
    </div>
  )
}
