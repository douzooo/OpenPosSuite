import { useState, useEffect, useCallback } from 'react';

export function useInactivity(timeout = 60000) {
  const [lastActive, setLastActive] = useState(Date.now());
  const [isInactive, setIsInactive] = useState(false);

  const resetTimer = useCallback(() => {
    setLastActive(Date.now());
    setIsInactive(false);
  }, []);

  useEffect(() => {
    const events = ['click', 'keypress', 'mousemove', 'touchstart'];

    // Only listen for activity when not inactive
    if (!isInactive) {
      events.forEach(e => window.addEventListener(e, resetTimer));
    }

    const interval = setInterval(() => {
      if (Date.now() - lastActive > timeout) {
        setIsInactive(true);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [lastActive, resetTimer, timeout, isInactive]);

  return { isInactive, resetTimer, lastActive };
}
