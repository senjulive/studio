"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'current';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'astral-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('current');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    if (savedTheme && ['light', 'dark', 'current'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      
      // Remove all theme classes
      document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-current');
      
      // Add current theme class
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const themes: Theme[] = ['current', 'dark', 'light'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function getThemeConfig(theme: Theme) {
  const configs = {
    light: {
      name: 'Light',
      icon: '☀️',
      description: 'Clean and bright interface',
    },
    dark: {
      name: 'Dark',
      icon: '🌙',
      description: 'Easy on the eyes',
    },
    current: {
      name: 'Astral',
      icon: '✨',
      description: 'Signature glassmorphic design',
    },
  };
  
  return configs[theme];
}
