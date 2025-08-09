'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AstralLogo } from '@/components/icons/astral-logo';

// Import navigation icons
import { HomeIcon } from '@/components/icons/nav/home-icon';
import { MarketIcon } from '@/components/icons/nav/market-icon';
import { DepositIcon } from '@/components/icons/nav/deposit-icon';
import { WithdrawIcon } from '@/components/icons/nav/withdraw-icon';
import { SquadIcon } from '@/components/icons/nav/squad-icon';
import { ProfileIcon } from '@/components/icons/nav/profile-icon';
import { SupportIcon } from '@/components/icons/nav/support-icon';
import { AboutIcon } from '@/components/icons/nav/about-icon';
import { SettingsIcon } from '@/components/icons/nav/settings-icon';
import { InboxIcon } from '@/components/icons/nav/inbox-icon';
import { PromotionIcon } from '@/components/icons/nav/promotion-icon';
import { MessageSquare, UserPlus, Trophy } from 'lucide-react';

interface NavigationLayoutProps {
  children: ReactNode;
  showAuth?: boolean;
  userProfile?: {
    name?: string;
    email?: string;
    tier?: string;
    avatar?: string;
  };
}

export function AstralNavigation({ 
  children, 
  showAuth = true,
  userProfile = {
    name: 'AstralCore User',
    tier: 'Gold Ninja',
    avatar: 'AC'
  }
}: NavigationLayoutProps) {
  const pathname = usePathname();

  const sideNavItems = [
    {
      title: 'Overview',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
        { href: '/dashboard/market', label: 'Market', icon: MarketIcon },
        { href: '/dashboard/trading', label: 'CORE', icon: AstralLogo },
      ],
    },
    {
      title: 'Community',
      items: [
        { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
        { href: '/dashboard/squad', label: 'Squad', icon: SquadIcon },
        { href: '/dashboard/invite', label: 'Invite', icon: UserPlus },
        { href: '/dashboard/rewards', label: 'Rewards', icon: Trophy },
      ],
    },
    {
      title: 'Manage',
      items: [
        { href: '/dashboard/deposit', label: 'Deposit', icon: DepositIcon },
        { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon },
      ],
    },
    {
      title: 'Account',
      items: [
        { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon },
        { href: '/dashboard/security', label: 'Security', icon: SettingsIcon },
        { href: '/dashboard/inbox', label: 'Inbox', icon: InboxIcon },
      ],
    },
    {
      title: 'Platform',
      items: [
        { href: '/dashboard/promotions', label: 'Promotions', icon: PromotionIcon },
        { href: '/dashboard/trading-info', label: 'Tiers & Ranks', icon: Trophy },
        { href: '/dashboard/support', label: 'Support', icon: SupportIcon },
        { href: '/dashboard/about', label: 'About', icon: AboutIcon },
      ],
    },
  ];

  const bottomNavItems = [
    { href: '/dashboard', label: 'Home', icon: HomeIcon },
    { href: '/dashboard/support', label: 'Support', icon: SupportIcon },
    { href: '/dashboard/trading', label: 'CORE', icon: AstralLogo },
    { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon },
    { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href) || false;
  };

  return (
    <div className="container">
      <header className="qn-header">
        <div className="qn-logo">
          <AstralLogo className="h-8 w-8 mr-2" />
          AstralCore
        </div>
        {showAuth && (
          <div className="auth-buttons">
            <Link href="/login" className="qn-btn qn-btn-outline">Login</Link>
            <Link href="/register" className="qn-btn qn-btn-primary">Register</Link>
          </div>
        )}
      </header>

      <div className="qn-dashboard">
        <div className="qn-sidebar">
          <div className="qn-user-profile">
            <div className="qn-avatar">{userProfile.avatar}</div>
            <h3>{userProfile.name}</h3>
            <div className="qn-badge">{userProfile.tier}</div>
          </div>
          
          <nav className="qn-nav-menu">
            {sideNavItems.map((section) => (
              <div key={section.title}>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--qn-secondary)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  marginTop: '20px',
                  marginBottom: '10px',
                  letterSpacing: '0.5px'
                }}>
                  {section.title}
                </div>
                <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href} style={{marginBottom: '5px'}}>
                        <Link 
                          href={item.href} 
                          className={isActive(item.href) ? 'active' : ''}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px',
                            borderRadius: '6px',
                            color: 'var(--qn-light)',
                            textDecoration: 'none',
                            transition: 'all 0.3s',
                            ...(isActive(item.href) ? {
                              background: 'rgba(110, 0, 255, 0.2)',
                              color: 'var(--qn-secondary)'
                            } : {})
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive(item.href)) {
                              e.currentTarget.style.background = 'rgba(110, 0, 255, 0.1)';
                              e.currentTarget.style.color = 'var(--qn-secondary)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive(item.href)) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = 'var(--qn-light)';
                            }
                          }}
                        >
                          <Icon style={{marginRight: '10px', fontSize: '18px', width: '18px', height: '18px'}} />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="qn-main-content">
          {children}
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-t border-border/50 flex items-center justify-around z-10 md:hidden"
           style={{
             background: 'rgba(10, 10, 26, 0.9)',
             backdropFilter: 'blur(10px)',
             borderTop: '1px solid rgba(255, 255, 255, 0.1)'
           }}>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center h-full flex-1 text-xs transition-colors"
              style={{
                color: active ? 'var(--qn-secondary)' : 'var(--qn-light)',
                textDecoration: 'none'
              }}
            >
              <Icon 
                style={{
                  width: '20px',
                  height: '20px',
                  marginBottom: '2px',
                  color: active ? 'var(--qn-secondary)' : 'var(--qn-light)'
                }} 
              />
              <span style={{
                fontSize: '10px',
                color: active ? 'var(--qn-secondary)' : 'var(--qn-light)'
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
