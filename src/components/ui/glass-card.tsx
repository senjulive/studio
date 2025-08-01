import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const glassCardVariants = cva(
  "relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02]",
  {
    variants: {
      variant: {
        default: "bg-card/80 border-border/50 shadow-lg",
        gradient: "bg-gradient-to-br from-primary/10 via-card/80 to-accent/10 border-primary/30 shadow-xl shadow-primary/10",
        crypto: "bg-gradient-to-br from-cyan-500/10 via-card/80 to-blue-500/10 border-cyan-500/30 shadow-xl shadow-cyan-500/10",
        gaming: "bg-gradient-to-br from-purple-500/10 via-card/80 to-pink-500/10 border-purple-500/30 shadow-xl shadow-purple-500/10",
        success: "bg-gradient-to-br from-green-500/10 via-card/80 to-emerald-500/10 border-green-500/30 shadow-xl shadow-green-500/10",
        warning: "bg-gradient-to-br from-yellow-500/10 via-card/80 to-orange-500/10 border-yellow-500/30 shadow-xl shadow-yellow-500/10",
        danger: "bg-gradient-to-br from-red-500/10 via-card/80 to-pink-500/10 border-red-500/30 shadow-xl shadow-red-500/10",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
      glow: {
        none: "",
        subtle: "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        strong: "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-primary/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 after:absolute after:inset-0 after:rounded-2xl after:shadow-[0_0_30px_rgba(var(--primary),0.3)] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
    },
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  children: React.ReactNode;
  shimmer?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, size, glow, shimmer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(glassCardVariants({ variant, size, glow, className }))}
        {...props}
      >
        {shimmer && (
          <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer pointer-events-none" />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

// Stat Card component inspired by the designs
export interface StatCardProps extends GlassCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, subtitle, icon: Icon, trend, trendValue, variant = "gradient", ...props }, ref) => {
    const trendColor = trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-muted-foreground";
    
    return (
      <GlassCard ref={ref} variant={variant} glow="subtle" {...props}>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            </div>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {trend && trendValue && (
            <div className={cn("text-sm font-medium", trendColor)}>
              {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {trendValue}
            </div>
          )}
        </div>
      </GlassCard>
    );
  }
);
StatCard.displayName = "StatCard";

// Feature Card component for dashboard sections
export interface FeatureCardProps extends GlassCardProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  badge?: string;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ title, description, icon: Icon, action, badge, variant = "gradient", ...props }, ref) => {
    return (
      <GlassCard ref={ref} variant={variant} glow="subtle" {...props}>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                {badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {badge}
                  </span>
                )}
              </div>
            </div>
            {action}
          </div>
          {description && (
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>
      </GlassCard>
    );
  }
);
FeatureCard.displayName = "FeatureCard";

export { GlassCard, StatCard, FeatureCard, glassCardVariants };
