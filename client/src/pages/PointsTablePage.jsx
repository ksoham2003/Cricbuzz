import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { EmptyState, ErrorState, LoadingState } from '../components/PageStates';
import { apiErrorMessage } from '../utils/format';

export default function PointsTablePage() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: '', data: null });

  const loadTable = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await apiService.getPointsTable(id);
      setState({ loading: false, error: '', data: response.data.data });
    } catch (error) {
      setState({ loading: false, error: apiErrorMessage(error), data: null });
    }
  };

  useEffect(() => {
    loadTable();
  }, [id]);

  const standings = state.data?.standings || state.data?.pointsTable || [];

  return (
    <div className="page-shell">
      <div className="section-heading">
        <div>
          <h1>Points Table</h1>
          <p>{state.data?.seriesName || 'Series standings'}</p>
        </div>
        <Link className="btn ghost" to="/series">All series</Link>
      </div>

      {state.loading && <LoadingState />}
      {state.error && <ErrorState message={state.error} onRetry={loadTable} />}
      {!state.loading && !state.error && (
        standings.length ? (
          <div className="panel table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Played</th>
                  <th>Won</th>
                  <th>Lost</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row) => (
                  <tr key={row.teamId || row.teamName}>
                    <td><b>{row.teamShortName || row.teamName}</b></td>
                    <td>{row.played}</td>
                    <td>{row.won}</td>
                    <td>{row.lost}</td>
                    <td><b>{row.points}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No standings yet" message="Points table appears once teams and completed matches exist." />
        )
      )}
    </div>
  );
}
