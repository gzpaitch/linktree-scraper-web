'use client';

import { useState, useCallback } from 'react';

interface UseApiStateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiStateReturn<T, P extends unknown[]> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  execute: (...params: P) => Promise<T | null>;
  reset: () => void;
}

export function useApiState<T, P extends unknown[] = []>(
  apiFunction: (...params: P) => Promise<T>,
  options: UseApiStateOptions<T> = {}
): UseApiStateReturn<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...params);
        setData(result);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onError?.(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, execute, reset };
}
