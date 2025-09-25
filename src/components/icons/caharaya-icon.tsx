import { cn } from "@/lib/utils";

const CaharayaIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
  >
    <use href="/caharayaicon.svg#caharaya-icon" />
  </svg>
);

export default CaharayaIcon;