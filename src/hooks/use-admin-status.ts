'use client';

import { useEffect, useState } from 'react';

type ModeratorPermission =
  | 'chat_moderation'
  | 'support_management'
  | 'profile_verification'
  | 'promotions_management'
  | 'user_management'
  | 'content_moderation';

type Moderator = {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  permissions: ModeratorPermission[];
  assignedBy: string;
  assignedAt: string;
  lastActive: string;
};

export function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [moderatorPermissions, setModeratorPermissions] = useState<ModeratorPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = () => {
      const loggedInEmail = sessionStorage.getItem('loggedInEmail');
      const isAdminUser = loggedInEmail === 'admin@astralcore.io';
      const isModeratorUser = loggedInEmail === 'moderator@astralcore.io';

      setIsAdmin(isAdminUser);
      setIsModerator(isModeratorUser);

      // Check moderator permissions if user is a moderator
      if (isModeratorUser && !isAdminUser) {
        try {
          const savedPermissions = localStorage.getItem('moderatorPermissions');
          if (savedPermissions) {
            const moderators: Moderator[] = JSON.parse(savedPermissions);
            const currentModerator = moderators.find(
              mod => mod.email === loggedInEmail && mod.isActive
            );
            if (currentModerator) {
              setModeratorPermissions(currentModerator.permissions);
            }
          }
        } catch (error) {
          console.error('Failed to load moderator permissions:', error);
        }
      }

      setIsLoading(false);
    };

    checkAdminStatus();
  }, []);

  const hasPermission = (permission: ModeratorPermission): boolean => {
    return isAdmin || moderatorPermissions.includes(permission);
  };

  return {
    isAdmin,
    isModerator,
    isAdminOrModerator: isAdmin || isModerator,
    moderatorPermissions,
    hasPermission,
    isLoading,
    // Specific permission checks for common use cases
    canModerateChat: hasPermission('chat_moderation'),
    canManageSupport: hasPermission('support_management'),
    canVerifyProfiles: hasPermission('profile_verification'),
    canManagePromotions: hasPermission('promotions_management'),
    canManageUsers: hasPermission('user_management'),
    canModerateContent: hasPermission('content_moderation')
  };
}
