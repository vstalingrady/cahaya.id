import { cn } from "@/lib/utils";

const CuanFlexLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 152 40"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      fill="currentColor"
    >
      <title>CuanFlex Logo</title>
      <path
        d="M20 40C9.664 40 0 31.046 0 20S9.664 0 20 0s20 8.954 20 20c0 7.42-4.267 13.854-10.457 17.261A19.92 19.92 0 0 1 20 40zm0-35C12.268 5 6 11.194 6 20s6.268 15 14 15 14-6.194 14-15c0-5.858-3.32-10.93-8.077-13.33A13.92 13.92 0 0 0 20 5z"
      />
      <path
        d="M56.88 23.868l-3.36 1.94c-3.04 1.756-6.88 1.756-9.92.08L34.24 21.43c-3.12-1.755-4.72-5.356-3.84-8.835l1.6-6.398c.88-3.48 4.08-5.877 7.6-5.877h18.96c3.44 0 6.56 2.238 7.6 5.597l1.68 6.398c.88 3.48-1.04 6.956-4.24 8.795l-7.12 4.678a10.01 10.01 0 0 1-9.6.08zM42.48 9.33c-1.2 0-2.32.959-2.64 2.238L38.24 18c-.32 1.36.16 2.8.96 3.797l2.48 1.438c1.2.718 2.72.718 3.92 0l7.12-4.678c1.2-.72 1.92-2.078 1.6-3.48l-1.68-6.398c-.32-1.28-1.44-2.238-2.72-2.238H42.48z"
      />
      <text x="75" y="28" fontFamily="'PT Sans', sans-serif" fontSize="24" fontWeight="bold">uanFlex</text>
    </svg>
  );
};

export default CuanFlexLogo;
