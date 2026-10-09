import { useState, useEffect } from "react";

/**
 * Debounces a value by `delay` milliseconds.
 *
 * Useful for search inputs — the debounced value only updates after the
 * user stops typing, preventing excessive API calls.
 *
 * @example
 * const debouncedQuery = useDebounce(query, 300);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
