import type { League, Team } from '../types';
import { premierLeague } from './leagues/premierLeague';
import { laLiga } from './leagues/laLiga';
import { serieA } from './leagues/serieA';
import { bundesliga } from './leagues/bundesliga';
import { ligue1 } from './leagues/ligue1';
import { superLig } from './leagues/superLig';
import { primeiraLiga } from './leagues/primeiraLiga';
import { saudiProLeague } from './leagues/saudiProLeague';
import { primeraDivision } from './leagues/primeraDivision';
import { mls } from './leagues/mls';
import { nationalTeams } from './leagues/nationalTeams';

export const leagues: League[] = [
  premierLeague,
  laLiga,
  serieA,
  bundesliga,
  ligue1,
  superLig,
  primeiraLiga,
  saudiProLeague,
  primeraDivision,
  mls,
  nationalTeams,
];

export const allTeams: Team[] = leagues.flatMap((league) => league.teams);

const teamIndex = new Map(allTeams.map((team) => [team.id, team]));

const leagueIndex = new Map(leagues.map((league) => [league.id, league]));

export function teamById(id: string): Team | undefined {
  return teamIndex.get(id);
}

export function leagueById(id: string): League | undefined {
  return leagueIndex.get(id);
}

export function teamsByIds(ids: string[]): Team[] {
  const result: Team[] = [];
  for (const id of ids) {
    const team = teamIndex.get(id);
    if (team) result.push(team);
  }
  return result;
}

export function activeTeamsFor(
  selectedLeagueIds: string[],
  disabledTeamIds: string[],
  removedRoundTeamIds: string[] = [],
): Team[] {
  const selected = new Set(selectedLeagueIds);
  const excluded = new Set([...disabledTeamIds, ...removedRoundTeamIds]);
  return allTeams.filter((team) => selected.has(team.leagueId) && !excluded.has(team.id));
}

export const allLeagueIds = leagues.map((league) => league.id);

const idSet = new Set(allTeams.map((team) => team.id));
if (idSet.size !== allTeams.length) {
  throw new Error('Veri hatası: yinelenen takım ID\'leri var.');
}