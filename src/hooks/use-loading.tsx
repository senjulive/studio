'use client';

import { useState, useCallback, useRef } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

export function useLoading(initialKeys: string[] = []) {
  const [loadingState, setLoadingState] = useState<LoadingState>(() => {
    const initial: LoadingState = {};
    initialKeys.forEach(key => {
      initial[key] = false;
    });
    return initial;
  });

  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingState(prev => ({
      ...prev,
      [key]: isLoading,
    }));
  }, []);

  const startLoading = useCallback((key: string, timeout?: number) => {
    setLoading(key, true);
    
    if (timeout) {
      // Clear existing timeout for this key
      const existingTimeout = timeoutRefs.current.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }
      
      // Set new timeout
      const timeoutId = setTimeout(() => {
        setLoading(key, false);
        timeoutRefs.current.delete(key);
      }, timeout);
      
      timeoutRefs.current.set(key, timeoutId);
    }
  }, [setLoading]);

  const stopLoading = useCallback((key: string) => {
    setLoading(key, false);
    
    // Clear timeout if exists
    const timeoutId = timeoutRefs.current.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(key);
    }
  }, [setLoading]);

  const isLoading = useCallback((key: string): boolean => {
    return loadingState[key] || false;
  }, [loadingState]);

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loadingState).some(loading => loading);
  }, [loadingState]);

  const getLoadingKeys = useCallback((): string[] => {
    return Object.keys(loadingState).filter(key => loadingState[key]);
  }, [loadingState]);

  const withLoading = useCallback(<T extends any[], R>(
    key: string,
    fn: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<R> => {
      startLoading(key);
      try {
        const result = await fn(...args);
        return result;
      } finally {
        stopLoading(key);
      }
    };
  }, [startLoading, stopLoading]);

  const clearAllLoading = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current.clear();
    
    // Reset all loading states
    setLoadingState({});
  }, []);

  return {
    loadingState,
    isLoading,
    isAnyLoading,
    getLoadingKeys,
    startLoading,
    stopLoading,
    setLoading,
    withLoading,
    clearAllLoading,
  };
}
