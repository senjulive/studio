"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Smartphone, 
  Globe, 
  Shield, 
  Palette, 
  Volume2,
  Mail,
  MessageSquare,
  Eye,
  Moon,
  Sun,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const settingsCategories = [
  {
    title: 'Notifications',
    icon: <Bell className="h-5 w-5" />,
    settings: [
      { id: 'push_notifications', label: 'Push Notifications', description: 'Receive mobile push notifications', type: 'toggle' },
      { id: 'email_notifications', label: 'Email Notifications', description: 'Receive email updates', type: 'toggle' },
      { id: 'trading_alerts', label: 'Trading Alerts', description: 'Get notified about trading activities', type: 'toggle' },
      { id: 'price_alerts', label: 'Price Alerts', description: 'Market price change notifications', type: 'toggle' },
    ]
  },
  {
    title: 'Appearance',
    icon: <Palette className="h-5 w-5" />,
    settings: [
      { id: 'theme', label: 'Theme', description: 'Choose your preferred theme', type: 'custom' },
      { id: 'language', label: 'Language', description: 'Select interface language', type: 'select', options: ['English', 'Spanish', 'French', 'German', 'Chinese'] },
      { id: 'currency_display', label: 'Currency Display', description: 'Primary currency for displays', type: 'select', options: ['USD', 'EUR', 'GBP', 'BTC', 'ETH'] },
    ]
  },
  {
    title: 'Privacy & Security',
    icon: <Shield className="h-5 w-5" />,
    settings: [
      { id: 'biometric_auth', label: 'Biometric Authentication', description: 'Use fingerprint or face ID', type: 'toggle' },
      { id: 'session_timeout', label: 'Auto-logout', description: 'Automatic session timeout', type: 'select', options: ['15 minutes', '30 minutes', '1 hour', '4 hours', 'Never'] },
      { id: 'hide_balances', label: 'Hide Balances', description: 'Hide balance amounts by default', type: 'toggle' },
      { id: 'analytics_sharing', label: 'Analytics Sharing', description: 'Share usage data for improvements', type: 'toggle' },
    ]
  },
  {
    title: 'Trading',
    icon: <MessageSquare className="h-5 w-5" />,
    settings: [
      { id: 'auto_trading', label: 'Auto Trading', description: 'Enable automated trading bot', type: 'toggle' },
      { id: 'risk_level', label: 'Risk Level', description: 'Trading risk tolerance', type: 'select', options: ['Conservative', 'Moderate', 'Aggressive'] },
      { id: 'confirmation_dialogs', label: 'Trade Confirmations', description: 'Show confirmation for trades', type: 'toggle' },
      { id: 'stop_loss_default', label: 'Default Stop Loss', description: 'Percentage for automatic stop loss', type: 'select', options: ['2%', '5%', '10%', '15%', 'Disabled'] },
    ]
  },
  {
    title: 'Sound & Vibration',
    icon: <Volume2 className="h-5 w-5" />,
    settings: [
      { id: 'sound_effects', label: 'Sound Effects', description: 'Enable interface sounds', type: 'toggle' },
      { id: 'trading_sounds', label: 'Trading Sounds', description: 'Audio feedback for trades', type: 'toggle' },
      { id: 'notification_sound', label: 'Notification Sound', description: 'Sound for notifications', type: 'toggle' },
      { id: 'haptic_feedback', label: 'Haptic Feedback', description: 'Vibration feedback', type: 'toggle' },
    ]
  }
];

export function SettingsView() {
  const { theme } = useTheme();
  const [settings, setSettings] = useState({
    push_notifications: true,
    email_notifications: true,
    trading_alerts: true,
    price_alerts: false,
    biometric_auth: true,
    hide_balances: false,
    analytics_sharing: true,
    auto_trading: true,
    confirmation_dialogs: true,
    sound_effects: true,
    trading_sounds: false,
    notification_sound: true,
    haptic_feedback: true,
    language: 'English',
    currency_display: 'USD',
    session_timeout: '30 minutes',
    risk_level: 'Moderate',
    stop_loss_default: '5%',
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSelect = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderSetting = (setting: any) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <Switch
            checked={settings[setting.id as keyof typeof settings] as boolean}
            onCheckedChange={() => handleToggle(setting.id)}
          />
        );
      case 'select':
        return (
          <Select
            value={settings[setting.id as keyof typeof settings] as string}
            onValueChange={(value) => handleSelect(setting.id, value)}
          >
            <SelectTrigger className="w-32 glass-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-border/50">
              {setting.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'custom':
        if (setting.id === 'theme') {
          return <ThemeToggle />;
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <h1 className="text-2xl font-bold text-gradient">Settings</h1>
      </div>

      <div className="mobile-content">
        {settingsCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  {category.icon}
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.settings.map((setting, settingIndex) => (
                  <motion.div
                    key={setting.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (settingIndex * 0.05) }}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{setting.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      {renderSetting(setting)}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Star className="h-5 w-5" />
                App Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="text-sm font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Build</span>
                <span className="text-sm font-medium">2024.01.15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <span className="text-sm font-medium capitalize">{theme}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-3"
        >
          <Button className="w-full btn-primary">
            Save Settings
          </Button>
          <Button variant="outline" className="w-full glass-button">
            Reset to Defaults
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
