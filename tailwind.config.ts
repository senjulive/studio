import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-inter)', 'sans-serif'],
        headline: ['var(--font-inter)', 'sans-serif'],
        code: ['JetBrains Mono', 'Fira Code', 'monospace'],
        cyber: ['Orbitron', 'monospace'],
      },
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
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
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
        // Neon colors for dark theme
        neon: {
          blue: '#00D4FF',
          purple: '#B347FF',
          green: '#00FF94',
          pink: '#FF47B3',
          yellow: '#FFD700',
          cyan: '#00FFFF',
        },
        // Electric colors
        electric: {
          blue: '#1E40AF',
          purple: '#7C3AED',
          cyan: '#0891B2',
          green: '#059669',
          red: '#DC2626',
          yellow: '#D97706',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
        '3xl': 'calc(var(--radius) + 12px)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.95) 25%, rgba(5, 5, 5, 0.97) 50%, rgba(0, 0, 0, 0.99) 100%)',
        'gradient-neon': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
        'gradient-cyber': 'linear-gradient(45deg, rgba(0, 212, 255, 0.1) 0%, rgba(179, 71, 255, 0.1) 50%, rgba(0, 255, 148, 0.1) 100%)',
      },
      boxShadow: {
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        'neon-lg': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'cyber': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(147, 51, 234, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
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
        'bot-pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: '1' },
            '50%': { transform: 'scale(1.15)', opacity: '0.9' },
        },
        'bar-pulse': {
            '0%, 100%': { transform: 'scaleY(0.2)' },
            '50%': { transform: 'scaleY(1.0)' },
        },
        'pulse': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        flashGreen: {
          '0%': { backgroundColor: 'rgba(16, 185, 129, 0)' },
          '50%': { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
          '100%': { backgroundColor: 'rgba(16, 185, 129, 0)' },
        },
        flashRed: {
            '0%': { backgroundColor: 'rgba(239, 68, 68, 0)' },
            '50%': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
            '100%': { backgroundColor: 'rgba(239, 68, 68, 0)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '50%': { transform: 'translateY(-15px) scale(1.1)', opacity: '1' },
          '100%': { transform: 'translateY(-40px) scale(0.8)', opacity: '0' },
        },
        // New dark theme animations
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' },
          '50%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)',
            transform: 'scale(1.02)'
          },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100vh)', opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'cyber-scan': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'data-flow': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(20px)', opacity: '0' },
        },
        'hologram': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.02)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'bot-pulse': 'bot-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bar-pulse': 'bar-pulse 2.2s ease-in-out infinite',
        'pulse': 'pulse 2s infinite',
        'flash-green': 'flashGreen 0.8s ease-in-out',
        'flash-red': 'flashRed 0.8s ease-in-out',
        'floatUp': 'floatUp 3s forwards',
        // New dark theme animations
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'matrix-rain': 'matrix-rain 3s linear infinite',
        'neon-flicker': 'neon-flicker 0.15s infinite linear',
        'cyber-scan': 'cyber-scan 3s ease-in-out infinite',
        'data-flow': 'data-flow 2s ease-in-out infinite',
        'hologram': 'hologram 3s ease-in-out infinite',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
        '85': '0.85',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // Add custom plugin for utilities
    function({ addUtilities }: any) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        },
        '.text-shadow-neon': {
          textShadow: '0 0 10px currentColor, 0 0 20px currentColor',
        },
        '.backdrop-blur-xs': {
          backdropFilter: 'blur(2px)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;
