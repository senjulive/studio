
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

import { HomeIcon } from '../icons/nav/home-icon';
import { MarketIcon } from '../icons/nav/market-icon';
import { InboxIcon } from '../icons/nav/inbox-icon';
import { SquadIcon } from '../icons/nav/squad-icon';
import { AboutIcon } from '../icons/nav/about-icon';
import { SupportIcon } from '../icons/nav/support-icon';
import { SettingsIcon } from '../icons/nav/settings-icon';
import { MessageSquare, Gem, ArrowDownToLine } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/dashboard/market', label: 'Market', icon: MarketIcon },
  { href: '/dashboard/deposit', label: 'Deposit', icon: ArrowDownToLine },
  { href: '/dashboard/trading', label: 'Tiers & Ranks', icon: Gem },
  { href: '/dashboard/squad', label: 'My Squad', icon: SquadIcon },
  { href: '/dashboard/invite', label: 'Invite', icon: SquadIcon },
  { href: '/dashboard/chat', label: 'Public Chat', icon: MessageSquare },
  { href: '/dashboard/inbox', label: 'Inbox', icon: InboxIcon },
  { href: '/dashboard/about', label: 'About', icon: AboutIcon },
  { href: '/dashboard/support', label: 'Support', icon: SupportIcon },
  { href: '/dashboard/security', label: 'Security', icon: SettingsIcon },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <a>
                <item.icon />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
