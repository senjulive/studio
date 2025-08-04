'use client';

import { PromotionsView } from '@/components/dashboard/promotions-view';
import { PromotionsPageAdmin } from '@/components/admin/promotions-page-admin';
import { useAdminStatus } from '@/hooks/use-admin-status';
import type { Metadata } from 'next';

export default function PromotionsPage() {
  const { isAdmin } = useAdminStatus();

  return (
    <div className="space-y-6">
      {isAdmin && <PromotionsPageAdmin />}
      <PromotionsView />
    </div>
  );
}
