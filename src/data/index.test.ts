import { describe, it, expect } from 'vitest';
import { leagues, allTeams, allLeagueIds } from './index';

describe('lig verileri', () => {
  it('11 kategori tanımlanmış olmalı (10 lig + milli takımlar)', () => {
    expect(leagues).toHaveLength(11);
  });

  it('tüm lig idleri benzersiz olmalı', () => {
    expect(new Set(allLeagueIds).size).toBe(allLeagueIds.length);
  });

  it('takım idleri benzersiz olmalı', () => {
    const ids = allTeams.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('tüm takımların leagueId referansı geçerli olmalı', () => {
    const leagueIds = new Set(allLeagueIds);
    for (const team of allTeams) {
      expect(leagueIds.has(team.leagueId)).toBe(true);
    }
  });

  it('5 büyük lig + diğer ligler tanımlı olmalı', () => {
    const names = new Set(leagues.map((l) => l.name));
    for (const expected of [
      'Premier League',
      'La Liga',
      'Serie A',
      'Bundesliga',
      'Ligue 1',
      'Süper Lig',
      'Primeira Liga',
      'Saudi Pro League',
      'Primera División',
      'Major League Soccer',
      'Milli Takımlar',
    ]) {
      expect(names.has(expected)).toBe(true);
    }
  });

  it('milli takımlar ayrı kategoride toplanmalı', () => {
    const national = leagues.find((l) => l.type === 'NATIONAL_TEAM');
    expect(national).toBeDefined();
    expect(national!.teams.length).toBeGreaterThanOrEqual(20);
    for (const team of national!.teams) {
      expect(team.type).toBe('NATIONAL_TEAM');
    }
  });

  it('takım sayıları 2026/27 lig boyutlarıyla uyumlu olmalı', () => {
    const byName = new Map(leagues.map((l) => [l.name, l]));
    expect(byName.get('Premier League')!.teams).toHaveLength(20);
    expect(byName.get('La Liga')!.teams).toHaveLength(20);
    expect(byName.get('Serie A')!.teams).toHaveLength(20);
    expect(byName.get('Bundesliga')!.teams).toHaveLength(18);
    expect(byName.get('Ligue 1')!.teams).toHaveLength(18);
    expect(byName.get('Süper Lig')!.teams).toHaveLength(18);
    expect(byName.get('Primeira Liga')!.teams).toHaveLength(18);
    expect(byName.get('Saudi Pro League')!.teams).toHaveLength(18);
  });
});