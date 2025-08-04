'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

interface EnhancedThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode;
}

export function EnhancedThemeProvider({ children, ...props }: EnhancedThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={['light', 'dark', 'purple']}
      storageKey="astralcore-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

// Theme configuration
export const themes = {
  light: {
    name: 'Light',
    description: 'Clean and bright interface',
    icon: '☀️',
    colors: {
      primary: '#3B82F6',
      background: '#FFFFFF',
      foreground: '#1F2937',
    }
  },
  dark: {
    name: 'Dark Black',
    description: 'Sleek black interface with electric accents',
    icon: '🌙',
    colors: {
      primary: '#3B82F6',
      background: '#000000',
      foreground: '#F3F4F6',
    }
  },
  purple: {
    name: 'Purple Neon',
    description: 'Cyberpunk purple theme with neon effects',
    icon: '🟣',
    colors: {
      primary: '#B347FF',
      background: '#0A0514',
      foreground: '#F3F4F6',
    }
  }
} as const;

export type ThemeName = keyof typeof themes;

// Hook for theme management
export function useEnhancedTheme() {
  const [mounted, setMounted] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState<ThemeName>('dark');

  React.useEffect(() => {
    setMounted(true);
    
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('astralcore-theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      // Default to dark theme
      setCurrentTheme('dark');
      document.documentElement.className = 'dark';
      localStorage.setItem('astralcore-theme', 'dark');
    }
  }, []);

  const setTheme = React.useCallback((theme: ThemeName) => {
    if (!themes[theme]) return;
    
    setCurrentTheme(theme);
    document.documentElement.className = theme;
    localStorage.setItem('astralcore-theme', theme);
    
    // Add transition class temporarily
    document.documentElement.classList.add('transition-colors', 'duration-300');
    setTimeout(() => {
      document.documentElement.classList.remove('transition-colors', 'duration-300');
    }, 300);
  }, []);

  const toggleTheme = React.useCallback(() => {
    const themeKeys = Object.keys(themes) as ThemeName[];
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  }, [currentTheme, setTheme]);

  const getThemeConfig = React.useCallback((themeName?: ThemeName) => {
    return themes[themeName || currentTheme];
  }, [currentTheme]);

  return {
    mounted,
    currentTheme,
    setTheme,
    toggleTheme,
    getThemeConfig,
    themes,
    isDark: currentTheme === 'dark' || currentTheme === 'purple',
    isLight: currentTheme === 'light',
  };
}

// Theme context
interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  getThemeConfig: (theme?: ThemeName) => typeof themes[ThemeName];
  isDark: boolean;
  isLight: boolean;
  mounted: boolean;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const themeState = useEnhancedTheme();

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
}

// Component for theme switching
interface ThemeSwitcherProps {
  className?: string;
  showLabels?: boolean;
  variant?: 'buttons' | 'dropdown' | 'tabs';
}

export function ThemeSwitcher({ 
  className, 
  showLabels = false, 
  variant = 'buttons' 
}: ThemeSwitcherProps) {
  const { currentTheme, setTheme, mounted } = useThemeContext();

  if (!mounted) {
    return <div className="w-32 h-8 bg-muted animate-pulse rounded" />;
  }

  if (variant === 'dropdown') {
    return (
      <select
        value={currentTheme}
        onChange={(e) => setTheme(e.target.value as ThemeName)}
        className={`bg-background border border-border rounded-lg px-3 py-2 text-sm ${className}`}
      >
        {Object.entries(themes).map(([key, theme]) => (
          <option key={key} value={key}>
            {theme.icon} {theme.name}
          </option>
        ))}
      </select>
    );
  }

  if (variant === 'tabs') {
    return (
      <div className={`flex bg-muted rounded-lg p-1 ${className}`}>
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => setTheme(key as ThemeName)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${currentTheme === key 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <span>{theme.icon}</span>
            {showLabels && <span>{theme.name}</span>}
          </button>
        ))}
      </div>
    );
  }

  // Default buttons variant
  return (
    <div className={`flex gap-2 ${className}`}>
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => setTheme(key as ThemeName)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            border hover:scale-105 transform
            ${currentTheme === key 
              ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
              : 'bg-background text-foreground border-border hover:border-primary/50'
            }
          `}
          title={theme.description}
        >
          <span className="text-lg">{theme.icon}</span>
          {showLabels && <span>{theme.name}</span>}
        </button>
      ))}
    </div>
  );
}

// Auto theme detector based on time
export function useAutoTheme() {
  const { setTheme } = useThemeContext();

  React.useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      // Dark theme from 7 PM to 7 AM
      if (hour >= 19 || hour < 7) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };

    // Check immediately and then every hour
    checkTime();
    const interval = setInterval(checkTime, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [setTheme]);
}

// System theme detector
export function useSystemTheme() {
  const { setTheme } = useThemeContext();

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial theme
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);
}
