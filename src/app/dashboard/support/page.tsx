import { SupportChat } from "@/components/dashboard/support-chat";
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Support - AstralCore",
    description: "Contact customer support.",
};

export default function SupportPage() {
    return (
        <QuantumPageWrapper
            title="Customer Support"
            description="Get help from our support team"
        >
            <SupportChat />
        </QuantumPageWrapper>
    );
}
