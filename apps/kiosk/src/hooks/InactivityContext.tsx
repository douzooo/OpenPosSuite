import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

type InactivityContextType = {
  isInactive: boolean;
  resetTimer: () => void;
};

const InactivityContext = createContext<InactivityContextType | undefined>(undefined);

export function InactivityProvider({
  children,
  timeout = 60000,
}: {
  children: React.ReactNode;
  timeout?: number;
}) {
  const [isInactive, setIsInactive] = useState(false);
  const lastActiveRef = useRef(Date.now());

  const resetTimer = useCallback(() => {
    lastActiveRef.current = Date.now();
    setIsInactive(false);
  }, []);

  useEffect(() => {
    const events = ['click', 'keypress', 'mousemove', 'touchstart'];

    const handleActivity = () => {
      if (!isInactive) {
        lastActiveRef.current = Date.now();
      }
    };

    events.forEach(e => window.addEventListener(e, handleActivity));

    const interval = setInterval(() => {
      if (!isInactive && Date.now() - lastActiveRef.current > timeout) {
        setIsInactive(true);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      events.forEach(e => window.removeEventListener(e, handleActivity));
    };
  }, [timeout, isInactive]);

  return (
    <InactivityContext.Provider value={{ isInactive, resetTimer }}>
      {children}
    </InactivityContext.Provider>
  );
}

export function useInactivity() {
  const ctx = useContext(InactivityContext);
  if (!ctx) {
    throw new Error('useInactivity must be used within an InactivityProvider');
  }
  return ctx;
}
