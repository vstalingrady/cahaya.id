import { cn } from "@/lib/utils";

const GeminiLogo = ({ className }: { className?: string }) => (
    <svg
        width="40px"
        height="40px"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(className)}
    >
        <defs>
            <linearGradient
                id="paint0_linear_1719_6784"
                x1="8.5"
                y1="3"
                x2="15"
                y2="30.5"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#8E83EE" />
                <stop offset="1" stopColor="#5E73E4" />
            </linearGradient>
            <linearGradient
                id="paint1_linear_1719_6784"
                x1="22"
                y1="3"
                x2="22"
                y2="20"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#41A3E0" />
                <stop offset="1" stopColor="#3172E0" />
            </linearGradient>
            <linearGradient
                id="paint2_linear_1719_6784"
                x1="28"
                y1="23.5"
                x2="35.5"
                y2="34"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#41A3E0" />
                <stop offset="1" stopColor="#3172E0" />
            </linearGradient>
        </defs>
        <path
            d="M22.5 10C22.5 16.9036 16.9036 22.5 10 22.5C3.09644 22.5 -2.5 16.9036 -2.5 10C-2.5 3.09644 3.09644 -2.5 10 -2.5C16.9036 -2.5 22.5 3.09644 22.5 10Z"
            fill="url(#paint0_linear_1719_6784)"
            transform="translate(2.5 2.5) rotate(90 10 10)"
        />
        <path
            d="M32.5 10C32.5 16.9036 26.9036 22.5 20 22.5C13.0964 22.5 7.5 16.9036 7.5 10C7.5 3.09644 13.0964 -2.5 20 -2.5C26.9036 -2.5 32.5 3.09644 32.5 10Z"
            fill="url(#paint1_linear_1719_6784)"
            transform="translate(2.5 2.5) rotate(90 20 10)"
        />
        <path
            d="M17.5 30C17.5 34.1421 14.1421 37.5 10 37.5C5.85786 37.5 2.5 34.1421 2.5 30C2.5 25.8579 5.85786 22.5 10 22.5C14.1421 22.5 17.5 25.8579 17.5 30Z"
            fill="url(#paint2_linear_1719_6784)"
            transform="translate(2.5 2.5) rotate(90 10 30)"
        />
    </svg>
);

export default GeminiLogo;
