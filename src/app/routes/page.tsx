import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RoutesIndexPage() {
  const pages = [
    { href: "/", label: "Home" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
    { href: "/forgot-password", label: "Forgot Password" },
  ];

  const dashboard = [
    { href: "/dashboard", label: "Dashboard Home" },
    { href: "/dashboard/market", label: "Market" },
    { href: "/dashboard/deposit", label: "Deposit" },
    { href: "/dashboard/withdraw", label: "Withdraw" },
    { href: "/dashboard/inbox", label: "Inbox" },
    { href: "/dashboard/invite", label: "Invite" },
    { href: "/dashboard/promotions", label: "Promotions" },
    { href: "/dashboard/about", label: "About" },
    { href: "/dashboard/chat", label: "Public Chat" },
    { href: "/dashboard/trading", label: "Trading (CORE)" },
    { href: "/dashboard/trading-info", label: "Tiers & Ranks" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/profile/verify", label: "Verify Identity" },
    { href: "/dashboard/security", label: "Security" },
    { href: "/dashboard/squad", label: "Squad" },
  ];

  const admin = [
    { href: "/admin", label: "Admin Panel" },
    { href: "/moderator", label: "Moderator Panel" },
  ];

  const cms = [{ href: "/cms", label: "CMS (catch-all)" }];

  const qa = [
    { href: "/routes", label: "Routes Index (this page)" },
    { href: "/qa/smoke", label: "Smoke Test" },
  ];

  const apis = [
    { href: "/api/health", label: "GET /api/health" },
    { href: "/api/db/health", label: "GET /api/db/health" },
    { href: "/api/app-data", label: "GET /api/app-data" },
    { href: "/api/public-settings?key=botTierSettings", label: "GET /api/public-settings?key=botTierSettings" },
    { href: "/api/chat/public", label: "GET /api/chat/public" },
    // Feature-flagged:
    { href: "/api/market-summary", label: "POST /api/market-summary (flagged)", flagged: true },
    { href: "/api/support-agent", label: "POST /api/support-agent (flagged)", flagged: true },
  ];

  const Section = ({ title, description, items }: { title: string; description?: string; items: { href: string; label: string; flagged?: boolean }[] }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <Button key={item.href + item.label} variant="outline" asChild>
            <Link href={item.href} prefetch={false}>
              {item.label} {item.flagged ? "(disabled by default)" : ""}
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <main className="container mx-auto max-w-6xl p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Routes Index</h1>
      <p className="text-muted-foreground">Quick QA navigation to primary pages and APIs.</p>

      <div className="space-y-6">
        <Section title="Pages" items={pages} />
        <Section title="Dashboard" items={dashboard} />
        <Section title="Admin & Moderator" items={admin} />
        <Section title="CMS" items={cms} />
        <Section title="QA" items={qa} />
        <Section
          title="APIs"
          description="Feature-flagged routes return 503 unless enabled."
          items={apis}
        />
      </div>
    </main>
  );
}