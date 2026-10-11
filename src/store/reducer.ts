import type { HistoryEntry } from '../types';

export interface SpinState {
  selectedLeagueIds: string[];
  disabledTeamIds: string[];
  removedRoundTeamIds: string[];
  removeSelectedFromPool: boolean;
  history: HistoryEntry[];
}

export type SpinAction =
  | { type: 'TOGGLE_LEAGUE'; leagueId: string }
  | { type: 'SELECT_ALL_LEAGUES'; leagueIds: string[] }
  | { type: 'CLEAR_ALL_LEAGUES' }
  | { type: 'TOGGLE_TEAM'; teamId: string }
  | { type: 'REMOVE_FROM_POOL'; teamId: string }
  | { type: 'SET_REMOVE_SELECTED' }
  | { type: 'RESET_POOL' }
  | { type: 'ADD_TO_HISTORY'; teamId: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'RESET_ALL' };

export const initialState: SpinState = {
  selectedLeagueIds: [],
  disabledTeamIds: [],
  removedRoundTeamIds: [],
  removeSelectedFromPool: false,
  history: [],
};

export function spinReducer(state: SpinState, action: SpinAction): SpinState {
  switch (action.type) {
    case 'TOGGLE_LEAGUE':
      return state.selectedLeagueIds.includes(action.leagueId)
        ? { ...state, selectedLeagueIds: state.selectedLeagueIds.filter((id) => id !== action.leagueId) }
        : { ...state, selectedLeagueIds: [...state.selectedLeagueIds, action.leagueId] };

    case 'SELECT_ALL_LEAGUES':
      return { ...state, selectedLeagueIds: action.leagueIds };

    case 'CLEAR_ALL_LEAGUES':
      return { ...state, selectedLeagueIds: [] };

    case 'TOGGLE_TEAM':
      return state.disabledTeamIds.includes(action.teamId)
        ? { ...state, disabledTeamIds: state.disabledTeamIds.filter((id) => id !== action.teamId) }
        : { ...state, disabledTeamIds: [...state.disabledTeamIds, action.teamId] };

    case 'REMOVE_FROM_POOL':
      return state.removedRoundTeamIds.includes(action.teamId)
        ? state
        : { ...state, removedRoundTeamIds: [...state.removedRoundTeamIds, action.teamId] };

    case 'SET_REMOVE_SELECTED':
      return { ...state, removeSelectedFromPool: !state.removeSelectedFromPool };

    case 'RESET_POOL':
      return { ...state, removedRoundTeamIds: [] };

    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [{ teamId: action.teamId, at: Date.now() }, ...state.history].slice(0, 20),
      };

    case 'CLEAR_HISTORY':
      return { ...state, history: [] };

    case 'RESET_ALL':
      return { ...initialState, selectedLeagueIds: state.selectedLeagueIds };

    default:
      return state;
  }
}