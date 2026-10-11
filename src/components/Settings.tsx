import { useApp } from '../store/useApp';

export default function Settings() {
  const { state, dispatch } = useApp();

  return (
    <div className="panel">
      <h2 className="panel-title">Ayarlar</h2>

      <label className="setting-row">
        <div className="setting-text">
          <strong>Seçilen takımı sonraki turlardan çıkar</strong>
          <span>Seçilen takım bir daha gelmesin</span>
        </div>
        <input
          type="checkbox"
          checked={state.removeSelectedFromPool}
          onChange={() => dispatch({ type: 'SET_REMOVE_SELECTED' })}
        />
      </label>

      <div className="settings-actions">
        <button className="btn btn-sm" onClick={() => dispatch({ type: 'RESET_POOL' })}>
          ⎌ Çarkı Sıfırla
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => dispatch({ type: 'RESET_ALL' })}
        >
          Tam Sıfırlama
        </button>
      </div>
    </div>
  );
}