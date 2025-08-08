"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="bg-black/20 border-border/40">
        <Palette className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Palette className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (themeName: string) => {
    switch (themeName) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return themeName.charAt(0).toUpperCase() + themeName.slice(1);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-black/20 border-border/40 backdrop-blur-xl hover:bg-white/10 transition-colors"
        >
          {getThemeIcon(theme || "system")}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-black/90 backdrop-blur-xl border-border/40 min-w-[140px]"
      >
        {themes.map((availableTheme) => (
          <DropdownMenuItem
            key={availableTheme}
            onClick={() => setTheme(availableTheme)}
            className={cn(
              "flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors",
              theme === availableTheme && "bg-purple-500/20 text-purple-300"
            )}
          >
            {getThemeIcon(availableTheme)}
            <span>{getThemeLabel(availableTheme)}</span>
            {theme === availableTheme && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Quick Theme Toggle Button (for minimal spaces)
export function QuickThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Palette className="h-4 w-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="h-8 w-8 hover:bg-white/10 transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-purple-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
