import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Enhanced font family support
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        body: ['var(--font-inter)', ...fontFamily.sans],
        headline: ['var(--font-inter)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      
      // Enhanced color system with electric theme
      colors: {
        // Base colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // UI colors
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        
        // Brand colors - Electric theme
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(280 100% 97%)',
          100: 'hsl(280 100% 95%)',
          200: 'hsl(280 100% 90%)',
          300: 'hsl(280 100% 82%)',
          400: 'hsl(280 100% 70%)',
          500: 'hsl(280 100% 60%)',
          600: 'hsl(280 100% 50%)',
          700: 'hsl(280 100% 40%)',
          800: 'hsl(280 100% 30%)',
          900: 'hsl(280 100% 20%)',
          950: 'hsl(280 100% 10%)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          50: 'hsl(190 100% 97%)',
          100: 'hsl(190 100% 95%)',
          200: 'hsl(190 100% 90%)',
          300: 'hsl(190 100% 82%)',
          400: 'hsl(190 100% 70%)',
          500: 'hsl(190 100% 50%)',
          600: 'hsl(190 100% 40%)',
          700: 'hsl(190 100% 30%)',
          800: 'hsl(190 100% 20%)',
          900: 'hsl(190 100% 15%)',
          950: 'hsl(190 100% 10%)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          50: 'hsl(320 100% 97%)',
          100: 'hsl(320 100% 95%)',
          200: 'hsl(320 100% 90%)',
          300: 'hsl(320 100% 82%)',
          400: 'hsl(320 100% 70%)',
          500: 'hsl(320 100% 65%)',
          600: 'hsl(320 100% 55%)',
          700: 'hsl(320 100% 45%)',
          800: 'hsl(320 100% 35%)',
          900: 'hsl(320 100% 25%)',
          950: 'hsl(320 100% 15%)',
        },
        
        // Semantic colors
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        
        // Utility colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        
        // Chart colors
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        
        // Sidebar colors
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      
      // Enhanced border radius
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
      // Enhanced spacing for mobile
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      
      // Enhanced screens for mobile-first design
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Device-specific breakpoints
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
        // Orientation breakpoints
        'landscape': {'raw': '(orientation: landscape)'},
        'portrait': {'raw': '(orientation: portrait)'},
        // High DPI screens
        'retina': {'raw': '(-webkit-min-device-pixel-ratio: 2)'},
      },
      
      // Enhanced background images
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-electric': 'linear-gradient(135deg, hsl(280 100% 70%), hsl(190 100% 50%))',
        'gradient-neon': 'linear-gradient(135deg, hsl(320 100% 65%), hsl(280 100% 70%))',
        'gradient-cyber': 'linear-gradient(135deg, hsl(190 100% 50%), hsl(120 100% 50%))',
        'grid-pattern': 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
      },
      
      // Enhanced animations and keyframes
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'electric-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px hsl(280 100% 70% / 0.3), 0 0 40px hsl(280 100% 70% / 0.1)',
            transform: 'scale(1)' 
          },
          '50%': { 
            boxShadow: '0 0 30px hsl(280 100% 70% / 0.5), 0 0 60px hsl(280 100% 70% / 0.2)',
            transform: 'scale(1.02)' 
          },
        },
        'trading-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'electric-pulse': 'electric-pulse 2s ease-in-out infinite',
        'trading-pulse': 'trading-pulse 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      
      // Enhanced typography
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // Enhanced shadows with electric glow
      boxShadow: {
        'electric': '0 0 20px hsl(280 100% 70% / 0.3), 0 0 40px hsl(280 100% 70% / 0.1)',
        'electric-lg': '0 0 30px hsl(280 100% 70% / 0.4), 0 0 60px hsl(280 100% 70% / 0.2)',
        'electric-cyan': '0 0 20px hsl(190 100% 50% / 0.3), 0 0 40px hsl(190 100% 50% / 0.1)',
        'electric-magenta': '0 0 20px hsl(320 100% 65% / 0.3), 0 0 40px hsl(320 100% 65% / 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'mobile': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'mobile-lg': '0 4px 16px 0 rgba(0, 0, 0, 0.15)',
      },
      
      // Enhanced backdrop blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      
      // Custom utilities
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // Touch targets for mobile
      minHeight: {
        'touch': '44px', // iOS minimum touch target
        'touch-android': '48px', // Android minimum touch target
      },
      minWidth: {
        'touch': '44px',
        'touch-android': '48px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/container-queries'),
    // Add custom utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.electric-glow': {
          boxShadow: theme('boxShadow.electric'),
        },
        '.electric-glow-lg': {
          boxShadow: theme('boxShadow.electric-lg'),
        },
        '.electric-glow-cyan': {
          boxShadow: theme('boxShadow.electric-cyan'),
        },
        '.electric-glow-magenta': {
          boxShadow: theme('boxShadow.electric-magenta'),
        },
        '.mobile-card': {
          backgroundColor: 'hsl(var(--card) / 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: theme('borderRadius.2xl'),
          border: '1px solid hsl(var(--primary) / 0.1)',
          boxShadow: theme('boxShadow.electric'),
        },
        '.mobile-container': {
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
          maxWidth: theme('screens.sm'),
          marginLeft: 'auto',
          marginRight: 'auto',
          '@screen md': {
            maxWidth: theme('screens.7xl'),
          },
        },
        '.mobile-section': {
          marginBottom: theme('spacing.4'),
          '@screen md': {
            marginBottom: theme('spacing.6'),
          },
        },
        '.safe-area-inset': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.touch-target': {
          minHeight: theme('minHeight.touch'),
          minWidth: theme('minWidth.touch'),
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
