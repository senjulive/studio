
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  DepositIcon,
  MessageSquare,
  Gem,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const dockItems = [
  { href: '/dashboard/deposit', label: 'Deposit', icon: DepositIcon },
  { href: '/dashboard/chat', label: 'Public Chat', icon: MessageSquare },
  { href: '/dashboard/trading', label: 'Tiers & Ranks', icon: Gem },
  { href: '/dashboard/security', label: 'Settings', icon: Settings },
];

export function RightSideDock() {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const showDock = React.useCallback(() => {
    setIsVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 6000);
  }, []);

  const hideDock = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  React.useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0].clientX > window.innerWidth - 20) {
        showDock();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const dockEl = document.getElementById('right-side-dock');
      const handleEl = document.getElementById('right-side-handle');
      if (
        dockEl &&
        !dockEl.contains(e.target as Node) &&
        handleEl &&
        !handleEl.contains(e.target as Node)
      ) {
        hideDock();
      }
    };

    document.addEventListener('touchstart', handleTouch);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('click', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showDock]);

  return (
    <>
      <style jsx>{`
        .dock-icon {
          box-shadow: inset 2px 2px 2px rgba(255, 255, 255, 0.05),
            inset -2px -2px 2px rgba(0, 0, 0, 0.2),
            0 2px 2px rgba(0, 0, 0, 0.4);
        }
        .dock-icon:hover {
          transform: scale(1.3);
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
      <div
        id="right-side-handle"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 w-3 h-20 bg-card/50 hover:bg-card/80 rounded-l-full cursor-pointer transition-colors hidden md:block"
        onClick={showDock}
      ></div>

      <div
        id="right-side-dock"
        className={cn(
          'fixed right-3 top-1/2 -translate-y-1/2 z-50 h-[250px] w-14 rounded-3xl bg-card/60 backdrop-blur-md border border-border shadow-[0_2px_25px_rgba(0,0,0,0.5)] flex-col justify-evenly items-center p-3 transition-all duration-300 ease-in-out hidden md:flex',
          isVisible
            ? 'translate-x-0 opacity-100 pointer-events-auto'
            : 'translate-x-full opacity-0 pointer-events-none'
        )}
        onMouseEnter={showDock}
        onMouseLeave={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(hideDock, 500);
        }}
      >
        {dockItems.map((item) => (
          <Link href={item.href} key={item.href} legacyBehavior>
            <a
              className="dock-icon w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-xl bg-background/50 text-foreground"
              aria-label={item.label}
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
            </a>
          </Link>
        ))}
      </div>
    </>
  );
}
