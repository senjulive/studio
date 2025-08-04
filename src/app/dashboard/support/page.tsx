import { SupportChat } from "@/components/dashboard/support-chat";
import { SupportPageAdmin } from "@/components/admin/support-page-admin";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Support - AstralCore",
    description: "Contact customer support.",
};

export default function SupportPage() {
    return (
        <div className="space-y-6">
            <SupportPageAdmin />
            <SupportChat />
        </div>
    );
}
