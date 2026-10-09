import { useState, useCallback } from "react";

/**
 * Syncs a value with localStorage.
 *
 * Returns `[storedValue, setValue]` — a drop-in replacement for `useState`
 * that additionally persists the value across page refreshes.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore quota errors
        }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
