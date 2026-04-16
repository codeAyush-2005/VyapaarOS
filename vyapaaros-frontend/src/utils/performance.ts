/**
 * Performance monitoring utilities for tracking Core Web Vitals
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Measure and log Largest Contentful Paint (LCP)
 * Good: < 2.5s, Needs Improvement: 2.5s - 4s, Poor: > 4s
 */
export function measureLCP(callback?: (metric: PerformanceMetric) => void) {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      
      const value = lastEntry.renderTime || lastEntry.loadTime || 0;
      const rating = value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
      
      const metric: PerformanceMetric = {
        name: 'LCP',
        value,
        rating
      };

      if (callback) {
        callback(metric);
      } else {
        console.log(`[Performance] LCP: ${value.toFixed(2)}ms (${rating})`);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (error) {
    console.error('Error measuring LCP:', error);
  }
}

/**
 * Measure and log First Input Delay (FID)
 * Good: < 100ms, Needs Improvement: 100ms - 300ms, Poor: > 300ms
 */
export function measureFID(callback?: (metric: PerformanceMetric) => void) {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const value = entry.processingStart - entry.startTime;
        const rating = value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor';
        
        const metric: PerformanceMetric = {
          name: 'FID',
          value,
          rating
        };

        if (callback) {
          callback(metric);
        } else {
          console.log(`[Performance] FID: ${value.toFixed(2)}ms (${rating})`);
        }
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
  } catch (error) {
    console.error('Error measuring FID:', error);
  }
}

/**
 * Measure and log Cumulative Layout Shift (CLS)
 * Good: < 0.1, Needs Improvement: 0.1 - 0.25, Poor: > 0.25
 */
export function measureCLS(callback?: (metric: PerformanceMetric) => void) {
  if (!('PerformanceObserver' in window)) return;

  try {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      const rating = clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor';
      
      const metric: PerformanceMetric = {
        name: 'CLS',
        value: clsValue,
        rating
      };

      if (callback) {
        callback(metric);
      } else {
        console.log(`[Performance] CLS: ${clsValue.toFixed(3)} (${rating})`);
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  } catch (error) {
    console.error('Error measuring CLS:', error);
  }
}

/**
 * Initialize all Core Web Vitals monitoring
 */
export function initPerformanceMonitoring(callback?: (metric: PerformanceMetric) => void) {
  measureLCP(callback);
  measureFID(callback);
  measureCLS(callback);
}

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string, startTime: number) {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (duration > 16) { // Longer than one frame (60fps)
    console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms`);
  }
  
  return duration;
}

/**
 * Create a performance mark
 */
export function mark(name: string) {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(name);
  }
}

/**
 * Measure time between two marks
 */
export function measure(name: string, startMark: string, endMark: string) {
  if ('performance' in window && 'measure' in performance) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
      return measure.duration;
    } catch (error) {
      console.error('Error measuring performance:', error);
    }
  }
  return 0;
}

/**
 * Debounce function for performance optimization
 * Useful for expensive operations like search, resize, scroll handlers
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 * Ensures function is called at most once per specified time period
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Request idle callback wrapper with fallback
 * Schedules work to be done when browser is idle
 */
export function requestIdleCallback(callback: () => void, options?: { timeout?: number }) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    return setTimeout(callback, 1);
  }
}

/**
 * Cancel idle callback with fallback
 */
export function cancelIdleCallback(id: number) {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Preload critical resources
 */
export function preloadResource(url: string, as: 'script' | 'style' | 'image' | 'font') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
}

/**
 * Prefetch resources for future navigation
 */
export function prefetchResource(url: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}
