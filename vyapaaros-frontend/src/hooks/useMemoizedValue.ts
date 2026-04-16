import { useMemo } from 'react';

/**
 * Memoizes a sorted array
 */
export function useSortedArray<T>(
  array: T[],
  compareFn: (a: T, b: T) => number
): T[] {
  return useMemo(() => {
    return [...array].sort(compareFn);
  }, [array, compareFn]);
}

/**
 * Memoizes a filtered array
 */
export function useFilteredArray<T>(
  array: T[],
  predicate: (item: T) => boolean
): T[] {
  return useMemo(() => {
    return array.filter(predicate);
  }, [array, predicate]);
}

/**
 * Memoizes a mapped array
 */
export function useMappedArray<T, U>(
  array: T[],
  mapper: (item: T, index: number) => U
): U[] {
  return useMemo(() => {
    return array.map(mapper);
  }, [array, mapper]);
}

/**
 * Memoizes aggregated data (sum, average, etc.)
 */
export function useAggregatedValue<T>(
  array: T[],
  aggregator: (items: T[]) => number
): number {
  return useMemo(() => {
    return aggregator(array);
  }, [array, aggregator]);
}
