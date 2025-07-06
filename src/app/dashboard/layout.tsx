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
  Wallet,
  Settings,
  LogOut,
  User,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  Shield,
  MessageSquare,
  LineChart
} from "lucide-react";
import { logout, getCurrentUserEmail } from "@/lib/auth";
import * as React from "react";

const CryptoLogo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary"
  >
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 17L12 22L22 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12L12 17L22 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/market", label: "Market", icon: LineChart },
    { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownLeft },
    { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowUpRight },
    { href: "/dashboard/squad", label: "Squad", icon: Users },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/support", label: "Support", icon: MessageSquare },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <CryptoLogo />
            <span className="text-lg font-semibold text-sidebar-foreground">Astral Core</span>
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
             <h1 className="text-lg font-semibold md:text-2xl capitalize">{pathname.split('/').pop()?.replace('-', ' ')}</h1>
          </div>
        </header>
        <main
          className="relative flex-1 bg-cover bg-center"
          style={{ backgroundImage: "url('https://czbzm.wapaxo.com/filedownload/82572/pngwing-com-2-(czbzm.wapaxo.com).png')" }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 h-full p-4 md:p-6">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
