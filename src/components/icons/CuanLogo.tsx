import React from 'react';

const CuanLogo = ({ className = "w-24 h-auto", ...props }) => {
  return (
    <svg 
      width="1024" 
      height="1024" 
      viewBox="0 0 1024 1024" 
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="linearGradient6580">
          <stop stopColor="#2f2957" offset="0"/>
          <stop stopColor="#412c81" offset="1"/>
        </linearGradient>
        <linearGradient 
          id="linearGradient6832" 
          x1="118.61" 
          x2="396.67" 
          y1="416.76" 
          y2="308.33" 
          gradientTransform="translate(-22.253 748.23)" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8039f2" offset="0"/>
          <stop stopColor="#c544a4" offset="1"/>
        </linearGradient>
        <linearGradient 
          id="linearGradient6834" 
          x1="266.08" 
          x2="380.58" 
          y1="594.05" 
          y2="522.15" 
          gradientTransform="translate(-22.253 748.23)" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7030d9" offset="0"/>
          <stop stopColor="#8039f2" offset="1"/>
        </linearGradient>
        <linearGradient 
          id="linearGradient6836" 
          x1="118.55" 
          x2="191.42" 
          y1="545.59" 
          y2="498.99" 
          gradientTransform="translate(-22.253 748.23)" 
          gradientUnits="userSpaceOnUse" 
          href="#linearGradient6580"
        />
      </defs>
      <g>
        <g transform="matrix(3.1466 0 0 3.1466 -232.23 -3308.8)" fillRule="evenodd">
          <path 
            d="m96.294 1134.5v159.33l137.99 79.666v-62.553l-88.105-48.391v-96.779z" 
            fill="url(#linearGradient6836)" 
            stopColor="#000000" 
          />
          <path 
            d="m322.39 1262.5-88.105 48.391v62.553l137.99-79.666z" 
            fill="url(#linearGradient6834)" 
            stopColor="#000000" 
          />
          <path 
            d="m234.28 1054.8-137.99 79.666 49.883 31.277 88.105-48.391 88.105 48.391 49.881-31.277z" 
            fill="url(#linearGradient6832)" 
            stopColor="#000000" 
          />
        </g>
      </g>
    </svg>
  );
};

export default CuanLogo;
