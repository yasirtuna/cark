import { createContext, useContext, type Dispatch } from 'react';
import type { SpinAction, SpinState } from './reducer';

export const AppContext = createContext<{
  state: SpinState;
  dispatch: Dispatch<SpinAction>;
} | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}