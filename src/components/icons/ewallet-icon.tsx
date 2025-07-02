import { cn } from "@/lib/utils";
import React from "react";

const EwalletIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
    {...props}
  >
    <path
      d="M19 6.5C19 4.3735 16.5265 2.5 13 2.5C9.4735 2.5 7 4.3735 7 6.5C7 8.6265 9.4735 10.5 13 10.5C16.5265 10.5 19 8.6265 19 6.5Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 11.5C5 9.3735 8.13401 7.5 12 7.5C15.866 7.5 19 9.3735 19 11.5V17.5C19 19.6265 15.866 21.5 12 21.5C8.13401 21.5 5 19.6265 5 17.5V11.5Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EwalletIcon;
