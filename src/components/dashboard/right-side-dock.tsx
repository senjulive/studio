
'use client';

import * as React from 'react';
import Link from 'next/link';
import { MessageSquare, Gem, Settings, ArrowDownToLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const dockItems = [
  { href: '/dashboard/deposit', label: 'Deposit', icon: ArrowDownToLine },
  { href: '/dashboard/chat', label: 'Public Chat', icon: MessageSquare },
  { href: '/dashboard/trading', label: 'Tiers & Ranks', icon: Gem },
  { href: '/dashboard/security', label: 'Settings', icon: Settings },
];

export function RightSideDock() {
  return (
    <TooltipProvider>
      <div
        id="right-side-dock"
        className={cn(
          'fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col justify-evenly items-center p-2 space-y-2 rounded-full bg-card/60 backdrop-blur-md border border-border shadow-lg hidden md:flex'
        )}
      >
        {dockItems.map((item) => (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link href={item.href} legacyBehavior>
                <a
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-muted text-foreground/80 hover:text-foreground"
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
