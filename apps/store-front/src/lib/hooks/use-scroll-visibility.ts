import { useState, useEffect, useRef } from "react";

/**
 * A custom hook that determines if an element should be visible based on scroll direction.
 * Hides on scroll down, shows on scroll up.
 * 
 * @param threshold - The minimum scroll distance in pixels ($\Delta y$) before toggling visibility.
 * @returns boolean - true if the user is scrolling up or at the top ($y = 0$).
 */
export function useScrollVisibility(threshold: number = 10) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0); // Optimization: using ref instead of state

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Ignore bounce scrolling (e.g., pulling past the top in Safari)
      if (currentScrollY < 0) return;

      // Calculate the difference: $\Delta y = currentScrollY - lastScrollY.current$
      const deltaY = Math.abs(currentScrollY - lastScrollY.current);

      // Bail out if the user hasn't scrolled past our mathematical threshold
      if (deltaY < threshold) return;

      // Determine visibility: true if scrolling UP or exactly at the top ($y = 0$)
      const isScrollingUp = currentScrollY < lastScrollY.current;
      const shouldBeVisible = isScrollingUp || currentScrollY === 0;

      // Update state ONLY if the boolean actually changed (prevents React re-render loops)
      setIsVisible((prevIsVisible) => {
        if (prevIsVisible !== shouldBeVisible) {
          return shouldBeVisible;
        }
        return prevIsVisible;
      });

      // Update the ref value silently
      lastScrollY.current = currentScrollY;
    };

    // { passive: true } is crucial for smooth 60fps scrolling performance!
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Cleanup function
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]); // We only re-run the effect if the threshold changes!

  return isVisible;
}
