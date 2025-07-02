import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-sans)', 'sans-serif'],
      serif: ['"Lora"', 'serif'],
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-3d': {
          'from': { transform: 'rotateY(0deg)' },
          'to': { transform: 'rotateY(360deg)' },
        },
        'border-color-cycle': {
          '0%, 100%': { 'border-color': 'hsl(var(--primary))' }, 
          '33%': { 'border-color': 'hsl(var(--accent))' }, 
          '66%': { 'border-color': 'hsl(var(--primary))' }, 
        },
        'flash': {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'hero-glow': {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        'pulsing-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 15px -5px hsl(var(--primary) / 0.4), 0 0 8px -5px hsl(var(--accent) / 0.3)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 25px 0px hsl(var(--primary) / 0.5), 0 0 15px -5px hsl(var(--accent) / 0.4)',
            transform: 'scale(1.03)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin': 'spin 1.5s linear infinite',
        'spin-3d': 'spin-3d 25s linear infinite',
        'border-color-cycle': 'border-color-cycle 4s linear infinite',
        'flash': 'flash 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'hero-glow': 'hero-glow 12s ease-in-out infinite',
        'pulsing-glow': 'pulsing-glow 8s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
