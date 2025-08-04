import { VerifyIdentityView } from "@/components/dashboard/verify-identity-view";
import { ProfilePageAdmin } from "@/components/admin/profile-page-admin";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "KYC Update - AstralCore",
    description: "Complete your KYC verification to secure your account.",
};

export default function VerifyPage() {
    return (
        <div className="space-y-6">
            <ProfilePageAdmin />
            <VerifyIdentityView />
        </div>
    );
}
