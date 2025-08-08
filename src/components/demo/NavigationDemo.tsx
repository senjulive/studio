"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight,
  ArrowUp,
  Menu,
  Navigation,
  Layers,
  Smartphone,
  Monitor,
  Palette,
  Sparkles
} from 'lucide-react';

const navigationFeatures = [
  {
    icon: <ArrowLeft className="h-6 w-6" />,
    title: "Left Side Navigation",
    description: "Full-featured navigation panel that slides in from the left side",
    features: [
      "User profile section with avatar and badges",
      "Organized menu sections (Overview, Transactions, Community, Platform)",
      "Theme toggle integration",
      "Keyboard shortcut support (Ctrl+B)",
      "Smooth glassmorphic animations"
    ],
    color: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    position: "Left"
  },
  {
    icon: <ArrowRight className="h-6 w-6" />,
    title: "Right Mini Navigation",
    description: "Compact quick-access panel for frequently used actions",
    features: [
      "Auto-expanding with hover/click",
      "Quick access to key functions",
      "Notification badges for alerts",
      "Smart auto-hide after 5 seconds",
      "Scroll-based visibility control"
    ],
    color: "bg-purple-500/20 text-purple-500 border-purple-500/30",
    position: "Right"
  },
  {
    icon: <ArrowUp className="h-6 w-6" />,
    title: "Bottom Navigation",
    description: "Mobile-optimized tab bar for primary navigation",
    features: [
      "Mobile-first design (hidden on desktop)",
      "Prominent center CORE trading button",
      "Smooth tab switching animations",
      "Safe area support for notched devices",
      "Quick action overlay button"
    ],
    color: "bg-green-500/20 text-green-500 border-green-500/30",
    position: "Bottom"
  }
];

const designFeatures = [
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Glassmorphic Design",
    description: "Modern frosted glass aesthetic throughout",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile-First",
    description: "Optimized for touch and mobile usage",
  },
  {
    icon: <Monitor className="h-6 w-6" />,
    title: "Desktop Enhanced",
    description: "Full-featured experience on larger screens",
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Theme Integration",
    description: "Works seamlessly with all 3 theme modes",
  },
  {
    icon: <Navigation className="h-6 w-6" />,
    title: "Intuitive Controls",
    description: "Natural gestures and keyboard shortcuts",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Smooth Animations",
    description: "Framer Motion powered micro-interactions",
  }
];

export function NavigationDemo() {
  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold text-gradient">
          Navigation System Demo
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience the complete glassmorphic navigation system with left sidebar, 
          right mini-nav, and bottom navigation - all working together seamlessly.
        </p>
      </motion.div>

      {/* Navigation Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {navigationFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={feature.color}>
                    {feature.icon}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {feature.position}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {feature.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* How to Use */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass-card border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Menu className="h-5 w-5" />
              How to Use the Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-500">Left Navigation</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Click the menu button (top-left on mobile)</li>
                  <li>• Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+B</kbd> on desktop</li>
                  <li>• Swipe from left edge on mobile</li>
                  <li>• Contains all main app sections</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-purple-500">Right Navigation</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Always visible on the right side</li>
                  <li>• Click to expand for more options</li>
                  <li>• Auto-hides after 5 seconds</li>
                  <li>• Quick access to key functions</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-green-500">Bottom Navigation</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Mobile only (hidden on desktop)</li>
                  <li>• Tap any icon for navigation</li>
                  <li>• Center CORE button is prominent</li>
                  <li>• Quick deposit button overlay</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Design Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Design Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {designFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 + (index * 0.1) }}
                  className="flex items-center gap-3 p-3 rounded-lg glass hover:border-primary/40 transition-all duration-200"
                >
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interactive Demo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <Card className="glass-card border-gradient">
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold text-gradient">Try It Out!</h3>
            <p className="text-muted-foreground mb-6">
              The navigation system is fully functional. Try opening the left menu, 
              expanding the right navigation, or using the bottom tabs on mobile.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="btn-primary">
                <Menu className="h-4 w-4 mr-2" />
                Open Left Menu
              </Button>
              <Button variant="outline" className="glass-button">
                <ArrowRight className="h-4 w-4 mr-2" />
                Try Right Nav
              </Button>
              <Button variant="outline" className="glass-button">
                <Smartphone className="h-4 w-4 mr-2" />
                Use Bottom Tabs
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
