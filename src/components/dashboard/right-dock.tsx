
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

import { HomeIcon } from '@/components/icons/nav/home-icon';
import { SupportIcon } from '@/components/icons/nav/support-icon';
import { AstralLogo } from '@/components/icons/astral-logo';
import { WithdrawIcon } from '@/components/icons/nav/withdraw-icon';
import { ProfileIcon } from '@/components/icons/nav/profile-icon';

const dockItems = [
  { href: '/dashboard', label: 'Home', icon: HomeIcon },
  { href: '/dashboard/support', label: 'Support', icon: SupportIcon },
  { href: '/dashboard/trading', label: 'CORE', icon: AstralLogo },
  { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon },
  { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon },
];

export function RightDock() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="secondary"
          className="fixed top-1/2 -translate-y-1/2 right-0 z-40 h-16 w-6 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
            <ChevronLeft className="h-4 w-4 transition-transform duration-300" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-24 bg-background/80 backdrop-blur-xl border-l p-0 flex flex-col items-center justify-center gap-2">
        <TooltipProvider delayDuration={0}>
          {dockItems.map((item) => {
            const isActive = pathname.endsWith(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex flex-col items-center justify-center h-20 w-20 rounded-lg transition-colors relative",
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("h-8 w-8", item.label === 'CORE' && 'p-1')} />
                      <span className="text-xs mt-1">{item.label}</span>
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}
