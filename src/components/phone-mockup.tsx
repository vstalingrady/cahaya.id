import { cn } from '@/lib/utils';

const PhoneMockup = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[12px] rounded-[2.5rem] h-[550px] w-[270px] shadow-xl", className)}>
      <div className="w-[120px] h-[16px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
      <div className="h-[40px] w-[3px] bg-gray-800 absolute -start-[15px] top-[114px] rounded-s-lg"></div>
      <div className="h-[40px] w-[3px] bg-gray-800 absolute -start-[15px] top-[168px] rounded-s-lg"></div>
      <div className="h-[58px] w-[3px] bg-gray-800 absolute -end-[15px] top-[132px] rounded-e-lg"></div>
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-background">
        {children}
      </div>
    </div>
  );
};

export default PhoneMockup;
