import { VerifyIdentityView } from "@/components/dashboard/verify-identity-view";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Verify Identity - AstralCore",
    description: "Complete your identity verification to secure your account.",
};

export default function VerifyPage() {
    return (
        <VerifyIdentityView />
    );
}
