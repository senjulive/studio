'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  navigationTiming?: PerformanceNavigationTiming;
  paintTiming?: PerformancePaintTiming[];
  layoutShiftEntries?: LayoutShift[];
  largestContentfulPaint?: PerformanceEntry[];
}

function measurePerformance(): PerformanceMetrics {
  if (typeof window === 'undefined') return {};

  const metrics: PerformanceMetrics = {};

  // Navigation timing
  if ('performance' in window && 'getEntriesByType' in window.performance) {
    const navigationEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      metrics.navigationTiming = navigationEntries[0];
    }

    // Paint timing
    const paintEntries = window.performance.getEntriesByType('paint') as PerformancePaintTiming[];
    if (paintEntries.length > 0) {
      metrics.paintTiming = paintEntries;
    }

    // Largest Contentful Paint
    const lcpEntries = window.performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      metrics.largestContentfulPaint = lcpEntries;
    }
  }

  return metrics;
}

function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    console.log('Web Vital:', metric);
    
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  }
}

export function PerformanceMonitor({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Measure initial performance
    const initialMetrics = measurePerformance();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', initialMetrics);
    }

    // Set up observers for ongoing monitoring
    if ('PerformanceObserver' in window) {
      // Cumulative Layout Shift (CLS)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              reportWebVitals({
                name: 'CLS',
                value: (entry as any).value,
                id: entry.startTime.toString(),
              });
            }
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('CLS observer not supported');
      }

      // Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          reportWebVitals({
            name: 'LCP',
            value: lastEntry.startTime,
            id: lastEntry.startTime.toString(),
          });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            reportWebVitals({
              name: 'FID',
              value: (entry as any).processingStart - entry.startTime,
              id: entry.startTime.toString(),
            });
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.warn('FID observer not supported');
      }
    }

    // Monitor memory usage (if available)
    if ('memory' in window.performance) {
      const memoryInfo = (window.performance as any).memory;
      if (process.env.NODE_ENV === 'development') {
        console.log('Memory Usage:', {
          used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) + ' MB',
          total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024) + ' MB',
          limit: Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024) + ' MB',
        });
      }
    }

    // Cleanup function
    return () => {
      // Disconnect observers if needed
    };
  }, []);

  return <>{children}</>;
}

// Hook for measuring component performance
export function usePerformanceTimer(name: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${name} render time: ${duration.toFixed(2)}ms`);
      }
      
      // Mark for performance timeline
      if ('mark' in performance) {
        performance.mark(`${name}-start`, { startTime });
        performance.mark(`${name}-end`, { startTime: endTime });
        performance.measure(name, `${name}-start`, `${name}-end`);
      }
    };
  }, [name]);
}

// Component to display performance info in development
export function PerformanceInfo() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  useEffect(() => {
    const logPerformanceInfo = () => {
      const metrics = measurePerformance();
      console.group('Performance Metrics');
      
      if (metrics.navigationTiming) {
        const nav = metrics.navigationTiming;
        console.log('Page Load Time:', nav.loadEventEnd - nav.navigationStart, 'ms');
        console.log('DOM Content Loaded:', nav.domContentLoadedEventEnd - nav.navigationStart, 'ms');
        console.log('Time to Interactive:', nav.domInteractive - nav.navigationStart, 'ms');
      }
      
      if (metrics.paintTiming) {
        metrics.paintTiming.forEach(entry => {
          console.log(`${entry.name}:`, entry.startTime, 'ms');
        });
      }
      
      if (metrics.largestContentfulPaint) {
        const lcp = metrics.largestContentfulPaint[metrics.largestContentfulPaint.length - 1];
        console.log('Largest Contentful Paint:', lcp.startTime, 'ms');
      }
      
      console.groupEnd();
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      logPerformanceInfo();
    } else {
      window.addEventListener('load', logPerformanceInfo);
      return () => window.removeEventListener('load', logPerformanceInfo);
    }
  }, []);

  return null;
}
