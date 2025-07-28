
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { AstralLogo } from '@/components/icons/astral-logo';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';
import { usePathname } from 'next/navigation';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { logout } from '@/lib/auth';
import { useRouter }from 'next/navigation';
import { FloatingNav } from '@/components/dashboard/floating-nav';
import { FloatingChat } from '@/components/dashboard/floating-chat';
import { RightSideDock } from '@/components/dashboard/right-side-dock';

function UserProfileDropdown() {
    const { user } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };
    
    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                    <p className="text-sm font-medium">{(user as any).username || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/dashboard/profile"><UserIcon className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/dashboard/security"><Settings className="mr-2 h-4 w-4" />Settings</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/dashboard/chat') {
    return (
      <div className="flex h-dvh">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <Link href="/dashboard" className="flex items-center gap-2">
                <AstralLogo />
                <span className="font-semibold text-lg">AstralCore</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarNav />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-dvh">
        <Sidebar>
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-2">
              <AstralLogo />
              <span className="font-semibold text-lg">AstralCore</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter className="flex items-center gap-2">
            <UserProfileDropdown />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 sticky top-0 z-30">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              {/* Header content like breadcrumbs can go here */}
            </div>
            <NotificationBell />
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
        <FloatingNav />
        <FloatingChat />
        <RightSideDock />
      </div>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </UserProvider>
    )
}
