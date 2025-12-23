import { createContext, useContext, useState, ReactNode } from 'react';
import type { Screen } from './screens';

type ScreenContextType = {
  screen: Screen;
  goTo: (s: Screen) => void;
};

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

export function ScreenProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('BOOT');

  return (
    <ScreenContext.Provider value={{ screen, goTo: setScreen }}>
      {children}
    </ScreenContext.Provider>
  );
}

export function useScreen() {
  const ctx = useContext(ScreenContext);
  if (!ctx) {
    throw new Error('useScreen must be used within a ScreenProvider');
  }
  return ctx;
}
