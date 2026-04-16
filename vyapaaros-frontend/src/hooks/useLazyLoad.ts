import { useState, useEffect, useRef, type RefObject } from 'react';

interface UseLazyLoadOptions {
  threshold?: number; // Intersection threshold (0-1)
  rootMargin?: string; // Root margin for intersection observer
  triggerOnce?: boolean; // Only trigger once
}

/**
 * Hook for lazy loading content when it enters the viewport
 * @param options - Configuration options
 * @returns Object with ref and isVisible state
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  options: UseLazyLoadOptions = {}
): {
  ref: RefObject<T | null>;
  isVisible: boolean;
} {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
  
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            
            if (triggerOnce && observerRef.current) {
              observerRef.current.disconnect();
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

/**
 * Hook for preloading images
 */
export function useImagePreload(src: string): boolean {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src) {
      const timer = setTimeout(() => setIsLoaded(false), 0);
      return () => clearTimeout(timer);
    }

    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setIsLoaded(false);
    };
    
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return isLoaded;
}
