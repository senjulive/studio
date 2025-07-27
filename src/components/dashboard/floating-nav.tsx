
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Home, Repeat, User } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { DepositIcon } from '@/components/icons/nav/deposit-icon';
import { ProfileIcon } from '@/components/icons/nav/profile-icon';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/trading', label: 'CORE', icon: Repeat },
  { href: '/dashboard/deposit', label: 'Deposit', icon: DepositIcon },
  { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon },
];

export function FloatingNav() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );

  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const xVal = event.clientX - rect.left;
    const xPct = xVal / width - 0.5;
    x.set(xPct * 100);
  };

  return (
    <div
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => x.set(0)}
    >
      <motion.div
        style={{
          rotate,
          translateX,
        }}
        className="flex items-end h-16 gap-4 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl"
      >
        {navItems.map((item, idx) => (
          <Link href={item.href} key={item.label}>
            <motion.div
              className="relative group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === idx && (
                <motion.span
                  layoutId="bubble"
                  className="absolute bottom-[125%] left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-white text-black rounded-md"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                >
                  {item.label}
                  <span className="absolute left-1/2 -translate-x-1/2 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-white" />
                </motion.span>
              )}
              <motion.div
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer"
              >
                <item.icon className="text-white h-5 w-5" />
              </motion.div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
