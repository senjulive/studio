import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminAuth } from "@/components/admin/admin-auth";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Admin Panel - Astral Core",
    description: "Manage user wallets.",
};

export default function AdminPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-secondary p-4">
      <AdminAuth>
        <AdminPanel />
      </AdminAuth>
    </main>
  );
}
