
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { motion, useTransform, useSpring } from "framer-motion";
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
  let mouseX = React.useRef(0);

  const onMouseMove = (event: React.MouseEvent) => {
    mouseX.current = event.nativeEvent.x;
  };

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.current = event.clientX;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <nav 
      onMouseMove={onMouseMove}
      className="fixed top-1/2 -translate-y-1/2 right-4 z-40 hidden md:flex"
    >
      <TooltipProvider delayDuration={0}>
        <div 
          className="flex flex-col items-center gap-2 p-2 rounded-full bg-background/50 backdrop-blur-lg border shadow-lg"
        >
          {dockItems.map((item) => (
            <AppIcon key={item.href} mouseX={mouseX} item={item} pathname={pathname} />
          ))}
        </div>
      </TooltipProvider>
    </nav>
  );
}

function AppIcon({ item, pathname, mouseX }: { item: typeof dockItems[0], pathname: string, mouseX: React.MutableRefObject<number> }) {
  let ref = React.useRef<HTMLDivElement>(null);
  
  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthSync = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
  let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const isActive = pathname.endsWith(item.href);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={item.href}>
          <motion.div
            ref={ref}
            style={{ width }}
            className={cn(
              "flex items-center justify-center aspect-square rounded-full transition-colors relative",
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
}
