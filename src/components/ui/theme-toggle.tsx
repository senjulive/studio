"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, getThemeConfig } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const currentConfig = getThemeConfig(theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="glass-button relative overflow-hidden"
        >
          <motion.div
            key={theme}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="text-lg"
          >
            {currentConfig.icon}
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass border-border/50">
        <AnimatePresence>
          {(['current', 'dark', 'light'] as const).map((themeOption, index) => {
            const config = getThemeConfig(themeOption);
            return (
              <motion.div
                key={themeOption}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DropdownMenuItem
                  onClick={() => setTheme(themeOption)}
                  className={`cursor-pointer transition-all duration-200 ${
                    theme === themeOption 
                      ? 'bg-primary/20 text-primary-foreground' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <span className="mr-3 text-base">{config.icon}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{config.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {config.description}
                    </span>
                  </div>
                </DropdownMenuItem>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function QuickThemeToggle() {
  const { toggleTheme } = useTheme();
  const { theme } = useTheme();
  const currentConfig = getThemeConfig(theme);

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="glass-button theme-toggle relative"
    >
      <motion.div
        key={theme}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
        className="text-lg"
      >
        {currentConfig.icon}
      </motion.div>
    </Button>
  );
}
