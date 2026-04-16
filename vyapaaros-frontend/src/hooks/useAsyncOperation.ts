import { useState, useCallback } from 'react';

/**
 * Custom hook for handling async operations with retry mechanism
 * Requirement: Error Handling Strategy - Retry mechanisms for failed operations
 */

export interface UseAsyncOperationOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

export interface UseAsyncOperationReturn<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  retryCount: number;
  execute: (...args: any[]) => Promise<T | null>;
  retry: () => Promise<T | null>;
  reset: () => void;
}

export function useAsyncOperation<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions = {}
): UseAsyncOperationReturn<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onSuccess,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastArgs, setLastArgs] = useState<any[]>([]);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      setLastArgs(args);

      let currentRetry = 0;
      let lastError: Error | null = null;

      while (currentRetry <= maxRetries) {
        try {
          const result = await asyncFunction(...args);
          setData(result);
          setIsLoading(false);
          setRetryCount(0);
          
          if (onSuccess) {
            onSuccess();
          }
          
          return result;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          currentRetry++;
          setRetryCount(currentRetry);

          if (currentRetry <= maxRetries) {
            // Wait before retrying with exponential backoff
            await new Promise(resolve => 
              setTimeout(resolve, retryDelay * Math.pow(2, currentRetry - 1))
            );
          }
        }
      }

      // All retries failed
      setError(lastError);
      setIsLoading(false);
      
      if (onError && lastError) {
        onError(lastError);
      }

      return null;
    },
    [asyncFunction, maxRetries, retryDelay, onError, onSuccess]
  );

  const retry = useCallback(async (): Promise<T | null> => {
    return execute(...lastArgs);
  }, [execute, lastArgs]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setRetryCount(0);
    setLastArgs([]);
  }, []);

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    isSuccess: data !== null && error === null,
    retryCount,
    execute,
    retry,
    reset,
  };
}
