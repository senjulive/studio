import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminAuth } from "@/components/admin/admin-auth";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "AstralCore AI - Admin Panel",
    description: "Manage the AstralCore Platform.",
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminAuth>
        <AdminPanel />
      </AdminAuth>
    </main>
  );
}
