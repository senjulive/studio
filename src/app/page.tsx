'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AstralLogo } from '@/components/icons/astral-logo';
import { AutoSlideshow } from '@/components/ui/auto-slideshow';
import { ArrowRight, Zap, TrendingUp, Shield, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Default fallback images
const defaultSlideshowImages = [
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F05e9f1234f914ffda9f9d733faad0708?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F5324f6073a2d4094b1457cf686d328f2?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F6c22b44704904e0ba0d6191447bdec8c?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F6d1a4dd2283f40d89c6b850cc9514c8a?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2Fb025425b16784222b8e47d36daa2c246?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F5baea7d83ca640a9ac243f913e0205a9?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F597d9d3ba26a40f89b1800382daefc3d?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F4fa3424979bd411bb5c1a9084ab40993?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2Fd8e551f7fe5b42e5a8dd3bd330b0488e?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F765b62449914476a881e909ed19a9aaa?format=webp&width=800'
];

export default function WelcomePage() {
  const [slideshowImages, setSlideshowImages] = useState(defaultSlideshowImages);

  useEffect(() => {
    // Fetch dynamic slideshow images
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/slideshow-images');
        if (response.ok) {
          const data = await response.json();
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            setSlideshowImages(data.images);
          }
        }
      } catch (error) {
        console.error('Failed to load slideshow images:', error);
        // Keep using default images on error
      }
    };

    fetchImages();
  }, []);
  return (
    <main className="relative min-h-dvh w-full overflow-hidden">
      <AutoSlideshow
        images={slideshowImages}
        duration={3500}
        className="absolute inset-0"
      >
        <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center gap-6 max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <AstralLogo className="h-24 w-24 sm:h-32 sm:w-32 animate-bot-pulse text-white drop-shadow-2xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-lg">
                Welcome to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse">
                  AstralCore
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed drop-shadow-md">
                The future of AI-powered crypto trading. Experience quantum-level automation with our advanced Grid Trading algorithms.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 gap-3 w-full max-w-xs"
            >
              <div className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                <Cpu className="h-5 w-5 text-cyan-400 mb-1" />
                <span className="text-xs text-white/90 font-medium">AI Powered</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                <TrendingUp className="h-5 w-5 text-green-400 mb-1" />
                <span className="text-xs text-white/90 font-medium">Auto Trading</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                <Shield className="h-5 w-5 text-blue-400 mb-1" />
                <span className="text-xs text-white/90 font-medium">Secure</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                <Zap className="h-5 w-5 text-yellow-400 mb-1" />
                <span className="text-xs text-white/90 font-medium">Instant</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-col gap-3 w-full max-w-xs mt-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 border-0 h-12"
              >
                <Link href="/login" className="flex items-center justify-center">
                  Launch Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-lg border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 h-12"
              >
                <Link href="/register" className="flex items-center justify-center">
                  Create Account
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-xs text-white/70 mt-4"
            >
              Powered by Quantum AI Technology
            </motion.div>
          </motion.div>
        </div>
      </AutoSlideshow>
    </main>
  );
}
