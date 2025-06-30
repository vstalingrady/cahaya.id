import { cn } from "@/lib/utils";

const BankIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
  >
    <path
      d="M4 22H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 19.1429C5 18.2567 5.28905 17.394 5.81775 16.6853C7.54012 14.3642 10.5186 10.5 12 10.5C13.4814 10.5 16.4599 14.3642 18.1822 16.6853C18.711 17.394 19 18.2567 19 19.1429V20H5V19.1429Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 10.5C10.5186 10.5 7.54012 6.63583 5.81775 4.3147C5.28905 3.60601 5 2.74332 5 1.85714V1H19V1.85714C19 2.74332 18.711 3.60601 18.1822 4.3147C16.4599 6.63583 13.4814 10.5 12 10.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BankIcon;
