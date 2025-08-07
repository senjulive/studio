import { FuturisticLoading } from '@/components/ui/futuristic-loading';

export default function Loading() {
  return (
    <FuturisticLoading 
      message="Loading AstralCore..." 
      showProgress={true}
    />
  );
}
