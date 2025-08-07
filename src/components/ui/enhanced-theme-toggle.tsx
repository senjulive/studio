'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EnhancedThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Palette className="h-4 w-4" />
      </Button>
    );
  }

  const getIcon = () => {
    if (theme === 'system') return Monitor;
    if (resolvedTheme === 'dark') return Moon;
    return Sun;
  };

  const Icon = getIcon();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/80 transition-all duration-200"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-background/95 backdrop-blur-sm border border-border/50"
      >
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && (
            <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && (
            <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="cursor-pointer"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === 'system' && (
            <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
