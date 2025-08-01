import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminAuth } from "@/components/admin/admin-auth";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "AstralCore AI - Admin Panel",
    description: "Manage the AstralCore Platform.",
};

export default function AdminPage() {
  return (
    <AdminAuth>
      <AdminPanel />
    </AdminAuth>
  );
}
