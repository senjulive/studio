'use client';

export type ActionLog = {
  id: string;
  created_at: string;
  user_id: string;
  action: string;
  user: {username: string} | null;
};

export type ModeratorPermissions = {
  canDeleteMessages: boolean;
  canMuteUsers: boolean;
  canBanUsers: boolean;
  canViewLogs: boolean;
  canManageDeposits: boolean;
  canManageWithdrawals: boolean;
};

export type ModeratorStatus = {
  status: string;
  permissions: ModeratorPermissions;
};

class ModeratorStore {
  private readonly MODERATORS_KEY = 'astral-moderators';
  private readonly LOGS_KEY = 'astral-moderator-logs';

  constructor() {
    this.initializeDefaultModerators();
  }

  private initializeDefaultModerators() {
    if (typeof window === 'undefined') return;
    
    const existingModerators = this.getAllModerators();
    if (Object.keys(existingModerators).length === 0) {
      const defaultModerators = {
        'mod-001': {
          status: 'active',
          permissions: {
            canDeleteMessages: true,
            canMuteUsers: true,
            canBanUsers: false,
            canViewLogs: true,
            canManageDeposits: true,
            canManageWithdrawals: true,
          }
        },
        'admin-001': {
          status: 'active', 
          permissions: {
            canDeleteMessages: true,
            canMuteUsers: true,
            canBanUsers: true,
            canViewLogs: true,
            canManageDeposits: true,
            canManageWithdrawals: true,
          }
        }
      };

      this.saveModerators(defaultModerators);
    }
  }

  private getAllModerators(): Record<string, ModeratorStatus> {
    if (typeof window === 'undefined') return {};
    
    try {
      const stored = localStorage.getItem(this.MODERATORS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private saveModerators(moderators: Record<string, ModeratorStatus>): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.MODERATORS_KEY, JSON.stringify(moderators));
    } catch (error) {
      console.error('Failed to save moderators:', error);
    }
  }

  private getAllLogs(): ActionLog[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.LOGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveLogs(logs: ActionLog[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.LOGS_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  }

  public getModeratorStatus(userId: string): ModeratorStatus | null {
    const moderators = this.getAllModerators();
    return moderators[userId] || null;
  }

  public addModerator(userId: string, permissions: ModeratorPermissions): void {
    const moderators = this.getAllModerators();
    moderators[userId] = {
      status: 'active',
      permissions
    };
    this.saveModerators(moderators);
  }

  public removeModerator(userId: string): void {
    const moderators = this.getAllModerators();
    delete moderators[userId];
    this.saveModerators(moderators);
  }

  public updatePermissions(userId: string, permissions: ModeratorPermissions): void {
    const moderators = this.getAllModerators();
    if (moderators[userId]) {
      moderators[userId].permissions = permissions;
      this.saveModerators(moderators);
    }
  }

  public logAction(userId: string, action: string, username?: string): void {
    const logs = this.getAllLogs();
    const newLog: ActionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      user_id: userId,
      action,
      user: username ? { username } : null
    };

    logs.unshift(newLog); // Add to beginning
    
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.splice(1000);
    }

    this.saveLogs(logs);
  }

  public getActionLogs(limit = 50): ActionLog[] {
    const logs = this.getAllLogs();
    return logs.slice(0, limit);
  }

  public clearLogs(): void {
    this.saveLogs([]);
  }
}

const moderatorStore = new ModeratorStore();

// Export functions for backwards compatibility
export async function getModeratorStatus(userId: string): Promise<ModeratorStatus | null> {
  return moderatorStore.getModeratorStatus(userId);
}

export async function logModeratorAction(action: string, userId?: string): Promise<void> {
  const user_id = userId || 'unknown';
  moderatorStore.logAction(user_id, action);
}

export function addModerator(userId: string, permissions: ModeratorPermissions): void {
  moderatorStore.addModerator(userId, permissions);
}

export function removeModerator(userId: string): void {
  moderatorStore.removeModerator(userId);
}

export function updateModeratorPermissions(userId: string, permissions: ModeratorPermissions): void {
  moderatorStore.updatePermissions(userId, permissions);
}

export function getModeratorLogs(limit = 50): ActionLog[] {
  return moderatorStore.getActionLogs(limit);
}

export function clearModeratorLogs(): void {
  moderatorStore.clearLogs();
}
