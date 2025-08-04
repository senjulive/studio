'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useThemeContext, themes, type ThemeName } from '@/providers/enhanced-theme-provider';
import { cn } from '@/lib/utils';

// Icons
import { 
  Sun, 
  Moon, 
  Palette, 
  Monitor, 
  Zap, 
  Sparkles, 
  CheckCircle,
  ChevronDown
} from 'lucide-react';

interface EnhancedThemeSwitcherProps {
  className?: string;
  variant?: 'icon' | 'button' | 'card' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showPreview?: boolean;
}

const themeIcons = {
  light: Sun,
  dark: Moon,
  purple: Zap,
} as const;

const themeColors = {
  light: 'from-yellow-400 to-orange-500',
  dark: 'from-blue-400 to-purple-500',
  purple: 'from-purple-400 to-pink-500',
} as const;

export function EnhancedThemeSwitcher({
  className,
  variant = 'icon',
  size = 'md',
  showLabel = false,
  showPreview = false
}: EnhancedThemeSwitcherProps) {
  const { currentTheme, setTheme, mounted, isDark } = useThemeContext();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!mounted) {
    return (
      <div className={cn(
        'rounded-lg bg-muted animate-pulse',
        size === 'sm' && 'w-8 h-8',
        size === 'md' && 'w-10 h-10',
        size === 'lg' && 'w-12 h-12',
        className
      )} />
    );
  }

  const CurrentIcon = themeIcons[currentTheme];
  const currentGradient = themeColors[currentTheme];

  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size={size === 'lg' ? 'default' : 'icon'}
                  className={cn(
                    'relative overflow-hidden transition-all duration-300 hover:scale-110',
                    'bg-gradient-to-br border border-border/50 hover:border-primary/50',
                    isDark ? 'from-background/50 to-background' : 'from-background to-muted',
                    size === 'sm' && 'h-8 w-8',
                    size === 'md' && 'h-10 w-10',
                    size === 'lg' && 'h-12 w-12 px-4',
                    className
                  )}
                >
                  <div className="relative z-10 flex items-center gap-2">
                    <CurrentIcon className={cn(
                      'transition-all duration-300',
                      size === 'sm' && 'h-4 w-4',
                      size === 'md' && 'h-5 w-5',
                      size === 'lg' && 'h-6 w-6'
                    )} />
                    {size === 'lg' && showLabel && (
                      <span className="text-sm font-medium">{themes[currentTheme].name}</span>
                    )}
                  </div>
                  
                  {/* Animated background */}
                  <motion.div
                    className={cn('absolute inset-0 bg-gradient-to-br opacity-20', currentGradient)}
                    animate={{
                      scale: isOpen ? 1.1 : 1,
                      opacity: isOpen ? 0.3 : 0.1,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  
                  {/* Glow effect */}
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300',
                    currentGradient
                  )} />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <div className="flex items-center gap-2">
                <span>Theme: {themes[currentTheme].name}</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent 
            align="end" 
            className={cn(
              'w-64 p-2 border border-border/50 shadow-2xl',
              isDark ? 'bg-black/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl'
            )}
          >
            {Object.entries(themes).map(([key, theme]) => {
              const Icon = themeIcons[key as ThemeName];
              const gradient = themeColors[key as ThemeName];
              const isSelected = currentTheme === key;
              
              return (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setTheme(key as ThemeName)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200',
                    'hover:bg-primary/10 hover:scale-[1.02] group relative overflow-hidden',
                    isSelected && 'bg-primary/10 border border-primary/20'
                  )}
                >
                  <div className="relative">
                    <div className={cn(
                      'p-2 rounded-lg bg-gradient-to-br transition-all duration-300',
                      gradient,
                      isSelected ? 'shadow-lg' : 'opacity-80 group-hover:opacity-100'
                    )}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <CheckCircle className="h-4 w-4 text-primary bg-background rounded-full" />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{theme.icon}</span>
                      <span className="font-medium">{theme.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {theme.description}
                    </p>
                  </div>

                  {showPreview && (
                    <div className="flex flex-col gap-1">
                      <div className={cn('w-6 h-2 rounded-full', gradient)} />
                      <div className="w-6 h-1 bg-muted rounded-full" />
                    </div>
                  )}

                  {/* Hover effect */}
                  <motion.div
                    className={cn('absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10', gradient)}
                    initial={false}
                    animate={{ opacity: isSelected ? 0.1 : 0 }}
                  />
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('space-y-3', className)}>
        <h3 className="text-sm font-medium text-foreground">Theme</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(themes).map(([key, theme]) => {
            const Icon = themeIcons[key as ThemeName];
            const gradient = themeColors[key as ThemeName];
            const isSelected = currentTheme === key;
            
            return (
              <motion.button
                key={key}
                onClick={() => setTheme(key as ThemeName)}
                className={cn(
                  'relative p-4 rounded-xl transition-all duration-300 group overflow-hidden',
                  'border border-border/50 hover:border-primary/50',
                  'bg-gradient-to-br from-background/50 to-muted/50',
                  'hover:scale-105 hover:shadow-lg',
                  isSelected && 'border-primary shadow-lg'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className={cn(
                    'p-3 rounded-lg bg-gradient-to-br',
                    gradient,
                    isSelected ? 'shadow-lg' : 'opacity-80 group-hover:opacity-100'
                  )}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{theme.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {theme.description}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </motion.div>
                )}

                {/* Background effect */}
                <motion.div
                  className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10', gradient)}
                  animate={{ opacity: isSelected ? 0.05 : 0 }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-1 p-1 bg-muted rounded-lg', className)}>
        {Object.entries(themes).map(([key, theme]) => {
          const Icon = themeIcons[key as ThemeName];
          const isSelected = currentTheme === key;
          
          return (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              onClick={() => setTheme(key as ThemeName)}
              className={cn(
                'h-8 px-3 rounded-md transition-all duration-200',
                isSelected && 'bg-background shadow-sm'
              )}
            >
              <Icon className="h-4 w-4 mr-2" />
              {showLabel && <span className="text-xs">{theme.name}</span>}
            </Button>
          );
        })}
      </div>
    );
  }

  // Default button variant
  return (
    <Button
      onClick={() => setTheme(currentTheme === 'light' ? 'dark' : currentTheme === 'dark' ? 'purple' : 'light')}
      variant="outline"
      size={size}
      className={cn(
        'relative overflow-hidden bg-gradient-to-br transition-all duration-300',
        currentGradient,
        'hover:scale-105 hover:shadow-lg',
        className
      )}
    >
      <CurrentIcon className="h-4 w-4 mr-2" />
      {showLabel && themes[currentTheme].name}
    </Button>
  );
}

// Quick theme toggle for header/toolbar
export function QuickThemeToggle({ className }: { className?: string }) {
  const { currentTheme, setTheme } = useThemeContext();
  
  const nextTheme = React.useMemo(() => {
    switch (currentTheme) {
      case 'light': return 'dark';
      case 'dark': return 'purple';
      case 'purple': return 'light';
      default: return 'dark';
    }
  }, [currentTheme]);

  const CurrentIcon = themeIcons[currentTheme];
  const NextIcon = themeIcons[nextTheme];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(nextTheme)}
            className={cn(
              'relative overflow-hidden group h-9 w-9',
              'bg-gradient-to-br from-background/50 to-muted/50',
              'border border-border/50 hover:border-primary/50',
              'transition-all duration-300 hover:scale-110',
              className
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTheme}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CurrentIcon className="h-4 w-4" />
              </motion.div>
            </AnimatePresence>

            {/* Next theme preview on hover */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 0.6 }}
              className="absolute top-0 right-0 w-3 h-3 flex items-center justify-center"
            >
              <NextIcon className="h-2 w-2" />
            </motion.div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>Switch to {themes[nextTheme].name}</span>
            <NextIcon className="h-3 w-3" />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
