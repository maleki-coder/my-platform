import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a value
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler); // cleanup on value change
  }, [value, delay]);

  return debouncedValue;
};
