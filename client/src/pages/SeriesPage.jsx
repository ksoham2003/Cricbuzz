import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { EmptyState, ErrorState, LoadingState } from '../components/PageStates';
import { apiErrorMessage, formatDate, getId, unwrapList } from '../utils/format';

export default function SeriesPage() {
  const [state, setState] = useState({ loading: true, error: '', series: [] });

  const loadSeries = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await apiService.getSeries({ limit: 40 });
      setState({ loading: false, error: '', series: unwrapList(response) });
    } catch (error) {
      setState({ loading: false, error: apiErrorMessage(error), series: [] });
    }
  };

  useEffect(() => {
    loadSeries();
  }, []);

  return (
    <div className="page-shell">
      <div className="section-heading">
        <div>
          <h1>Series</h1>
          <p>Tournaments, tours, and competitions available publicly.</p>
        </div>
      </div>

      {state.loading && <LoadingState />}
      {state.error && <ErrorState message={state.error} onRetry={loadSeries} />}
      {!state.loading && !state.error && (
        state.series.length ? (
          <div className="content-grid">
            {state.series.map((series) => (
              <article className="entity-card" key={getId(series)}>
                <div className="meta-row">
                  <span className="chip">{series.status || 'Status TBA'}</span>
                  <span className="chip">{series.format || 'Format TBA'}</span>
                </div>
                <h3>{series.name}</h3>
                <p>{series.description || series.shortName || 'Series details will be updated soon.'}</p>
                <p>{formatDate(series.startDate)} - {formatDate(series.endDate)}</p>
                <div className="card-actions">
                  <Link to={`/matches?series=${getId(series)}`}>Matches</Link>
                  <Link to={`/series/${getId(series)}/points-table`}>Points table</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No series found" message="Series records have not been added yet." />
        )
      )}
    </div>
  );
}
