import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { EmptyState, ErrorState, LoadingState } from '../components/PageStates';
import { apiErrorMessage, getId, playerName } from '../utils/format';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [state, setState] = useState({ loading: false, error: '', results: null });

  const runSearch = async (event) => {
    event?.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setState({ loading: false, error: '', results: null });
      return;
    }

    setSearchParams({ q: trimmed, ...(type ? { type } : {}) });
    setState({ loading: true, error: '', results: null });
    try {
      const response = await apiService.search({ q: trimmed, ...(type ? { type } : {}) });
      setState({ loading: false, error: '', results: response.data.data.results });
    } catch (error) {
      setState({ loading: false, error: apiErrorMessage(error), results: null });
    }
  };

  useEffect(() => {
    if (searchParams.get('q')) {
      runSearch();
    }
  }, []);

  const buckets = Array.isArray(state.results)
    ? { [type || 'results']: state.results }
    : state.results || {};

  return (
    <div className="page-shell">
      <div className="section-heading">
        <div>
          <h1>Search</h1>
          <p>Search players, teams, and series using the public API.</p>
        </div>
      </div>

      <form className="filters" onSubmit={runSearch}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cricket..." />
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">All types</option>
          <option value="player">Players</option>
          <option value="team">Teams</option>
          <option value="series">Series</option>
        </select>
        <button className="btn primary" type="submit">Search</button>
      </form>

      {state.loading && <LoadingState label="Searching..." />}
      {state.error && <ErrorState message={state.error} onRetry={runSearch} />}
      {!state.loading && !state.error && !state.results && (
        <EmptyState title="Search public cricket data" message="Enter at least two characters to begin." />
      )}
      {!state.loading && !state.error && state.results && (
        <div className="content-grid">
          {Object.entries(buckets).flatMap(([bucket, items]) =>
            (items || []).map((item) => (
              <article className="entity-card" key={`${bucket}-${getId(item)}`}>
                <span className="chip">{bucket}</span>
                <h3>{bucket === 'players' || bucket === 'player' ? playerName(item) : item.name}</h3>
                <p>{item.description || item.country || item.city || item.shortName || 'No description available.'}</p>
                {bucket === 'series' && <Link to={`/series/${getId(item)}/points-table`}>Points table</Link>}
              </article>
            ))
          )}
          {!Object.values(buckets).some((items) => items?.length) && (
            <EmptyState title="No results" message="Try a different query." />
          )}
        </div>
      )}
    </div>
  );
}
