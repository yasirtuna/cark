import type { SpinState } from '../store/reducer';
import { initialState } from '../store/reducer';

const STORAGE_KEY = 'fifa-team-wheel-v1';
const STORAGE_VERSION = 1;

interface PersistedPayload {
  version: number;
  state: SpinState;
}

function isSpinState(value: unknown): value is SpinState {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.selectedLeagueIds) &&
    Array.isArray(v.disabledTeamIds) &&
    Array.isArray(v.removedRoundTeamIds) &&
    typeof v.removeSelectedFromPool === 'boolean' &&
    Array.isArray(v.history)
  );
}

export function loadState(): Partial<SpinState> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const payload = parsed as Record<string, unknown>;
    if (payload.version !== STORAGE_VERSION) return {};
    if (!isSpinState(payload.state)) return {};
    return payload.state as Partial<SpinState>;
  } catch {
    return {};
  }
}

export function saveState(state: SpinState): void {
  try {
    const payload: PersistedPayload = { version: STORAGE_VERSION, state };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Depolama dolu ya da kısıtlı olabilir; sessizce yok say.
  }
}

export function migrateState(persisted: Partial<SpinState>): SpinState {
  return {
    ...initialState,
    ...persisted,
    disabledTeamIds: Array.isArray(persisted.disabledTeamIds) ? persisted.disabledTeamIds : [],
    removedRoundTeamIds: Array.isArray(persisted.removedRoundTeamIds)
      ? persisted.removedRoundTeamIds
      : [],
    history: Array.isArray(persisted.history) ? persisted.history : [],
  };
}