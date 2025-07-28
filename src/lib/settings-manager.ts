'use client';

export interface AppSettings {
  general: {
    siteName: string;
    supportEmail: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    withdrawalsEnabled: boolean;
    depositsEnabled: boolean;
  };
  trading: {
    minTradeAmount: number;
    maxTradeAmount: number;
    tradingFeePercent: number;
    maxActiveBots: number;
    allowedPairs: string[];
  };
  security: {
    sessionTimeoutMinutes: number;
    maxLoginAttempts: number;
    requireEmailVerification: boolean;
    require2FA: boolean;
    passwordMinLength: number;
  };
  notifications: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
    webhookUrl?: string;
  };
  deposits: {
    btcAddress: string;
    ethAddress: string;
    usdtAddress: string;
    minConfirmations: {
      btc: number;
      eth: number;
      usdt: number;
    };
    fees: {
      btc: number;
      eth: number;
      usdt: number;
    };
  };
  withdrawals: {
    dailyLimit: number;
    monthlyLimit: number;
    minAmount: number;
    maxAmount: number;
    processingFeePercent: number;
    autoApprovalThreshold: number;
  };
  kyc: {
    required: boolean;
    levels: {
      level1: { dailyLimit: number; monthlyLimit: number; };
      level2: { dailyLimit: number; monthlyLimit: number; };
      level3: { dailyLimit: number; monthlyLimit: number; };
    };
  };
}

const defaultSettings: AppSettings = {
  general: {
    siteName: 'AstralCore',
    supportEmail: 'support@astralcore.io',
    maintenanceMode: false,
    registrationEnabled: true,
    withdrawalsEnabled: true,
    depositsEnabled: true,
  },
  trading: {
    minTradeAmount: 10,
    maxTradeAmount: 100000,
    tradingFeePercent: 0.1,
    maxActiveBots: 5,
    allowedPairs: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 'SOL/USDT'],
  },
  security: {
    sessionTimeoutMinutes: 30,
    maxLoginAttempts: 5,
    requireEmailVerification: false, // Changed since email verification was removed
    require2FA: false,
    passwordMinLength: 8,
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    webhookUrl: undefined,
  },
  deposits: {
    btcAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    ethAddress: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
    usdtAddress: 'TPAj58tX5n2hXpYZAe5V6b4s8g1zB4hP7x',
    minConfirmations: {
      btc: 3,
      eth: 12,
      usdt: 1,
    },
    fees: {
      btc: 0.0001,
      eth: 0.001,
      usdt: 1,
    },
  },
  withdrawals: {
    dailyLimit: 10000,
    monthlyLimit: 50000,
    minAmount: 10,
    maxAmount: 10000,
    processingFeePercent: 0.5,
    autoApprovalThreshold: 1000,
  },
  kyc: {
    required: true,
    levels: {
      level1: { dailyLimit: 1000, monthlyLimit: 5000 },
      level2: { dailyLimit: 5000, monthlyLimit: 25000 },
      level3: { dailyLimit: 50000, monthlyLimit: 500000 },
    },
  },
};

class SettingsManager {
  private settings: AppSettings;
  private readonly SETTINGS_KEY = 'astral-app-settings';
  private subscribers: Set<(settings: AppSettings) => void> = new Set();

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): AppSettings {
    if (typeof window === 'undefined') return defaultSettings;
    
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return this.mergeSettings(defaultSettings, parsed);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    
    return defaultSettings;
  }

  private mergeSettings(defaults: any, overrides: any): any {
    const result = { ...defaults };
    
    for (const key in overrides) {
      if (overrides[key] && typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
        result[key] = this.mergeSettings(defaults[key] || {}, overrides[key]);
      } else {
        result[key] = overrides[key];
      }
    }
    
    return result;
  }

  private saveSettings() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
      this.notifySubscribers();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.settings));
  }

  // Public methods
  getSettings(): AppSettings {
    return { ...this.settings };
  }

  getSetting<K extends keyof AppSettings>(category: K): AppSettings[K] {
    return { ...this.settings[category] };
  }

  getSettingValue<K extends keyof AppSettings, V extends keyof AppSettings[K]>(
    category: K, 
    key: V
  ): AppSettings[K][V] {
    return this.settings[category][key];
  }

  updateSettings(updates: Partial<AppSettings>) {
    this.settings = this.mergeSettings(this.settings, updates);
    this.saveSettings();
  }

  updateSetting<K extends keyof AppSettings>(category: K, updates: Partial<AppSettings[K]>) {
    this.settings[category] = { ...this.settings[category], ...updates };
    this.saveSettings();
  }

  updateSettingValue<K extends keyof AppSettings, V extends keyof AppSettings[K]>(
    category: K, 
    key: V, 
    value: AppSettings[K][V]
  ) {
    this.settings[category][key] = value;
    this.saveSettings();
  }

  resetToDefaults() {
    this.settings = { ...defaultSettings };
    this.saveSettings();
  }

  resetCategory<K extends keyof AppSettings>(category: K) {
    this.settings[category] = { ...defaultSettings[category] };
    this.saveSettings();
  }

  subscribe(callback: (settings: AppSettings) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  exportSettings(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  importSettings(settingsJson: string): boolean {
    try {
      const imported = JSON.parse(settingsJson);
      this.settings = this.mergeSettings(defaultSettings, imported);
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }

  validateSettings(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate trading settings
    if (this.settings.trading.minTradeAmount >= this.settings.trading.maxTradeAmount) {
      errors.push('Min trade amount must be less than max trade amount');
    }

    // Validate withdrawal settings
    if (this.settings.withdrawals.minAmount >= this.settings.withdrawals.maxAmount) {
      errors.push('Min withdrawal amount must be less than max withdrawal amount');
    }

    // Validate security settings
    if (this.settings.security.passwordMinLength < 6) {
      errors.push('Password minimum length must be at least 6 characters');
    }

    // Validate deposit addresses (basic format check)
    const btcRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/;
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    const tronRegex = /^T[A-Za-z1-9]{33}$/;

    if (!btcRegex.test(this.settings.deposits.btcAddress)) {
      errors.push('Invalid BTC address format');
    }

    if (!ethRegex.test(this.settings.deposits.ethAddress)) {
      errors.push('Invalid ETH address format');
    }

    if (!tronRegex.test(this.settings.deposits.usdtAddress)) {
      errors.push('Invalid USDT (TRC20) address format');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const settingsManager = new SettingsManager();

// Export convenience functions
export const getSettings = () => settingsManager.getSettings();
export const getSetting = settingsManager.getSetting.bind(settingsManager);
export const getSettingValue = settingsManager.getSettingValue.bind(settingsManager);
export const updateSettings = settingsManager.updateSettings.bind(settingsManager);
export const updateSetting = settingsManager.updateSetting.bind(settingsManager);
