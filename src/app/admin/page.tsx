import { AdminPanel } from "@/components/admin/admin-panel";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "AstralCore AI - Admin Panel",
    description: "Manage the AstralCore Platform.",
};

export default function AdminPage() {
  return (
    <main className="min-h-dvh bg-secondary p-4">
      <AdminPanel />
    </main>
  );
}
