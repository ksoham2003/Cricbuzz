import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { EmptyState, ErrorState, LoadingState } from '../components/PageStates';
import { apiErrorMessage, getId, playerName, unwrapList } from '../utils/format';

const roles = ['', 'BATSMAN', 'BOWLER', 'ALL_ROUNDER', 'WICKET_KEEPER'];

export default function PlayersPage() {
  const [role, setRole] = useState('');
  const [state, setState] = useState({ loading: true, error: '', players: [] });

  const loadPlayers = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await apiService.getPlayers({ limit: 60, ...(role ? { role } : {}) });
      setState({ loading: false, error: '', players: unwrapList(response) });
    } catch (error) {
      setState({ loading: false, error: apiErrorMessage(error), players: [] });
    }
  };

  useEffect(() => {
    loadPlayers();
  }, [role]);

  return (
    <div className="page-shell">
      <div className="section-heading">
        <div>
          <h1>Players</h1>
          <p>Public player directory with role and country filters.</p>
        </div>
      </div>

      <div className="filters">
        <select value={role} onChange={(event) => setRole(event.target.value)}>
          {roles.map((option) => (
            <option key={option || 'all'} value={option}>
              {option ? option.replaceAll('_', ' ') : 'All roles'}
            </option>
          ))}
        </select>
      </div>

      {state.loading && <LoadingState />}
      {state.error && <ErrorState message={state.error} onRetry={loadPlayers} />}
      {!state.loading && !state.error && (
        state.players.length ? (
          <div className="content-grid">
            {state.players.map((player) => (
              <article className="entity-card" key={getId(player)}>
                <div className="meta-row">
                  <span className="chip">{player.role || 'Role TBA'}</span>
                  {player.country && <span className="chip">{player.country}</span>}
                </div>
                <h3>{playerName(player)}</h3>
                <p>Jersey {player.jerseyNumber || 'TBA'} · Age {player.age || 'TBA'}</p>
                <p>{player.battingStyle || 'Batting TBA'} · {player.bowlingStyle || 'Bowling TBA'}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No players found" message="Try another role filter or add players in the backend." />
        )
      )}
    </div>
  );
}
