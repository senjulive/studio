import { AdminDashboardMobile } from "@/components/admin/admin-dashboard-mobile";
import { AdminAuth } from "@/components/admin/admin-auth";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "AstralCore AI - Admin Panel",
    description: "Manage the AstralCore Platform.",
};

export default function AdminPage() {
  return (
    <main className="min-h-dvh bg-background p-4">
      <AdminAuth>
        <AdminDashboardMobile />
      </AdminAuth>
    </main>
  );
}
