
"use client"

import * as React from "react";
import { Home, MessageSquare, User, Settings, ArrowUpFromLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { HomeIcon } from '@/components/icons/nav/home-icon';
import { SupportIcon } from '@/components/icons/nav/support-icon';
import { AstralLogo } from '@/components/icons/astral-logo';
import { WithdrawIcon } from '@/components/icons/nav/withdraw-icon';
import { ProfileIcon } from '@/components/icons/nav/profile-icon';

const icons = [
  { href: '/dashboard', icon: HomeIcon, label: "Home" },
  { href: '/dashboard/support', icon: SupportIcon, label: "Support" },
  { href: '/dashboard/trading', icon: AstralLogo, label: "CORE" },
  { href: '/dashboard/withdraw', icon: WithdrawIcon, label: "Withdraw" },
  { href: '/dashboard/profile', icon: ProfileIcon, label: "Profile" },
];

export function FloatingNav() {
  const [visible, setVisible] = React.useState(true);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const showDock = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(true);
    timeoutRef.current = setTimeout(() => setVisible(false), 6000);
  }, []);

  React.useEffect(() => {
    showDock();
    
    const handleInteraction = () => showDock();

    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0].clientX > window.innerWidth - 40) { // 40px swipe area
        showDock();
      }
    };

    window.addEventListener("touchstart", handleTouch);
    window.addEventListener("mousemove", handleInteraction);

    return () => {
        window.removeEventListener("touchstart", handleTouch);
        window.removeEventListener("mousemove", handleInteraction);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
  }, [showDock]);

  return (
    <div className="hidden md:block">
        <AnimatePresence>
        {visible && (
            <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed right-2 top-1/2 -translate-y-1/2 h-[300px] w-14 bg-card/10 backdrop-blur-md border border-white/20 rounded-full shadow-xl flex flex-col justify-around items-center p-2 z-50"
            >
            <TooltipProvider delayDuration={0}>
                {icons.map(({ href, icon: Icon, label }, i) => {
                    const isActive = pathname.endsWith(href);
                    return (
                        <Tooltip key={i}>
                            <TooltipTrigger asChild>
                                <Link href={href} passHref>
                                    <motion.button
                                    whileTap={{ scale: 1.3 }}
                                    whileHover={{ scale: 1.2 }}
                                    className={cn(
                                        "p-2 rounded-full transition-colors",
                                        isActive ? "bg-primary/80 text-primary-foreground" : "bg-white/10 hover:bg-white/20 text-foreground"
                                    )}
                                    aria-label={label}
                                    >
                                    <Icon className={cn("h-6 w-6", label === 'CORE' && 'p-0.5')} />
                                    </motion.button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>{label}</p>
                            </TooltipContent>
                        </Tooltip>
                    )
                })}
            </TooltipProvider>
            </motion.div>
        )}
        </AnimatePresence>
        <div 
          className="fixed right-0 top-0 h-full w-4 z-40" 
          aria-hidden="true" 
          onMouseEnter={showDock}
        />
    </div>
  );
}
