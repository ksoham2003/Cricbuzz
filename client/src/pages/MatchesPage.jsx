import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import MatchCard from '../components/MatchCard';
import { EmptyState, ErrorState, LoadingState } from '../components/PageStates';
import { apiErrorMessage, unwrapList } from '../utils/format';

const statusOptions = ['', 'LIVE', 'UPCOMING', 'COMPLETED', 'INNINGS_BREAK'];

export default function MatchesPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('');
  const [state, setState] = useState({ loading: true, error: '', matches: [] });

  const loadMatches = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const series = searchParams.get('series');
      const response = await apiService.getMatches({
        limit: 30,
        ...(status ? { status } : {}),
        ...(series ? { series } : {}),
      });
      setState({ loading: false, error: '', matches: unwrapList(response) });
    } catch (error) {
      setState({ loading: false, error: apiErrorMessage(error), matches: [] });
    }
  };

  useEffect(() => {
    loadMatches();
  }, [status, searchParams]);

  return (
    <div className="page-shell">
      <div className="section-heading">
        <div>
          <h1>Matches</h1>
          <p>Public match center from the backend match feed.</p>
        </div>
      </div>

      <div className="filters">
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {statusOptions.map((option) => (
            <option key={option || 'all'} value={option}>
              {option ? option.replaceAll('_', ' ') : 'All statuses'}
            </option>
          ))}
        </select>
      </div>

      {state.loading && <LoadingState />}
      {state.error && <ErrorState message={state.error} onRetry={loadMatches} />}
      {!state.loading && !state.error && (
        state.matches.length ? (
          <div className="content-grid">
            {state.matches.map((match) => <MatchCard key={match._id} match={match} />)}
          </div>
        ) : (
          <EmptyState title="No matches found" message="Try another status filter." />
        )
      )}
    </div>
  );
}
