'use client';

import { AstralLogo } from "@/components/icons/astral-logo";
import { cn } from "@/lib/utils";

interface GlobalLoadingProps {
  message?: string;
  className?: string;
}

export function GlobalLoading({ message = "Loading...", className }: GlobalLoadingProps) {
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="text-center space-y-4">
        {/* Animated Logo */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 w-24 h-24 border-2 border-primary/30 rounded-full animate-spin" style={{animationDuration: '3s'}} />
          
          {/* Inner rotating ring */}
          <div className="absolute inset-2 w-20 h-20 border-2 border-primary/50 rounded-full animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}} />
          
          {/* Central logo */}
          <div className="relative flex items-center justify-center w-24 h-24">
            <AstralLogo className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{message}</h3>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for inline loading states
export function InlineLoading({ message = "Loading...", size = "default" }: { 
  message?: string; 
  size?: "sm" | "default" | "lg" 
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <AstralLogo className={cn("text-primary animate-spin", sizeClasses[size])} />
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
}
