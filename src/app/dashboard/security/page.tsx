import { SecurityView } from "@/components/dashboard/security-view";
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Security - AstralCore",
    description: "Manage your account security settings, including your withdrawal password.",
};

export default function SecurityPage() {
    return (
        <QuantumPageWrapper
            title="Security Settings"
            description="Manage your account security and withdrawal password"
        >
            <SecurityView />
        </QuantumPageWrapper>
    );
}
