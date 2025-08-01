'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AstralLogo } from '@/components/icons/astral-logo';
import { Progress } from '@/components/ui/progress';

interface FuturisticLoadingProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
}

export function FuturisticLoading({ 
  message = "Initializing AstralCore", 
  progress = 0,
  showProgress = true 
}: FuturisticLoadingProps) {
  const [dots, setDots] = React.useState('');
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col items-center justify-center z-50">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
      
      {/* Animated Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent animate-pulse" />
      
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo with Pulse Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <AstralLogo className="h-24 w-24 text-primary drop-shadow-2xl" />
          </motion.div>
          
          {/* Orbiting particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-primary/30 rounded-full"
              style={{
                width: 100 + i * 20,
                height: 100 + i * 20,
                top: -10 - i * 10,
                left: -10 - i * 10,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 4 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.div
                className="absolute w-2 h-2 bg-primary rounded-full"
                style={{ top: -1, left: '50%', x: '-50%' }}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
            AstralCore
          </h1>
          
          <p className="text-lg text-foreground/80 font-medium min-h-[28px]">
            {message}{dots}
          </p>
          
          <p className="text-sm text-muted-foreground">
            Quantum-powered trading platform
          </p>
        </motion.div>

        {/* Progress Bar */}
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="w-80 max-w-sm space-y-2"
          >
            <Progress 
              value={progress} 
              className="h-2 bg-secondary border border-border/50"
            />
            <p className="text-xs text-center text-muted-foreground">
              {Math.round(progress)}% Complete
            </p>
          </motion.div>
        )}

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
