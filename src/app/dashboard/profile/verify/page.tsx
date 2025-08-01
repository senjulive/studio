import { VerifyIdentityView } from "@/components/dashboard/verify-identity-view";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "KYC Update - AstralCore",
    description: "Complete your KYC verification to secure your account.",
};

export default function VerifyPage() {
    return (
        <VerifyIdentityView />
    );
}
