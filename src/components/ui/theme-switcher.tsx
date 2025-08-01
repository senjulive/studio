'use client';

import * as React from 'react';
import { Moon, Sun, Palette, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const themes = [
  {
    name: 'Dark',
    value: 'dark' as Theme,
    icon: Moon,
    description: 'Deep space theme',
  },
  {
    name: 'Light',
    value: 'light' as Theme,
    icon: Sun,
    description: 'Clean bright theme',
  },
  {
    name: 'Modern',
    value: 'modern' as Theme,
    icon: Palette,
    description: 'Sleek gradient theme',
  },
  {
    name: 'Volcanic',
    value: 'volcanic' as Theme,
    icon: Zap,
    description: 'Fiery orange theme',
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const currentTheme = themes.find(t => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Moon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 hover:bg-accent/50 transition-colors"
        >
          <CurrentIcon className="h-5 w-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={cn(
                "flex items-center gap-3 py-2.5 cursor-pointer",
                theme === themeOption.value && "bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">{themeOption.name}</span>
                <span className="text-xs text-muted-foreground">{themeOption.description}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
