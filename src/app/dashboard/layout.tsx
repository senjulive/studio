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
  WalletCards,
  Settings,
  LogOut,
  User,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  Shield,
  MessageSquare,
  LineChart,
  Bell,
  Info
} from "lucide-react";
import { logout, getCurrentUserEmail } from "@/lib/auth";
import * as React from "react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { AstralLogo } from "@/components/icons/astral-logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUserEmail(getCurrentUserEmail());
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  const menuItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/market", label: "Market", icon: LineChart },
    { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownLeft },
    { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowUpRight },
    { href: "/dashboard/squad", label: "Squad", icon: Users },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/support", label: "Support", icon: MessageSquare },
    { href: "/dashboard/about", label: "About", icon: Info },
  ];

  const bottomNavItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/support", label: "Support", icon: MessageSquare },
    { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowUpRight },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

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
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon />
                    {item.label}
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
               <DropdownMenuItem asChild>
                <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                </Link>
              </DropdownMenuItem>
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
                <span>{pathname === '/dashboard' ? 'Home' : pathname.split('/').pop()?.replace('-', ' ')}</span>
            </h1>
          </div>
          <NotificationBell />
        </header>
        <main className="flex-1 bg-gradient-to-b from-purple-100 via-blue-100 to-background p-4 md:p-6 pb-20">
            {children}
        </main>
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around z-10">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-colors",
                pathname === item.href
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </SidebarInset>
    </SidebarProvider>
  );
}
