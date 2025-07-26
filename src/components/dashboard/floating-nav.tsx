
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HomeIcon } from '@/components/icons/nav/home-icon';
import { SupportIcon } from '@/components/icons/nav/support-icon';
import { AstralLogo } from '@/components/icons/astral-logo';
import { WithdrawIcon } from '@/components/icons/nav/withdraw-icon';
import { ProfileIcon } from '@/components/icons/nav/profile-icon';
import { ChevronLeft } from "lucide-react";

const dockItems = [
  { href: '/dashboard', label: 'Home', icon: HomeIcon },
  { href: '/dashboard/support', label: 'Support', icon: SupportIcon },
  { href: '/dashboard/trading', label: 'CORE', icon: AstralLogo },
  { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon },
  { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon },
];

export function FloatingNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const mouseX = useMotionValue(Infinity);
  let timeoutId: NodeJS.Timeout;

  React.useEffect(() => {
    setIsClient(true);
    
    const handleActivity = () => {
      setIsOpen(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsOpen(false), 6000);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    handleActivity();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearTimeout(timeoutId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isClient) return null;

  return (
    <>
        <AnimatePresence>
        {isOpen && (
            <motion.nav
            initial={{x: "120%"}}
            animate={{x: "0%"}}
            exit={{x: "120%"}}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="fixed top-1/2 -translate-y-1/2 right-4 z-40 hidden md:flex"
            >
            <TooltipProvider delayDuration={0}>
                <div className="flex flex-col items-center gap-2 p-2 rounded-full bg-card/50 backdrop-blur-lg border shadow-lg h-[280px]">
                {dockItems.map((item) => (
                    <AppIcon key={item.href} mouseX={mouseX} item={item} />
                ))}
                </div>
            </TooltipProvider>
            </motion.nav>
        )}
        </AnimatePresence>

        <motion.div
            className="fixed top-1/2 -translate-y-1/2 right-0 z-40 hidden md:flex"
            initial={{x: "0%"}}
            animate={{x: isOpen ? "100%" : "0%"}}
            transition={{delay: 0.5}}
        >
            <button
                onClick={() => setIsOpen(true)}
                className="h-10 w-2 bg-card/50 backdrop-blur-lg border-l-0 border rounded-l-md flex items-center justify-center text-muted-foreground hover:bg-card/80"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
        </motion.div>
    </>
  );
}

function AppIcon({ item, mouseX }: { item: typeof dockItems[0], mouseX: any }) {
  const pathname = usePathname();
  let ref = React.useRef<HTMLDivElement>(null);
  
  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  let scale = useTransform(distance, [-150, 0, 150], [1, 1.5, 1]);
  let widthSync = useSpring(scale, { mass: 0.1, stiffness: 150, damping: 12 });

  const isActive = pathname.endsWith(item.href);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={item.href}>
          <motion.div
            ref={ref}
            style={{ scale: widthSync }}
            className={cn(
              "flex items-center justify-center aspect-square rounded-full transition-colors relative w-9 h-9",
              isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5", item.label === 'CORE' && 'p-0.5')} />
          </motion.div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>{item.label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
