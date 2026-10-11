import type { League, TeamType } from '../types';

export type TeamSeed = string | { name: string; country: string };

export interface LeagueSeed {
  id: string;
  name: string;
  country: string;
  type: TeamType;
  teams: TeamSeed[];
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export function createLeague(seed: LeagueSeed): League {
  return {
    id: seed.id,
    name: seed.name,
    country: seed.country,
    type: seed.type,
    teams: seed.teams.map((team) => {
      const name = typeof team === 'string' ? team : team.name;
      const country = typeof team === 'string' ? seed.country : team.country;
      return {
        id: `${seed.id}-${slugify(name)}`,
        name,
        country,
        leagueId: seed.id,
        type: seed.type,
      };
    }),
  };
}