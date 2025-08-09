'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

interface FocusManagerProps {
  children: React.ReactNode;
  restoreFocus?: boolean;
  trapFocus?: boolean;
}

export function FocusManager({ 
  children, 
  restoreFocus = true, 
  trapFocus = false 
}: FocusManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!trapFocus || event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [trapFocus, getFocusableElements]);

  // Focus management for route changes
  useEffect(() => {
    const handleRouteChange = () => {
      // Announce route change to screen readers
      const announcement = document.getElementById('route-announcements');
      if (announcement) {
        announcement.textContent = `Navigated to ${document.title}`;
      }

      // Focus the main content or first focusable element
      const mainContent = document.querySelector('main');
      const firstFocusable = getFocusableElements()[0];
      
      if (mainContent) {
        mainContent.focus();
      } else if (firstFocusable) {
        firstFocusable.focus();
      }
    };

    // Listen for route changes
    handleRouteChange(); // Initial call
    
    return () => {
      // Cleanup if needed
    };
  }, [getFocusableElements]);

  useEffect(() => {
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    if (trapFocus) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (trapFocus) {
        document.removeEventListener('keydown', handleKeyDown);
      }
      
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [trapFocus, restoreFocus, handleKeyDown]);

  return (
    <>
      {/* Screen reader announcements */}
      <div
        id="route-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      
      <div
        ref={containerRef}
        role={trapFocus ? 'dialog' : undefined}
        aria-modal={trapFocus}
      >
        {children}
      </div>
    </>
  );
}

// Skip to content link
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-4 py-2 rounded-md z-50 font-medium"
      onFocus={(e) => {
        e.currentTarget.classList.remove('sr-only');
      }}
      onBlur={(e) => {
        e.currentTarget.classList.add('sr-only');
      }}
    >
      Skip to main content
    </a>
  );
}

// Keyboard navigation helper
export function useKeyboardNavigation() {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Escape key handling
    if (event.key === 'Escape') {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.blur) {
        activeElement.blur();
      }
    }

    // Arrow key navigation for custom components
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const currentElement = document.activeElement as HTMLElement;
      const container = currentElement?.closest('[role="listbox"], [role="menu"], [role="tablist"]');
      
      if (container) {
        event.preventDefault();
        // Handle arrow key navigation in the container
        // This would be expanded based on specific component needs
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// High contrast mode detection
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const checkHighContrast = () => {
      // Check for Windows high contrast mode
      const isHighContrastMode = window.matchMedia('(prefers-contrast: high)').matches ||
                                window.matchMedia('(-ms-high-contrast: active)').matches ||
                                window.matchMedia('(-ms-high-contrast: white-on-black)').matches;
      
      setIsHighContrast(isHighContrastMode);
    };

    checkHighContrast();
    
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    mediaQuery.addListener(checkHighContrast);
    
    return () => mediaQuery.removeListener(checkHighContrast);
  }, []);

  return isHighContrast;
}
