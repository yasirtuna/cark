import { teamsByIds, leagueById } from '../data';
import { useApp } from '../store/useApp';

export default function SpinHistory() {
  const { state, dispatch } = useApp();

  if (state.history.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Son Seçimler</h2>
        </div>
        <p className="panel-empty">Henüz seçim yapılmadı.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Son Seçimler</h2>
        <button className="btn btn-sm" onClick={() => dispatch({ type: 'CLEAR_HISTORY' })}>
          Temizle
        </button>
      </div>
      <ol className="history-list">
        {state.history.map((entry, index) => {
          const team = teamsByIds([entry.teamId])[0];
          if (!team) return null;
          const league = leagueById(team.leagueId);
          return (
            <li key={entry.at + '-' + entry.teamId} className="history-item">
              <span className="history-rank">{index + 1}</span>
              <span className="history-team">
                {team.name}
                {league && <span className="history-league">{league.name}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}