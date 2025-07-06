import { AdminPanel } from "@/components/admin/admin-panel";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Admin Panel - Astral Core",
    description: "Manage user wallets.",
};

export default function AdminPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/40 p-4">
      <AdminPanel />
    </main>
  );
}
