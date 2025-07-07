import { cn } from "@/lib/utils";

const CahayaLogo = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 140 26"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <defs>
        <linearGradient id="cahaya-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 'bold' }}
        fill="url(#cahaya-gradient)"
      >
        Cahaya
      </text>
    </svg>
);

export default CahayaLogo;
