import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { socketService } from '../services/socket';
import { EmptyState, ErrorState, LoadingState } from '../components/PageStates';
import { apiErrorMessage, unwrapList } from '../utils/format';

export default function CommentaryPage() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: '', commentary: [] });

  const loadCommentary = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await apiService.getMatchCommentary(id, { limit: 80 });
      setState({ loading: false, error: '', commentary: unwrapList(response) });
    } catch (error) {
      setState({ loading: false, error: apiErrorMessage(error), commentary: [] });
    }
  };

  useEffect(() => {
    loadCommentary();
  }, [id]);

  useEffect(() => {
    socketService.joinMatch(id);

    const addCommentary = (item) => {
      setState((current) => {
        if (current.commentary.some((entry) => entry._id === item._id)) return current;
        return { ...current, commentary: [...current.commentary, item] };
      });
    };

    socketService.onCommentaryAdded(addCommentary);

    return () => {
      socketService.offCommentaryAdded();
      socketService.leaveMatch(id);
    };
  }, [id]);

  return (
    <div className="page-shell">
      <div className="section-heading">
        <div>
          <h1>Commentary</h1>
          <p>Ball-by-ball feed for this match.</p>
        </div>
        <Link className="btn ghost" to={`/matches/${id}`}>Match center</Link>
      </div>

      {state.loading && <LoadingState />}
      {state.error && <ErrorState message={state.error} onRetry={loadCommentary} />}
      {!state.loading && !state.error && (
        state.commentary.length ? (
          <div className="commentary-list">
            {state.commentary.map((item) => (
              <article className="commentary-item" key={item._id}>
                <span className="ball-pill">{item.over ?? 0}.{item.ball ?? '-'}</span>
                <div>
                  <div className="meta-row">
                    <span className={`chip event-${String(item.type || item.commentaryType || 'NORMAL').toLowerCase()}`}>
                      {item.type || item.commentaryType || 'NORMAL'}
                    </span>
                    {item.wicket && <span className="chip">Wicket</span>}
                  </div>
                  <p>{item.text || item.commentary || item.description || 'No commentary text provided.'}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No commentary yet" message="This match does not have ball-by-ball entries yet." />
        )
      )}
    </div>
  );
}
