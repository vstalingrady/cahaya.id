import { cn } from "@/lib/utils";

const QrisLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 65 20"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto", className)}
      fill="currentColor"
    >
        <title>QRIS Logo</title>
        {/* Simplified and robust rendering of "QRIS" text */}
        <text
            x="0"
            y="15"
            fontFamily="sans-serif"
            fontSize="18"
            fontWeight="bold"
            letterSpacing="-0.5"
            fill="currentColor"
        >
            QRIS
        </text>
    </svg>
  );
};

export default QrisLogo;
