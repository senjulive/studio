import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseClipboardOptions {
  timeout?: number;
  successMessage?: string;
  errorMessage?: string;
}

interface UseClipboardReturn {
  copy: (text: string, options?: { successMessage?: string; errorMessage?: string }) => Promise<boolean>;
  copied: boolean;
  error: string | null;
}

/**
 * Robust clipboard hook with proper error handling and fallbacks
 * Handles permissions policy issues and provides fallback for unsupported environments
 */
export function useClipboard(defaultOptions: UseClipboardOptions = {}): UseClipboardReturn {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    timeout = 2000,
    successMessage = 'Copied to clipboard!',
    errorMessage = 'Failed to copy to clipboard'
  } = defaultOptions;

  const copy = useCallback(async (
    text: string, 
    options: { successMessage?: string; errorMessage?: string } = {}
  ): Promise<boolean> => {
    try {
      setError(null);
      setCopied(false);

      // Check if clipboard API is available
      if (!navigator?.clipboard) {
        throw new Error('Clipboard API not available');
      }

      // Check if we're in a secure context (HTTPS or localhost)
      if (!window.isSecureContext && location.protocol !== 'http:' && location.hostname !== 'localhost') {
        throw new Error('Clipboard API requires secure context (HTTPS)');
      }

      // Attempt to write to clipboard
      await navigator.clipboard.writeText(text);
      
      setCopied(true);
      toast({
        title: "Copied!",
        description: options.successMessage || successMessage,
        duration: 2000,
      });

      // Reset copied state after timeout
      setTimeout(() => setCopied(false), timeout);
      
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      
      // Try fallback method for older browsers or when clipboard API is blocked
      try {
        await fallbackCopy(text);
        setCopied(true);
        toast({
          title: "Copied!",
          description: options.successMessage || successMessage,
          duration: 2000,
        });
        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch (fallbackErr) {
        console.error('Clipboard operation failed:', err);
        toast({
          title: "Copy Failed",
          description: options.errorMessage || errorMessage,
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
    }
  }, [toast, successMessage, errorMessage, timeout]);

  return { copy, copied, error };
}

/**
 * Fallback copy method for when Clipboard API is not available or blocked
 */
async function fallbackCopy(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    textarea.style.opacity = '0';
    textarea.setAttribute('readonly', '');
    textarea.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(textarea);
    
    try {
      // Select the text
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      
      // Execute copy command
      const successful = document.execCommand('copy');
      
      if (!successful) {
        throw new Error('document.execCommand failed');
      }
      
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      // Clean up
      document.body.removeChild(textarea);
    }
  });
}

/**
 * Simplified hook for basic copy functionality
 */
export function useCopy(text?: string) {
  const { copy, copied, error } = useClipboard();
  
  const handleCopy = useCallback(() => {
    if (text) {
      return copy(text);
    }
    return Promise.resolve(false);
  }, [text, copy]);

  return { copy: handleCopy, copied, error };
}
