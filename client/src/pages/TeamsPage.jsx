import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { EmptyState, ErrorState, LoadingState } from '../components/PageStates';
import { apiErrorMessage, getId, unwrapList } from '../utils/format';

export default function TeamsPage() {
  const [state, setState] = useState({ loading: true, error: '', teams: [] });

  const loadTeams = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await apiService.getTeams({ limit: 60 });
      setState({ loading: false, error: '', teams: unwrapList(response) });
    } catch (error) {
      setState({ loading: false, error: apiErrorMessage(error), teams: [] });
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  return (
    <div className="page-shell">
      <div className="section-heading">
        <div>
          <h1>Teams</h1>
          <p>Browse public team profiles.</p>
        </div>
      </div>

      {state.loading && <LoadingState />}
      {state.error && <ErrorState message={state.error} onRetry={loadTeams} />}
      {!state.loading && !state.error && (
        state.teams.length ? (
          <div className="content-grid">
            {state.teams.map((team) => (
              <article
                className="entity-card"
                key={getId(team)}
                style={{ borderTop: `4px solid ${team.primaryColor || '#007a5a'}` }}
              >
                <div className="meta-row">
                  <span className="chip">{team.shortName || 'TEAM'}</span>
                  {team.city && <span className="chip">{team.city}</span>}
                </div>
                <h3>{team.name}</h3>
                <p>Primary color {team.primaryColor || 'not set'}.</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No teams found" message="Teams have not been published yet." />
        )
      )}
    </div>
  );
}
