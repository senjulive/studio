import { PromotionsView } from '@/components/dashboard/promotions-view';
import { PromotionsPageAdmin } from '@/components/admin/promotions-page-admin';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Promotions - AstralCore",
    description: "Check out the latest promotions and special offers.",
};

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <PromotionsPageAdmin />
      <PromotionsView />
    </div>
  );
}
