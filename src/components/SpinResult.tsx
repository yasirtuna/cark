import type { Team, SpinStatus } from '../types';

interface SpinResultProps {
  status: SpinStatus;
  winner: Team | null;
}

export default function SpinResult({ status, winner }: SpinResultProps) {
  return (
    <div className="spin-result">
      <p className="result-label">Seçilen Takım</p>
      {status === 'spinning' ? (
        <p className="result-empty spinning-dots">Çark çevriliyor…</p>
      ) : winner ? (
        <div className="result-team celebrate" key={winner.id}>
          <span className="country-badge">⚽</span>
          <span className="result-name">{winner.name}</span>
        </div>
      ) : (
        <p className="result-empty">Çarkı çevir ve rastgele takımını seç</p>
      )}
    </div>
  );
}