'use client';

import { useEffect, useState } from 'react';

export function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = () => {
      const loggedInEmail = sessionStorage.getItem('loggedInEmail');
      setIsAdmin(loggedInEmail === 'admin@astralcore.io');
      setIsModerator(loggedInEmail === 'moderator@astralcore.io');
      setIsLoading(false);
    };

    checkAdminStatus();
  }, []);

  return {
    isAdmin,
    isModerator,
    isAdminOrModerator: isAdmin || isModerator,
    isLoading
  };
}
