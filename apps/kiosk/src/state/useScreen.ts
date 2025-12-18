import { useState } from 'react';
import type { Screen } from './screens';

export function useScreen() {
  const [screen, setScreen] = useState<Screen>('BOOT');

  return {
    screen,
    goTo: setScreen
  };
}
