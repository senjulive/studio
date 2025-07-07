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
import {
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  MessageSquare,
  LineChart,
  Info
} from "lucide-react";
import { logout, getCurrentUserEmail } from "@/lib/auth";
import * as React from "react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { AstralLogo } from "@/components/icons/astral-logo";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground animate-in fade-in-50">
      <AstralLogo className="h-20 w-20 animate-pulse" />
      <p className="mt-4 text-lg font-semibold">Loading Your Dashboard</p>
      <p className="text-muted-foreground">Please wait a moment...</p>
    </div>
  );
}

const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [randomizedLabels, setRandomizedLabels] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  const menuItems = React.useMemo(() => [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/market", label: "Market", icon: LineChart },
    { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownLeft },
    { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowUpRight },
    { href: "/dashboard/squad", label: "Squad", icon: Users },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/support", label: "Support", icon: MessageSquare },
    { href: "/dashboard/about", label: "About", icon: Info },
  ], []);

  React.useEffect(() => {
    setUserEmail(getCurrentUserEmail());
    setIsClient(true);
    
    const newLabels: Record<string, string> = {};
    menuItems.forEach(item => {
      newLabels[item.href] = generateRandomString(8);
    });
    setRandomizedLabels(newLabels);
  }, [menuItems]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  const bottomNavItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/support", label: "Support", icon: MessageSquare },
    { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowUpRight },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  if (isInitializing) {
    return <DashboardLoading />;
  }
  
  const getPageTitle = () => {
    return randomizedLabels[pathname] || (pathname.split('/').pop()?.replace('-', ' ') || 'Home');
  };

  return (
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
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isClient ? pathname === item.href : false}>
                  <Link href={item.href}>
                    <item.icon />
                    {randomizedLabels[item.href] ? <span>{randomizedLabels[item.href]}</span> : <Skeleton className="h-4 w-20" />}
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
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
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
          <NotificationBell />
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
              <item.icon className="h-5 w-5" />
              {randomizedLabels[item.href] ? <span>{randomizedLabels[item.href]}</span> : <Skeleton className="h-3 w-10 mt-1" />}
            </Link>
          ))}
        </nav>
      </SidebarInset>
    </SidebarProvider>
  );
}
