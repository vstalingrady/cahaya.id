import { cn } from "@/lib/utils";

const CuanLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 124 40"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <title>Cuan Logo</title>
      <path
        d="M26.79 0C11.99 0 0 12 0 26.79v6.42C0 37.53 2.47 40 5.6 40h6.42C26.79 40 40 26.79 40 13.21v-6.42C40 2.47 37.53 0 34.39 0H26.79zM13.21 32.7c-3.13 0-5.69-2.56-5.69-5.69v-5.69c0-3.13 2.56-5.69 5.69-5.69h13.58c3.13 0 5.69 2.56 5.69 5.69v5.69c0 3.13-2.56 5.69-5.69 5.69H13.21z"
        className="fill-primary"
      />
      <text
        x="48"
        y="30"
        fontFamily="inherit"
        fontSize="28"
        fontWeight="bold"
        className="fill-foreground"
      >
        cuan
      </text>
    </svg>
  );
};

export default CuanLogo;
