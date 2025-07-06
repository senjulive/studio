"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Wallet,
  Settings,
  LogOut,
  User,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  UserCog,
} from "lucide-react";
import { logout, getCurrentUserEmail } from "@/lib/auth";
import * as React from "react";


const CryptoLogo = () => (
    <svg width="32" height="32" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <style>{`
        .logo-a {
            font-family: 'Times New Roman', serif;
            font-size: 40px;
            font-weight: bold;
            fill: hsl(var(--primary));
            animation: logo-fade-in 1.5s ease-out;
            -webkit-animation: logo-fade-in 1.5s ease-out;
        }
        .logo-ring-1 {
            stroke: hsl(var(--accent));
            stroke-width: 1.5;
            fill: none;
            transform-origin: center;
            animation: logo-rotate-1 10s linear infinite;
            -webkit-animation: logo-rotate-1 10s linear infinite;
        }
        .logo-ring-2 {
            stroke: hsl(var(--primary));
            stroke-width: 1;
            fill: none;
            transform-origin: center;
            animation: logo-rotate-2 15s linear infinite reverse;
            -webkit-animation: logo-rotate-2 15s linear infinite reverse;
        }
        @keyframes logo-fade-in {
            from { opacity: 0; transform: translateY(10px) scale(0.9); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @-webkit-keyframes logo-fade-in {
            from { opacity: 0; -webkit-transform: translateY(10px) scale(0.9); }
            to { opacity: 1; -webkit-transform: translateY(0) scale(1); }
        }
        @keyframes logo-rotate-1 {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @-webkit-keyframes logo-rotate-1 {
            from { -webkit-transform: rotate(0deg); }
            to { -webkit-transform: rotate(360deg); }
        }
        @keyframes logo-rotate-2 {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @-webkit-keyframes logo-rotate-2 {
            from { -webkit-transform: rotate(0deg); }
            to { -webkit-transform: rotate(360deg); }
        }
    `}</style>
    <g className="logo-ring-1">
        <ellipse cx="25" cy="25" rx="23" ry="15" />
    </g>
    <g className="logo-ring-2">
        <ellipse cx="25" cy="25" rx="15" ry="23" />
    </g>
    <text x="25" y="36" textAnchor="middle" className="logo-a">
        A
    </text>
</svg>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUserEmail(getCurrentUserEmail());
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <CryptoLogo />
            <span className="text-lg font-semibold">Astral Core</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard">
                  <Wallet />
                  Wallets
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/deposit">
                  <ArrowDownLeft />
                  Deposit
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/withdraw">
                  <ArrowUpRight />
                  Withdraw
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/squad">
                  <Users />
                  Squad
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Settings />
                  Settings
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="profile picture" />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden text-left">
                  <p className="truncate text-sm font-medium">User</p>
                  <p className="truncate text-xs text-sidebar-foreground/70">
                    {userEmail || '...'}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail || '...'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                <Link href="/admin">
                    <UserCog className="mr-2 h-4 w-4" />
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
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
             <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
