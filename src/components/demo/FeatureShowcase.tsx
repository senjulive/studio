"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Palette, 
  Navigation, 
  Layers, 
  Sparkles,
  SwipeIcon as Swipe,
  Timer,
  Moon,
  Sun,
  Star
} from 'lucide-react';

const features = [
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile-First Design",
    description: "Optimized for mobile devices with responsive glassmorphic interface",
    color: "bg-blue-500/20 text-blue-500 border-blue-500/30"
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "3 Theme Modes",
    description: "Light, Dark, and signature Astral glassmorphic themes",
    color: "bg-purple-500/20 text-purple-500 border-purple-500/30"
  },
  {
    icon: <Swipe className="h-6 w-6" />,
    title: "Swipe Navigation",
    description: "Intuitive swipe gestures to access side navigation",
    color: "bg-green-500/20 text-green-500 border-green-500/30"
  },
  {
    icon: <Timer className="h-6 w-6" />,
    title: "Auto-Hide Navigation",
    description: "Navigation automatically hides after 5 seconds",
    color: "bg-orange-500/20 text-orange-500 border-orange-500/30"
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Glassmorphic UI",
    description: "Modern frosted glass effects with backdrop blur",
    color: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30"
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Smooth Animations",
    description: "Framer Motion powered micro-interactions",
    color: "bg-pink-500/20 text-pink-500 border-pink-500/30"
  }
];

const pages = [
  "Home Dashboard", "Market Data", "CORE Trading Bot", "Portfolio Overview",
  "Transaction History", "Analytics & Stats", "Settings Panel", "Chat System",
  "Squad Management", "Profile & Security", "Deposit & Withdraw", "Support"
];

export function FeatureShowcase() {
  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <h1 className="text-2xl font-bold text-gradient">Feature Showcase</h1>
        <p className="text-sm text-muted-foreground">AstralCore Mobile Web App</p>
      </div>

      <div className="mobile-content">
        {/* Theme Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Theme System Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Sun className="h-6 w-6 text-slate-800" />
                  </div>
                  <p className="text-xs">Light</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-900 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Moon className="h-6 w-6 text-slate-100" />
                  </div>
                  <p className="text-xs">Dark</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 glass rounded-lg mx-auto mb-2 flex items-center justify-center border border-primary/30">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xs">Astral</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Switch themes using the theme toggle in navigation
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
            >
              <Card className="glass-card hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge className={feature.color}>
                      {feature.icon}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Available Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Available Pages</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete mobile crypto management platform
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pages.map((page, index) => (
                  <motion.div
                    key={page}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + (index * 0.05) }}
                  >
                    <Badge variant="outline" className="text-xs">
                      {page}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="glass-card border-primary/30">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold mb-2 text-primary">How to Navigate</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Swipe from right ← to open navigation</p>
                <p>• Tap menu button (top right) to toggle nav</p>
                <p>• Navigation auto-hides after 5 seconds</p>
                <p>• Use theme toggle to switch between 3 modes</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
