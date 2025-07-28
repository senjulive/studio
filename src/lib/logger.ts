'use client';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  category: string;
  userId?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly LOGS_KEY = 'astral-logs';
  private readonly MAX_LOGS = 1000;

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.LOGS_KEY);
      this.logs = stored ? JSON.parse(stored) : [];
    } catch {
      this.logs = [];
    }
  }

  private saveLogs() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.LOGS_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  }

  private addLog(level: LogLevel, message: string, category: string, userId?: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      category,
      userId,
      metadata
    };

    this.logs.unshift(entry);

    // Keep only the latest logs
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    this.saveLogs();

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      const logMethod = level === 'error' ? console.error : 
                      level === 'warn' ? console.warn : 
                      level === 'info' ? console.info : console.log;
      
      logMethod(`[${category.toUpperCase()}] ${message}`, metadata || '');
    }
  }

  debug(message: string, category: string = 'general', userId?: string, metadata?: Record<string, any>) {
    this.addLog('debug', message, category, userId, metadata);
  }

  info(message: string, category: string = 'general', userId?: string, metadata?: Record<string, any>) {
    this.addLog('info', message, category, userId, metadata);
  }

  warn(message: string, category: string = 'general', userId?: string, metadata?: Record<string, any>) {
    this.addLog('warn', message, category, userId, metadata);
  }

  error(message: string, category: string = 'general', userId?: string, metadata?: Record<string, any>) {
    this.addLog('error', message, category, userId, metadata);
  }

  // Specific logging methods for common use cases
  auth(action: string, email: string, success: boolean, metadata?: Record<string, any>) {
    const level = success ? 'info' : 'warn';
    this.addLog(level, `Auth ${action}: ${email}`, 'auth', undefined, { 
      success, 
      action, 
      email,
      ...metadata 
    });
  }

  trading(action: string, userId: string, botId?: string, metadata?: Record<string, any>) {
    this.addLog('info', `Trading ${action}`, 'trading', userId, { 
      action, 
      botId,
      ...metadata 
    });
  }

  wallet(action: string, userId: string, asset?: string, amount?: number, metadata?: Record<string, any>) {
    this.addLog('info', `Wallet ${action}`, 'wallet', userId, { 
      action, 
      asset, 
      amount,
      ...metadata 
    });
  }

  admin(action: string, adminId: string, targetId?: string, metadata?: Record<string, any>) {
    this.addLog('info', `Admin ${action}`, 'admin', adminId, { 
      action, 
      targetId,
      ...metadata 
    });
  }

  security(event: string, userId?: string, metadata?: Record<string, any>) {
    this.addLog('warn', `Security event: ${event}`, 'security', userId, metadata);
  }

  // Utility methods
  getLogs(level?: LogLevel, category?: string, limit = 100): LogEntry[] {
    let filtered = this.logs;

    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }

    if (category) {
      filtered = filtered.filter(log => log.category === category);
    }

    return filtered.slice(0, limit);
  }

  clearLogs(category?: string) {
    if (category) {
      this.logs = this.logs.filter(log => log.category !== category);
    } else {
      this.logs = [];
    }
    this.saveLogs();
  }

  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['ID', 'Timestamp', 'Level', 'Category', 'Message', 'User ID', 'Metadata'];
      const rows = this.logs.map(log => [
        log.id,
        log.timestamp,
        log.level,
        log.category,
        log.message,
        log.userId || '',
        JSON.stringify(log.metadata || {})
      ]);
      
      return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

    return JSON.stringify(this.logs, null, 2);
  }

  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<LogLevel, number>,
      byCategory: {} as Record<string, number>,
      recent: this.logs.slice(0, 10)
    };

    this.logs.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;
    });

    return stats;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logAuth = logger.auth.bind(logger);
export const logTrading = logger.trading.bind(logger);
export const logWallet = logger.wallet.bind(logger);
export const logAdmin = logger.admin.bind(logger);
export const logSecurity = logger.security.bind(logger);
