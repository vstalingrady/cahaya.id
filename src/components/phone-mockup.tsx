import { cn } from '@/lib/utils';

const PhoneMockup = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[10px] rounded-[2rem] h-[420px] w-[210px] shadow-xl", className)}>
      <div className="w-[100px] h-[14px] bg-gray-800 top-0 rounded-b-[0.8rem] left-1/2 -translate-x-1/2 absolute"></div>
      <div className="h-[34px] w-[3px] bg-gray-800 absolute -start-[13px] top-[94px] rounded-s-lg"></div>
      <div className="h-[34px] w-[3px] bg-gray-800 absolute -start-[13px] top-[148px] rounded-s-lg"></div>
      <div className="h-[50px] w-[3px] bg-gray-800 absolute -end-[13px] top-[112px] rounded-e-lg"></div>
      <div className="rounded-[1.5rem] overflow-hidden w-full h-full bg-background relative">
        {children}
      </div>
    </div>
  );
};

export default PhoneMockup;
