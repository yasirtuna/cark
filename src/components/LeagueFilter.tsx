import { useState } from 'react';
import { allLeagueIds, leagues } from '../data';
import { useApp } from '../store/useApp';

export default function LeagueFilter() {
  const { state, dispatch } = useApp();
  const selected = new Set(state.selectedLeagueIds);
  const disabled = new Set(state.disabledTeamIds);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (leagueId: string) => {
    setExpanded((current) => (current === leagueId ? null : leagueId));
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Ligler & Takımlar</h2>
        <div className="panel-actions">
          <button
            className="btn btn-sm"
            onClick={() => dispatch({ type: 'SELECT_ALL_LEAGUES', leagueIds: allLeagueIds })}
          >
            Tümünü Seç
          </button>
          <button className="btn btn-sm" onClick={() => dispatch({ type: 'CLEAR_ALL_LEAGUES' })}>
            Tümünü Temizle
          </button>
        </div>
      </div>

      <ul className="league-filter">
        {leagues.map((league) => {
          const isSelected = selected.has(league.id);
          const isExpanded = expanded === league.id;
          return (
            <li key={league.id}>
              <div className="league-row">
                <label className={`check-row ${isSelected ? '' : 'check-row-off'}`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => dispatch({ type: 'TOGGLE_LEAGUE', leagueId: league.id })}
                  />
                  <span className="check-name">
                    <span className="league-type">{league.type === 'NATIONAL_TEAM' ? '🏆' : '🛡️'}</span>
                    {league.name}
                  </span>
                  <span className="check-count">{league.teams.length}</span>
                </label>
                <button
                  className="expand-btn"
                  onClick={() => toggleExpand(league.id)}
                  aria-label={`${league.name} takım listesi`}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? '▾' : '▸'}
                </button>
              </div>
              {isExpanded && (
                <ul className="team-list">
                  {league.teams.map((team) => {
                    const isDisabled = disabled.has(team.id);
                    return (
                      <li key={team.id}>
                        <label className={`check-row check-row-sm ${isDisabled ? 'check-row-off' : ''}`}>
                          <input
                            type="checkbox"
                            checked={!isDisabled}
                            onChange={() => dispatch({ type: 'TOGGLE_TEAM', teamId: team.id })}
                            disabled={!isSelected}
                          />
                          <span className="check-name">{team.name}</span>
                          {isDisabled && <span className="check-off-label">çıkarıldı</span>}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}