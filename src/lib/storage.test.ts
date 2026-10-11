import { describe, it, expect, beforeEach } from 'vitest';
import { loadState, saveState, migrateState } from './storage';
import { initialState } from '../store/reducer';

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saveState sonrası loadState aynı state döndürmeli', () => {
    const state = {
      ...initialState,
      selectedLeagueIds: ['eng-prl', 'tr-superlig'],
      disabledTeamIds: ['eng-prl-galatasaray'],
      removedRoundTeamIds: ['eng-prl-liverpool'],
      removeSelectedFromPool: true,
      history: [{ teamId: 'eng-prl-liverpool', at: 123 }],
    };
    saveState(state);
    const loaded = loadState();
    expect(loaded.selectedLeagueIds).toEqual(['eng-prl', 'tr-superlig']);
    expect(loaded.disabledTeamIds).toEqual(['eng-prl-galatasaray']);
    expect(loaded.removeSelectedFromPool).toBe(true);
  });

  it('boş depolamada boş kısmi state döner', () => {
    expect(loadState()).toEqual({});
  });

  it('bozuk JSON güvenle atlanır', () => {
    window.localStorage.setItem('fifa-team-wheel-v1', '{oops');
    expect(loadState()).toEqual({});
  });

  it('migrateState eksik alanları initialState ile tamamlar', () => {
    const state = migrateState({});
    expect(state).toEqual(initialState);
  });
});