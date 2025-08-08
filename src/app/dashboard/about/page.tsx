import { AboutView } from '@/components/dashboard/about-view';
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "About AstralCore - Grid Trading",
    description: "Learn about AstralCore and the principles of automated grid trading.",
};

export default function AboutPage() {
  return (
    <QuantumPageWrapper
      title="About AstralCore"
      description="Learn about AstralCore and automated grid trading"
    >
      <AboutView />
    </QuantumPageWrapper>
  );
}
