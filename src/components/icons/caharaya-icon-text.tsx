import { cn } from "@/lib/utils";

const CaharayaIconText = ({ className }: { className?: string }) => (
  <svg
    width="120"
    height="40"
    viewBox="0 0 120 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
  >
    <use href="/caharayaicontext.svg#caharaya-icon-text" />
  </svg>
);

export default CaharayaIconText;