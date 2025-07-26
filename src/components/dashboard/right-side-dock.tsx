
"use client";

import * as React from "react";
import Link from "next/link";
import { Banknote, MessageCircle, Trophy, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const dockIcons = [
  { href: "/dashboard/deposit", icon: <Banknote size={20} />, label: "Deposit" },
  { href: "/dashboard/chat", icon: <MessageCircle size={20} />, label: "Public Chat" },
  { href: "/dashboard/trading-info", icon: <Trophy size={20} />, label: "Tiers & Ranks" },
  { href: "/dashboard/security", icon: <Settings size={20} />, label: "Settings" },
];

export function RightSideDock() {
  const dockRef = React.useRef<HTMLDivElement>(null);
  const handleRef = React.useRef<HTMLDivElement>(null);
  const hideTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const hideDock = React.useCallback(() => {
    if (dockRef.current) {
      dockRef.current.style.transform = "translateX(100%)";
      dockRef.current.style.opacity = "0";
      dockRef.current.style.pointerEvents = "none";
    }
  }, []);

  const resetHideTimer = React.useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(hideDock, 6000);
  }, [hideDock]);

  const showDock = React.useCallback(() => {
    if (dockRef.current) {
      dockRef.current.style.transform = "translateX(0)";
      dockRef.current.style.opacity = "1";
      dockRef.current.style.pointerEvents = "auto";
      resetHideTimer();
    }
  }, [resetHideTimer]);
  
  React.useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (
        dockRef.current &&
        !dockRef.current.contains(e.target as Node) &&
        handleRef.current &&
        !handleRef.current.contains(e.target as Node)
      ) {
        hideDock();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0].clientX > window.innerWidth - 20) {
        showDock();
      }
    };
    
    document.addEventListener("click", handleGlobalClick);
    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
      document.removeEventListener("touchstart", handleTouchStart);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [hideDock, showDock]);

  return (
    <>
      <style jsx>{`
        .dock-icon:hover {
          transform: scale(1.3);
          background-color: rgba(255, 255, 255, 0.2);
        }

        #dock {
          transition: transform 0.4s ease, opacity 0.3s ease;
        }

        .dock-icon {
          box-shadow:
            inset 2px 2px 2px rgba(255,255,255,0.05),
            inset -2px -2px 2px rgba(0,0,0,0.2),
            0 2px 2px rgba(0,0,0,0.4);
        }
      `}</style>

      {/* Handle */}
      <div
        id="handle"
        ref={handleRef}
        onClick={showDock}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 w-3 h-20 bg-white/10 rounded-l-full cursor-pointer"
      ></div>

      {/* Floating Dock */}
      <div
        id="dock"
        ref={dockRef}
        className="fixed right-3 top-1/2 -translate-y-1/2 z-50 h-[250px] w-14 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_2px_25px_rgba(0,0,0,0.5)] flex flex-col justify-evenly items-center p-3 opacity-0 pointer-events-none translate-x-full"
      >
        {dockIcons.map((item) => (
          <Link href={item.href} key={item.href} passHref>
            <button
              aria-label={item.label}
              className="dock-icon w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-xl bg-white/10 text-white"
            >
              {item.icon}
            </button>
          </Link>
        ))}
      </div>
    </>
  );
}
