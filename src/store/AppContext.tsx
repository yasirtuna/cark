import { useEffect, useReducer, type ReactNode } from 'react';
import { spinReducer, type SpinState } from './reducer';
import { AppContext } from './useApp';
import { loadState, migrateState, saveState } from '../lib/storage';
import { allLeagueIds } from '../data';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(spinReducer, undefined, initState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

function initState(): SpinState {
  const persisted = loadState();
  const state = migrateState(persisted);
  if (persisted.selectedLeagueIds === undefined && state.selectedLeagueIds.length === 0) {
    return { ...state, selectedLeagueIds: allLeagueIds };
  }
  return state;
}

export type { SpinState };