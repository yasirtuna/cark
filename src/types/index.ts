export type TeamType = 'CLUB' | 'NATIONAL_TEAM';

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  country: string;
  leagueId: string;
  type: TeamType;
}

export interface League {
  id: string;
  name: string;
  country: string;
  type: TeamType;
  teams: Team[];
}

export interface HistoryEntry {
  teamId: string;
  at: number;
}

export type SpinStatus = 'idle' | 'spinning' | 'finished';