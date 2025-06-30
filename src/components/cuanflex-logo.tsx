import { cn } from "@/lib/utils";

const CuanLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 110 30"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <title>Cuan Logo</title>
      <text
        x="0"
        y="25"
        fontFamily="'PT Sans', sans-serif"
        fontSize="30"
        fontWeight="bold"
        letterSpacing="-1.5"
        className="fill-foreground"
      >
        cuan
      </text>
      <circle cx="100" cy="15" r="5" className="fill-primary" />
    </svg>
  );
};

export default CuanLogo;
