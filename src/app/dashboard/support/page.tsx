'use client';

import { SupportChat } from "@/components/dashboard/support-chat";
import { SupportPageAdmin } from "@/components/admin/support-page-admin";
import { useAdminStatus } from "@/hooks/use-admin-status";
import type { Metadata } from 'next';

export default function SupportPage() {
    const { isAdminOrModerator } = useAdminStatus();

    return (
        <div className="space-y-6">
            {isAdminOrModerator && <SupportPageAdmin />}
            <SupportChat />
        </div>
    );
}
