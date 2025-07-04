import React from "react";

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <title>Apple logo</title>
        <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-2.5 6-7A7.5 7.5 0 0 0 18 5.18c-1.95-1.55-4.28-1.7-6-1.7-1.72 0-4.05.15-6 1.7A7.5 7.5 0 0 0 2 15.06c0 4.5 3 7 6 7 1.25 0 2.5-1.06 4-1.06Z"/>
        <path d="M12 4.18c-1.17 0-2.17.9-2.2 2.15.03.1.05.22.05.33.03 1.2.98 2.15 2.15 2.15.02 0 .04 0 .06-.02C13.2 8.78 14.18 7.8 14.2 6.6c-.02-1.25-.97-2.2-2.14-2.22Z"/>
    </svg>
);

export default AppleIcon;