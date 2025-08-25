'use client';

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Crown, Star } from "lucide-react";
import type { Rank } from "@/lib/ranks";
import type { TierSetting } from "@/lib/tiers";

// Centralized rank icon mapping
import { RecruitRankIcon } from "@/components/icons/ranks/recruit-rank-icon";
import { BronzeRankIcon } from "@/components/icons/ranks/bronze-rank-icon";
import { SilverRankIcon } from "@/components/icons/ranks/silver-rank-icon";
import { GoldRankIcon } from "@/components/icons/ranks/gold-rank-icon";
import { PlatinumRankIcon } from "@/components/icons/ranks/platinum-rank-icon";
import { DiamondRankIcon } from "@/components/icons/ranks/diamond-rank-icon";
import { Lock } from "lucide-react";

export const rankIcons = {
  RecruitRankIcon,
  BronzeRankIcon,
  SilverRankIcon,
  GoldRankIcon,
  PlatinumRankIcon,
  DiamondRankIcon,
  Lock,
};

interface UnifiedUserBadgeProps {
  rank: Rank;
  tier?: TierSetting | null;
  tierIcon?: React.ComponentType<{ className?: string }>;
  tierClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical' | 'compact';
  showTooltip?: boolean;
  className?: string;
}

/**
 * Unified User Badge Component
 * Combines tier and rank into a single, elegant badge display
 */
export function UnifiedUserBadge({
  rank,
  tier,
  tierIcon: TierIcon,
  tierClassName,
  size = 'md',
  layout = 'horizontal',
  showTooltip = false,
  className
}: UnifiedUserBadgeProps) {
  const RankIcon = rankIcons[rank.Icon as keyof typeof rankIcons];

  const sizeClasses = {
    sm: {
      badge: "text-xs py-1 px-2",
      icon: "h-3 w-3",
      gap: "gap-1",
      separator: "mx-1"
    },
    md: {
      badge: "text-sm py-1.5 px-3",
      icon: "h-4 w-4",
      gap: "gap-1.5",
      separator: "mx-1.5"
    },
    lg: {
      badge: "text-base py-2 px-4",
      icon: "h-5 w-5",
      gap: "gap-2",
      separator: "mx-2"
    }
  };

  const currentSize = sizeClasses[size];

  // For compact layout - show only the highest status (tier if available, otherwise rank)
  if (layout === 'compact') {
    const displayTier = tier && TierIcon;
    const displayIcon = displayTier ? TierIcon : RankIcon;
    const displayName = displayTier ? tier.name : rank.name;
    const displayClassName = displayTier ? tierClassName : rank.className;

    const badge = (
      <Badge 
        variant="outline" 
        className={cn(
          currentSize.badge,
          "flex items-center",
          currentSize.gap,
          "border-opacity-50 bg-opacity-10 relative",
          displayClassName,
          className
        )}
      >
        {displayTier && (
          <Crown className={cn(currentSize.icon, "text-amber-500 absolute -top-1 -right-1")} />
        )}
        {displayIcon && <displayIcon className={currentSize.icon} />}
        <span className="font-medium">{displayName}</span>
      </Badge>
    );

    if (showTooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{badge}</TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <p className="font-medium">{displayTier ? 'VIP CORE Tier' : 'Account Rank'}</p>
                {displayTier && tier && (
                  <p className="text-xs text-muted-foreground">Rank: {rank.name}</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return badge;
  }

  // For horizontal layout - show rank and tier side by side
  if (layout === 'horizontal') {
    const badges = (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge 
          variant="outline" 
          className={cn(
            currentSize.badge,
            "flex items-center",
            currentSize.gap,
            "border-opacity-50 bg-opacity-10",
            rank.className
          )}
        >
          {RankIcon && <RankIcon className={currentSize.icon} />}
          <span className="font-medium">{rank.name}</span>
        </Badge>
        
        {tier && TierIcon && tierClassName && (
          <Badge 
            variant="outline" 
            className={cn(
              currentSize.badge,
              "flex items-center",
              currentSize.gap,
              "border-opacity-50 bg-opacity-10 relative",
              tierClassName
            )}
          >
            <Crown className={cn(currentSize.icon, "text-amber-500 absolute -top-1 -right-1")} />
            <TierIcon className={currentSize.icon} />
            <span className="font-medium">{tier.name}</span>
          </Badge>
        )}
      </div>
    );

    if (showTooltip) {
      return (
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="outline" 
                  className={cn(
                    currentSize.badge,
                    "flex items-center",
                    currentSize.gap,
                    "border-opacity-50 bg-opacity-10",
                    rank.className
                  )}
                >
                  {RankIcon && <RankIcon className={currentSize.icon} />}
                  <span className="font-medium">{rank.name}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Account Rank</p>
              </TooltipContent>
            </Tooltip>
            
            {tier && TierIcon && tierClassName && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      currentSize.badge,
                      "flex items-center",
                      currentSize.gap,
                      "border-opacity-50 bg-opacity-10 relative",
                      tierClassName
                    )}
                  >
                    <Crown className={cn(currentSize.icon, "text-amber-500 absolute -top-1 -right-1")} />
                    <TierIcon className={currentSize.icon} />
                    <span className="font-medium">{tier.name}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>VIP CORE Tier</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      );
    }

    return badges;
  }

  // For vertical layout - show rank and tier stacked
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Badge 
        variant="outline" 
        className={cn(
          currentSize.badge,
          "flex items-center",
          currentSize.gap,
          "border-opacity-50 bg-opacity-10",
          rank.className
        )}
      >
        {RankIcon && <RankIcon className={currentSize.icon} />}
        <span className="font-medium">{rank.name}</span>
      </Badge>
      
      {tier && TierIcon && tierClassName && (
        <Badge 
          variant="outline" 
          className={cn(
            currentSize.badge,
            "flex items-center",
            currentSize.gap,
            "border-opacity-50 bg-opacity-10 relative",
            tierClassName
          )}
        >
          <Crown className={cn(currentSize.icon, "text-amber-500 absolute -top-1 -right-1")} />
          <TierIcon className={currentSize.icon} />
          <span className="font-medium">{tier.name}</span>
        </Badge>
      )}
    </div>
  );
}

/**
 * Simplified unified badge for common use cases
 */
export function UserStatusBadge({
  rank,
  tier,
  tierIcon,
  tierClassName,
  className
}: Omit<UnifiedUserBadgeProps, 'size' | 'layout' | 'showTooltip'>) {
  return (
    <UnifiedUserBadge
      rank={rank}
      tier={tier}
      tierIcon={tierIcon}
      tierClassName={tierClassName}
      layout="compact"
      size="md"
      showTooltip={true}
      className={className}
    />
  );
}

/**
 * Header badge specifically for the dashboard header
 */
export function HeaderUserBadge({
  rank,
  tier,
  tierIcon,
  tierClassName,
  className
}: Omit<UnifiedUserBadgeProps, 'size' | 'layout' | 'showTooltip'>) {
  return (
    <UnifiedUserBadge
      rank={rank}
      tier={tier}
      tierIcon={tierIcon}
      tierClassName={tierClassName}
      layout="horizontal"
      size="md"
      showTooltip={true}
      className={cn("hidden sm:flex", className)}
    />
  );
}

/**
 * Sidebar badge for the dashboard sidebar
 */
export function SidebarUserBadge({
  rank,
  tier,
  tierIcon,
  tierClassName,
  className
}: Omit<UnifiedUserBadgeProps, 'size' | 'layout' | 'showTooltip'>) {
  return (
    <UnifiedUserBadge
      rank={rank}
      tier={tier}
      tierIcon={tierIcon}
      tierClassName={tierClassName}
      layout="horizontal"
      size="sm"
      showTooltip={false}
      className={cn("flex-wrap", className)}
    />
  );
}
