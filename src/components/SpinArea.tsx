import { useMemo, useState } from 'react';
import Wheel from './Wheel/Wheel';
import SpinResult from './SpinResult';
import { useApp } from '../store/useApp';
import { activeTeamsFor } from '../data';
import type { SpinStatus, Team } from '../types';

export default function SpinArea() {
  const { state, dispatch } = useApp();

  const teams = useMemo(
    () => activeTeamsFor(state.selectedLeagueIds, state.disabledTeamIds, state.removedRoundTeamIds),
    [state.selectedLeagueIds, state.disabledTeamIds, state.removedRoundTeamIds],
  );

  const [status, setStatus] = useState<SpinStatus>('idle');
  const [winner, setWinner] = useState<Team | null>(null);

  const canSpin = teams.length >= 2;

  const handleSpinStart = () => {
    if (!canSpin || status === 'spinning') return;
    setWinner(null);
    setStatus('spinning');
  };

  const handleSpinComplete = (team: Team) => {
    setStatus('finished');
    setWinner(team);
    dispatch({ type: 'ADD_TO_HISTORY', teamId: team.id });
    if (state.removeSelectedFromPool) {
      dispatch({ type: 'REMOVE_FROM_POOL', teamId: team.id });
    }
  };

  return (
    <main className="spin-area">
      <div className="panel spin-panel">
        <div className="spin-controls">
          <Wheel
            teams={teams}
            spinning={status === 'spinning'}
            highlightTeamId={winner?.id}
            onSpinComplete={handleSpinComplete}
          />
          <button
            className="btn btn-primary"
            onClick={handleSpinStart}
            disabled={!canSpin || status === 'spinning'}
          >
            {status === 'spinning' ? 'Çevriliyor…' : 'ÇEVİR'}
          </button>
          <p className="spin-count">Havuzda {teams.length} takım var</p>
        </div>
        <SpinResult status={status} winner={winner} />
      </div>
    </main>
  );
}