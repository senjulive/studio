'use client';

import { LoginForm } from "@/components/auth/login-form";
import { AutoSlideshow } from '@/components/ui/auto-slideshow';
import { motion } from 'framer-motion';
import { AstralLogo } from '@/components/icons/astral-logo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const slideshowImages = [
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

export default function LoginPage() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden">
      <AutoSlideshow
        images={slideshowImages}
        duration={4000}
        className="absolute inset-0"
      >
        <div className="flex min-h-dvh items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-start"
            >
              <Link
                href="/"
                className="flex items-center text-white/80 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm">Back to Home</span>
              </Link>
            </motion.div>

            {/* Logo and Title */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center space-y-4"
            >
              <AstralLogo className="h-16 w-16 mx-auto text-white animate-bot-pulse" />
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-white/80 text-sm">
                  Access your AstralCore trading platform
                </p>
              </div>
            </motion.div>

            {/* Login Form Container */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6"
            >
              <LoginForm />
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center"
            >
              <p className="text-white/70 text-xs">
                Secured by quantum encryption technology
              </p>
            </motion.div>
          </div>
        </div>
      </AutoSlideshow>
    </main>
  );
}
