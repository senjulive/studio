'use client';

import { useRef, useEffect, useCallback } from 'react';

interface TouchPosition {
  x: number;
  y: number;
}

interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
}

interface UseTouchGesturesOptions {
  threshold?: number; // Minimum distance for swipe
  restraint?: number; // Maximum perpendicular distance
  allowedTime?: number; // Maximum time for swipe
  longPressTime?: number; // Time for long press
}

export function useTouchGestures(
  callbacks: SwipeCallbacks,
  options: UseTouchGesturesOptions = {}
) {
  const {
    threshold = 100,
    restraint = 100,
    allowedTime = 300,
    longPressTime = 500
  } = options;

  const startPos = useRef<TouchPosition>({ x: 0, y: 0 });
  const startTime = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();

    // Start long press timer
    if (callbacks.onLongPress) {
      longPressTimer.current = setTimeout(() => {
        callbacks.onLongPress?.();
      }, longPressTime);
    }
  }, [callbacks.onLongPress, longPressTime]);

  const handleTouchMove = useCallback(() => {
    // Cancel long press on move
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // Cancel long press
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    const touch = e.changedTouches[0];
    const endPos = { x: touch.clientX, y: touch.clientY };
    const elapsedTime = Date.now() - startTime.current;

    if (elapsedTime <= allowedTime) {
      const deltaX = endPos.x - startPos.current.x;
      const deltaY = endPos.y - startPos.current.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Check if it's a tap (minimal movement)
      if (absDeltaX < 10 && absDeltaY < 10) {
        callbacks.onTap?.();
        return;
      }

      // Check for horizontal swipes
      if (absDeltaX >= threshold && absDeltaY <= restraint) {
        if (deltaX > 0) {
          callbacks.onSwipeRight?.();
        } else {
          callbacks.onSwipeLeft?.();
        }
      }
      // Check for vertical swipes
      else if (absDeltaY >= threshold && absDeltaX <= restraint) {
        if (deltaY > 0) {
          callbacks.onSwipeDown?.();
        } else {
          callbacks.onSwipeUp?.();
        }
      }
    }
  }, [callbacks, threshold, restraint, allowedTime]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add passive listeners for better performance
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return elementRef;
}
