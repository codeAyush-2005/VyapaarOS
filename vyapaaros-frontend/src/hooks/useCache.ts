import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh data
}

const cache = new Map<string, CacheEntry<any>>();

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isStale = useCallback((entry: CacheEntry<T>): boolean => {
    return Date.now() - entry.timestamp > ttl;
  }, [ttl]);

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsValidating(true);
      }
      setError(null);

      const result = await fetcher();
      
      if (!isMountedRef.current) return;

      // Update cache
      cache.set(key, {
        data: result,
        timestamp: Date.now()
      });

      setData(result);
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setIsValidating(false);
      }
    }
  }, [key, fetcher]);

  const revalidate = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  const mutate = useCallback((newData: T) => {
    cache.set(key, {
      data: newData,
      timestamp: Date.now()
    });
    setData(newData);
  }, [key]);

  const clearCache = useCallback(() => {
    cache.delete(key);
  }, [key]);

  useEffect(() => {
    const cachedEntry = cache.get(key) as CacheEntry<T> | undefined;

    if (cachedEntry) {
      // Return cached data immediately
      setData(cachedEntry.data);
      setIsLoading(false);

      // If stale and staleWhileRevalidate is enabled, fetch fresh data in background
      if (isStale(cachedEntry) && staleWhileRevalidate) {
        fetchData(false);
      } else if (isStale(cachedEntry)) {
        // If stale and no staleWhileRevalidate, fetch with loading state
        fetchData(true);
      }
    } else {
      // No cache, fetch data
      fetchData(true);
    }
  }, [key, fetchData, isStale, staleWhileRevalidate]);

  return {
    data,
    isLoading,
    isValidating,
    error,
    revalidate,
    mutate,
    clearCache
  };
}

// Clear all cache entries
export function clearAllCache() {
  cache.clear();
}

// Clear cache entries older than specified time
export function clearStaleCache(maxAge: number = 5 * 60 * 1000) {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > maxAge) {
      cache.delete(key);
    }
  }
}
