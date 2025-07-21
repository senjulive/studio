
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { logout } from '@/lib/auth';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { AstralLogo } from '@/components/icons/astral-logo';
import { Skeleton } from '@/components/ui/skeleton';

import { 
    UserPlus, 
    Repeat, 
    Megaphone, 
    Shield, 
    Home, 
    LineChart, 
    Users, 
    User, 
    Wallet, 
    ArrowLeftRight, 
    HeartHandshake, 
    Info, 
    Download, 
    Settings, 
    LogOut, 
    Inbox 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProvider } from '@/contexts/UserContext';
import { getOrCreateWallet, type WalletData } from '@/lib/wallet';

// Mock user object
const mockUser = {
  id: 'mock-user-123',
  email: 'user@example.com',
};

function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground animate-in fade-in-50">
      <AstralLogo className="h-20 w-20 animate-pulse" />
      <p className="mt-4 text-lg font-semibold">Loading Your Dashboard</p>
      <p className="text-muted-foreground">Please wait a moment...</p>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<any | null>(null);
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isModerator, setIsModerator] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [downloadHref, setDownloadHref] = React.useState('');

  React.useEffect(() => {
    const initializeUser = async () => {
        const loggedInEmail = sessionStorage.getItem('loggedInEmail') || mockUser.email;
        const currentUser = { ...mockUser, email: loggedInEmail };
        
        setUser(currentUser);
        setIsAdmin(loggedInEmail === 'admin@astralcore.io');
        setIsModerator(loggedInEmail === 'moderator@astralcore.io');

        if (currentUser.id) {
          const walletData = await getOrCreateWallet(currentUser.id);
          setWallet(walletData);
        }
        
        setIsInitializing(false);
    };
    
    initializeUser();
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const fileContent = `[InternetShortcut]\nURL=${window.location.origin}`;
      const dataUri = `data:text/plain;charset=utf-8,${encodeURIComponent(
        fileContent
      )}`;
      setDownloadHref(dataUri);
    }
  }, []);

  const baseMenuItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/dashboard/market', label: 'Market', icon: LineChart },
    { href: '/dashboard/trading', label: 'Trading', icon: Repeat },
    { href: '/dashboard/deposit', label: 'Deposit', icon: Wallet },
    { href: '/dashboard/withdraw', label: 'Withdraw', icon: ArrowLeftRight },
    { href: '/dashboard/squad', label: 'Squad', icon: Users },
    { href: '/dashboard/invite', label: 'Invite', icon: UserPlus },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/promotions', label: 'Promotions', icon: Megaphone },
    { href: '/dashboard/inbox', label: 'Inbox', icon: Inbox },
    { href: '/dashboard/support', label: 'Support', icon: HeartHandshake },
    { href: '/dashboard/about', label: 'About', icon: Info },
  ];
  
  if (isAdmin) {
    baseMenuItems.push({ href: '/admin', label: 'Admin Panel', icon: Shield });
  }
  if (isModerator) {
    baseMenuItems.push({ href: '/moderator', label: 'Moderator Panel', icon: Shield });
  }


  const menuItems = [
      ...baseMenuItems,
      {
        href: downloadHref,
        label: 'Download App',
        icon: Download,
        download: 'AstralCore.url',
      },
  ]

  const handleLogout = async () => {
    sessionStorage.removeItem('loggedInEmail');
    await logout();
    router.push('/');
  };

  const userEmail = user?.email;
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  const bottomNavItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/dashboard/market', label: 'Market', icon: LineChart },
    { href: '/dashboard/trading', label: 'Trading', icon: Repeat },
    { href: '/dashboard/squad', label: 'Squad', icon: Users },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  if (isInitializing) {
    return <DashboardLoading />;
  }

  const getPageTitle = () => {
    if (pathname === '/dashboard/trading') return 'Astral Core Trading';
    const currentItem = menuItems.find((item) => item.href === pathname);
    return currentItem
      ? currentItem.label
      : pathname.split('/').pop()?.replace('-', ' ') || 'Home';
  };

  const isClient = typeof window !== 'undefined';
  const avatarUrl = wallet?.profile?.avatarUrl;

  return (
    <UserProvider value={{ user: user as any }}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <AstralLogo className="h-8 w-8" />
              <span className="text-lg font-semibold text-sidebar-foreground">
                AstralCore
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      isClient ? pathname === item.href && !item.download : false
                    }
                  >
                    <Link href={item.href} download={item.download}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent/50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={avatarUrl}
                      alt="@user"
                    />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden text-left">
                    <p className="truncate text-sm font-medium text-sidebar-foreground">
                      User
                    </p>
                    <p className="truncate text-xs text-sidebar-foreground/70">
                      {userEmail || '...'}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      User
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail || '...'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/security">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <h1 className="flex items-center gap-2 text-lg font-semibold md:text-2xl capitalize">
                <AstralLogo className="h-6 w-6" />
                {isClient ? (
                  <span>{getPageTitle()}</span>
                ) : (
                  <Skeleton className="h-6 w-24" />
                )}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <Link href="/dashboard/inbox">
                  <Inbox className="h-5 w-5" />
                  <span className="sr-only">Inbox</span>
                </Link>
              </Button>
              <NotificationBell />
            </div>
          </header>
          <main className="flex-1 bg-secondary p-4 md:p-6 pb-20">
            {children}
          </main>
          <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around z-10 md:hidden">
            {bottomNavItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-colors relative',
                  isClient && pathname === item.href
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label === 'Trading' ? (
                  <div className="absolute -top-6 flex items-center justify-center">
                     <div className="h-14 w-14 rounded-full bg-background flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                           <item.icon className="h-6 w-6" />
                        </div>
                     </div>
                  </div>
                ) : (
                  <item.icon className="h-6 w-6" />
                )}
                
                <span className={cn(item.label === 'Trading' && 'mt-10')}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
