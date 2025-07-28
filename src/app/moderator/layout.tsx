import { RouteGuard } from '@/components/auth/route-guard';

export default function ModeratorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RouteGuard allowedRoles={['moderator', 'admin']}>
            {children}
        </RouteGuard>
    );
}
