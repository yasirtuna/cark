import { describe, it, expect } from 'vitest';
import { initialState, spinReducer } from './reducer';

describe('spinReducer', () => {
  it('TOGGLE_LEAGUE ekleme/çıkarma yapmalı', () => {
    let s = spinReducer(initialState, { type: 'TOGGLE_LEAGUE', leagueId: 'eng-prl' });
    expect(s.selectedLeagueIds).toEqual(['eng-prl']);
    s = spinReducer(s, { type: 'TOGGLE_LEAGUE', leagueId: 'tr-superlig' });
    expect(s.selectedLeagueIds).toEqual(['eng-prl', 'tr-superlig']);
    s = spinReducer(s, { type: 'TOGGLE_LEAGUE', leagueId: 'eng-prl' });
    expect(s.selectedLeagueIds).toEqual(['tr-superlig']);
  });

  it('SELECT_ALL_LEAGUES & CLEAR_ALL_LEAGUES çalışmalı', () => {
    const s = spinReducer(initialState, {
      type: 'SELECT_ALL_LEAGUES',
      leagueIds: ['a', 'b', 'c'],
    });
    expect(s.selectedLeagueIds).toEqual(['a', 'b', 'c']);
    expect(spinReducer(s, { type: 'CLEAR_ALL_LEAGUES' }).selectedLeagueIds).toEqual([]);
  });

  it('TOGGLE_TEAM devre dışı bırakma/geri alma yapmalı', () => {
    let s = spinReducer(initialState, { type: 'TOGGLE_TEAM', teamId: 'eng-prl-liverpool' });
    expect(s.disabledTeamIds).toEqual(['eng-prl-liverpool']);
    s = spinReducer(s, { type: 'TOGGLE_TEAM', teamId: 'eng-prl-liverpool' });
    expect(s.disabledTeamIds).toEqual([]);
  });

  it('REMOVE_FROM_POOL benzersiz ekler, RESET_POOL temizler', () => {
    let s = spinReducer(initialState, { type: 'REMOVE_FROM_POOL', teamId: 'eng-prl-liverpool' });
    s = spinReducer(s, { type: 'REMOVE_FROM_POOL', teamId: 'eng-prl-liverpool' });
    expect(s.removedRoundTeamIds).toEqual(['eng-prl-liverpool']);
    expect(spinReducer(s, { type: 'RESET_POOL' }).removedRoundTeamIds).toEqual([]);
  });

  it('ADD_TO_HISTORY en yeni en üstte ve 20 ile sınırlı', () => {
    let s = initialState;
    for (let i = 0; i < 25; i++) {
      s = spinReducer(s, { type: 'ADD_TO_HISTORY', teamId: `team-${i}` });
    }
    expect(s.history).toHaveLength(20);
    expect(s.history[0].teamId).toBe('team-24');
    expect(spinReducer(s, { type: 'CLEAR_HISTORY' }).history).toEqual([]);
  });

  it('SET_REMOVE_SELECTED toggle eder', () => {
    const s = spinReducer(initialState, { type: 'SET_REMOVE_SELECTED' });
    expect(s.removeSelectedFromPool).toBe(true);
    expect(spinReducer(s, { type: 'SET_REMOVE_SELECTED' }).removeSelectedFromPool).toBe(false);
  });

  it('RESET_ALL seçili ligleri korur, gerisini sıfırlar', () => {
    const touched = spinReducer(initialState, { type: 'SELECT_ALL_LEAGUES', leagueIds: ['a'] });
    const removed = spinReducer(touched, { type: 'REMOVE_FROM_POOL', teamId: 'x' });
    const reset = spinReducer(removed, { type: 'RESET_ALL' });
    expect(reset.selectedLeagueIds).toEqual(['a']);
    expect(reset.disabledTeamIds).toEqual([]);
    expect(reset.removedRoundTeamIds).toEqual([]);
    expect(reset.history).toEqual([]);
  });
});