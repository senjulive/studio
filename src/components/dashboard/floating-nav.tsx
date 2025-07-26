
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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

export function FloatingNav() {
  const pathname = usePathname();
  const [hovered, setHovered] = React.useState(false);

  return (
    <nav 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed top-1/2 -translate-y-1/2 right-4 z-40 hidden md:flex"
    >
      <TooltipProvider delayDuration={0}>
        <motion.div 
          className="flex flex-col items-center gap-2 p-2 rounded-full bg-background/50 backdrop-blur-lg border shadow-lg"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.5 }}
        >
          {dockItems.map((item, index) => {
            const isActive = pathname.endsWith(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{ scale: hovered ? 1 : 0.9, y: hovered ? index * -2 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={cn(
                        "flex items-center justify-center h-12 w-12 rounded-full transition-colors relative",
                        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("h-7 w-7", item.label === 'CORE' && 'p-0.5')} />
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </motion.div>
      </TooltipProvider>
    </nav>
  );
}
