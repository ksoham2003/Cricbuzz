import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { EmptyState, ErrorState, LoadingState } from '../components/PageStates';
import { apiErrorMessage, getId, unwrapList } from '../utils/format';

export default function SquadsPage() {
  const [state, setState] = useState({ loading: true, error: '', squads: [] });

  const loadSquads = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await apiService.getSquads({ limit: 60 });
      setState({ loading: false, error: '', squads: unwrapList(response) });
    } catch (error) {
      setState({ loading: false, error: apiErrorMessage(error), squads: [] });
    }
  };

  useEffect(() => {
    loadSquads();
  }, []);

  return (
    <div className="page-shell">
      <div className="section-heading">
        <div>
          <h1>Squads</h1>
          <p>Published team squads from the public backend API.</p>
        </div>
      </div>

      {state.loading && <LoadingState />}
      {state.error && <ErrorState message={state.error} onRetry={loadSquads} />}
      {!state.loading && !state.error && (
        state.squads.length ? (
          <div className="content-grid">
            {state.squads.map((squad) => {
              const players = squad.players || squad.squadPlayers || [];
              return (
                <article className="entity-card" key={getId(squad)}>
                  <div className="meta-row">
                    <span className="chip">{squad.status || 'Squad'}</span>
                    <span className="chip">{players.length || squad.totalPlayers || 0} players</span>
                  </div>
                  <h3>{squad.teamId?.name || squad.team?.name || 'Team squad'}</h3>
                  <p>{squad.seriesId?.name || squad.series?.name || 'Series not linked yet.'}</p>
                  {players.length > 0 && (
                    <div className="meta-row">
                      {players.slice(0, 5).map((entry) => {
                        const player = entry.player || entry;
                        return <span className="chip" key={getId(player)}>{player.fullName || player.name || 'Player'}</span>;
                      })}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No squads published" message="Squads will appear here once backend records are created." />
        )
      )}
    </div>
  );
}
