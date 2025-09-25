import { cn } from "@/lib/utils";

const CaharayaWebIcon = ({ className }: { className?: string }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
  >
    <use href="/cahayawebicon.svg#caharaya-web-icon" />
  </svg>
);

export default CaharayaWebIcon;