import { useState, useEffect, useCallback } from 'react';

export function useInactivity(timeout = 60000) { // default 1 min
  const [lastActive, setLastActive] = useState(Date.now());
  const [isInactive, setIsInactive] = useState(false);

  const resetTimer = useCallback(() => {
    setLastActive(Date.now());
    setIsInactive(false);
  }, []);

  useEffect(() => {
    const events = ['click', 'keypress', 'mousemove', 'touchstart'];

    events.forEach(e => window.addEventListener(e, resetTimer));

    const interval = setInterval(() => {
      if (Date.now() - lastActive > timeout) {
        setIsInactive(true);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [lastActive, resetTimer, timeout]);

  return { isInactive, resetTimer, lastActive };
}
