import { useState, useEffect, useRef } from 'react';

/**
 * Simulates a loading progress bar that fills quickly at first then slows,
 * jumps to 100 when loading finishes, and auto-resets after the animation.
 *
 * @param isLoading - true while the async operation is in progress
 * @returns         - a number 0–100 representing simulated progress
 */
export const useSimulatedProgress = (isLoading: boolean): number => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    if (isLoading) {
      clearTimers();
      setProgress(0);

      let p = 0;
      intervalRef.current = setInterval(() => {
        // Speed slows as progress approaches 90 — never auto-completes
        const increment = Math.random() * 12 * (1 - p / 100);
        p = Math.min(90, p + increment);
        setProgress(p);
        if (p >= 90) clearInterval(intervalRef.current!);
      }, 180);
    } else {
      clearTimers();
      // Jump to 100% then fade out
      setProgress(100);
      timeoutRef.current = setTimeout(() => setProgress(0), 700);
    }

    return clearTimers;
  }, [isLoading]);

  return Math.min(100, Math.max(0, progress));
};
