
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/sidebar";
import { logout, getCurrentUser } from "@/lib/auth";
import * as React from "react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { AstralLogo } from "@/components/icons/astral-logo";
import { Skeleton } from "@/components/ui/skeleton";

import { HomeIcon } from "@/components/icons/nav/home-icon";
import { MarketIcon } from "@/components/icons/nav/market-icon";
import { DepositIcon } from "@/components/icons/nav/deposit-icon";
import { WithdrawIcon } from "@/components/icons/nav/withdraw-icon";
import { SquadIcon } from "@/components/icons/nav/squad-icon";
import { ProfileIcon } from "@/components/icons/nav/profile-icon";
import { SupportIcon } from "@/components/icons/nav/support-icon";
import { AboutIcon } from "@/components/icons/nav/about-icon";
import { DownloadIcon } from "@/components/icons/nav/download-icon";
import { SettingsIcon } from "@/components/icons/nav/settings-icon";
import { LogoutIcon } from "@/components/icons/nav/logout-icon";
import { InboxIcon } from "@/components/icons/nav/inbox-icon";
import { UserPlus, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { User } from '@supabase/supabase-js';

// Create a context to hold the user data
const UserContext = React.createContext<{ user: User | null }>({ user: null });

// Custom hook to use the UserContext
export const useUser = () => React.useContext(UserContext);


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
  const [user, setUser] = React.useState<User | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [downloadHref, setDownloadHref] = React.useState("");

  React.useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsInitializing(false);
      } else {
        router.push('/');
      }
    };
    checkUser();
  }, [router]);


  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const fileContent = `[InternetShortcut]\nURL=${window.location.origin}`;
      const dataUri = `data:text/plain;charset=utf-8,${encodeURIComponent(
        fileContent
      )}`;
      setDownloadHref(dataUri);
    }
  }, []);

  const menuItems = [
    { href: "/dashboard", label: "Home", icon: HomeIcon },
    { href: "/dashboard/market", label: "Market", icon: MarketIcon },
    { href: "/dashboard/trading", label: "Trading", icon: Repeat },
    { href: "/dashboard/deposit", label: "Deposit", icon: DepositIcon },
    { href: "/dashboard/withdraw", label: "Withdraw", icon: WithdrawIcon },
    { href: "/dashboard/squad", label: "Squad", icon: SquadIcon },
    { href: "/dashboard/invite", label: "Invite", icon: UserPlus },
    { href: "/dashboard/profile", label: "Profile", icon: ProfileIcon },
    { href: "/dashboard/inbox", label: "Inbox", icon: InboxIcon },
    { href: "/dashboard/support", label: "Support", icon: SupportIcon },
    { href: "/dashboard/about", label: "About", icon: AboutIcon },
    {
      href: downloadHref,
      label: "Download App",
      icon: DownloadIcon,
      download: "AstralCore.url",
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  
  const userEmail = user?.email;
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  const bottomNavItems = [
    { href: "/dashboard", label: "Home", icon: HomeIcon },
    { href: "/dashboard/inbox", label: "Inbox", icon: InboxIcon },
    { href: "/dashboard/withdraw", label: "Withdraw", icon: WithdrawIcon },
    { href: "/dashboard/profile", label: "Profile", icon: ProfileIcon },
  ];

  if (isInitializing) {
    return <DashboardLoading />;
  }
  
  const getPageTitle = () => {
    if (pathname === '/dashboard/trading') return 'Astral Core Trading';
    const currentItem = menuItems.find(item => item.href === pathname);
    return currentItem ? currentItem.label : (pathname.split('/').pop()?.replace('-', ' ') || 'Home');
  };
  
  const isClient = !isInitializing;

  return (
    <UserContext.Provider value={{ user }}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <AstralLogo className="h-8 w-8" />
              <span className="text-lg font-semibold text-sidebar-foreground">AstralCore</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={isClient ? pathname === item.href && !item.download : false}>
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
                    <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="abstract user" alt="@user" />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden text-left">
                    <p className="truncate text-sm font-medium text-sidebar-foreground">User</p>
                    <p className="truncate text-xs text-sidebar-foreground/70">
                      {userEmail || '...'}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail || '...'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <ProfileIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogoutIcon className="mr-2 h-4 w-4" />
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
                  <InboxIcon className="h-5 w-5" />
                  <span className="sr-only">Inbox</span>
                </Link>
              </Button>
              <NotificationBell />
            </div>
          </header>
          <main className="flex-1 bg-secondary p-4 md:p-6 pb-20">
              {children}
          </main>
          <nav className="absolute bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around z-10">
            {bottomNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-colors",
                  isClient && pathname === item.href
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </SidebarInset>
      </SidebarProvider>
    </UserContext.Provider>
  );
}
