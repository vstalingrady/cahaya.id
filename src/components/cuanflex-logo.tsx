import { cn } from "@/lib/utils";

const CuanLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto", className)}
      aria-labelledby="cuan-logo-title"
    >
      <defs>
        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <title id="cuan-logo-title">Cuan Logo</title>
      <path
        d="M84.2,36.9c-3.2-12.7-10.9-22.7-21.7-28.7C51.6,2.2,39.3,1.3,27.8,6.8c-11.5,5.5-20,16.2-23.7,28.4C-0.3,47.8,1.2,61.1,7.8,71.5c6.6,10.4,17.4,17.2,29.3,18.4c11.9,1.2,23.9-3.1,32.8-12.1c8.9-8.9,13.2-20.9,12.1-32.8C81.4,42.5,79.1,39.5,84.2,36.9z M48.1,73.1c-6.6,6.6-17.4,6.6-24,0c-6.6-6.6-6.6-17.4,0-24c6.6-6.6,17.4-6.6,24,0C54.7,55.7,54.7,66.5,48.1,73.1z"
        fill="url(#icon-gradient)"
      />
    </svg>
  );
};

export default CuanLogo;
