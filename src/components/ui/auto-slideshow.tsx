'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AutoSlideshowProps {
  images: string[];
  duration?: number;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
}

export function AutoSlideshow({ 
  images, 
  duration = 4000, 
  className = '',
  children,
  overlay = true
}: AutoSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, duration);

    return () => clearInterval(interval);
  }, [images.length, duration]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {overlay && (
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
      )}

      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}

      {/* Progress indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
            animate={{
              scale: index === currentIndex ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
