'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

// Simple layout for deployment without complex UI dependencies
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Home' },
    { href: '/dashboard/trading', label: 'Trading' },
    { href: '/dashboard/market', label: 'Market' },
    { href: '/dashboard/profile', label: 'Profile' },
    { href: '/dashboard/support', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">AstralCore</h1>
            <nav className="hidden md:flex space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Simple mobile nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t md:hidden">
        <div className="flex justify-around py-2">
          {menuItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 text-xs ${
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
