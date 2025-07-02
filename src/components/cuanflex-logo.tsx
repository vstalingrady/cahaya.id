import { cn } from "@/lib/utils";

const CuanLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 141 158"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-labelledby="cuan-logo-title"
    >
      <title id="cuan-logo-title">Cuan Logo</title>
      
      {/* Top Face (Pink) - As described by user */}
      <polygon
        points="47,0 131,0 101,26 17,26"
        fill="#e6567a"
      />
      {/* Side Face (Yellow) - As described by user */}
      <polygon
        points="17,26 0,40 0,118 47,158 47,26"
        fill="#f7d706"
      />
      {/* Front Face (Pale Pink) - As described by user */}
      <polygon
        points="47,158 141,158 141,132 73,132 73,52 131,52 101,26 47,26"
        fill="#f6ad8f"
      />
    </svg>
  );
};

export default CuanLogo;
