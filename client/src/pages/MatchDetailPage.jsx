import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { socketService } from '../services/socket';
import { EmptyState, ErrorState, LoadingState } from '../components/PageStates';
import { apiErrorMessage, formatDate, statusLabel, teamName } from '../utils/format';

export default function MatchDetailPage() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: '', data: null });

  const loadMatch = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await apiService.getMatchById(id);
      setState({ loading: false, error: '', data: response.data.data });
    } catch (error) {
      setState({ loading: false, error: apiErrorMessage(error), data: null });
    }
  };

  useEffect(() => {
    loadMatch();
  }, [id]);

  useEffect(() => {
    socketService.joinMatch(id);

    const refreshMatch = () => loadMatch();
    const updateScore = (score) => {
      setState((current) => {
        const currentScores = current.data?.scores || [];
        const exists = currentScores.some((item) => item._id === score._id);
        const scores = exists
          ? currentScores.map((item) => (item._id === score._id ? score : item))
          : [...currentScores, score];
        return {
          ...current,
          data: current.data ? { ...current.data, scores } : current.data,
        };
      });
    };

    socketService.onScoreUpdate(updateScore);
    socketService.onMatchStatusChange(refreshMatch);
    socketService.onPlayingXIUpdated(refreshMatch);

    return () => {
      socketService.offScoreUpdate();
      socketService.offMatchStatusChange();
      socketService.offPlayingXIUpdated();
      socketService.leaveMatch(id);
    };
  }, [id]);

  if (state.loading) return <div className="page-shell"><LoadingState /></div>;
  if (state.error) return <div className="page-shell"><ErrorState message={state.error} onRetry={loadMatch} /></div>;

  const match = state.data?.match;
  const scores = state.data?.scores || [];

  if (!match) {
    return <div className="page-shell"><EmptyState title="Match unavailable" /></div>;
  }

  return (
    <div className="page-shell">
      <section className="detail-hero">
        <div className="match-card-top">
          <span className={`status-badge ${match.status === 'LIVE' ? 'live' : ''}`}>{statusLabel(match.status)}</span>
          <span>{formatDate(match.startTime, { time: true })}</span>
        </div>
        <div className="teams-line">
          <div><b>{teamName(match.team1)}</b><small>{match.team1?.name}</small></div>
          <span>vs</span>
          <div><b>{teamName(match.team2)}</b><small>{match.team2?.name}</small></div>
        </div>
        <p>{match.seriesId?.name || 'Series TBA'}</p>
        {match.result && <strong>{match.result}</strong>}
        <div className="hero-actions">
          <Link className="btn primary" to={`/matches/${id}/commentary`}>Ball-by-ball commentary</Link>
          {match.seriesId?._id && <Link className="btn ghost" to={`/series/${match.seriesId._id}/points-table`}>Points table</Link>}
        </div>
      </section>

      <div className="two-column mt-5">
        <section className="panel">
          <div className="section-heading">
            <h2>Scorecard</h2>
          </div>
          {scores.length ? (
            <div className="score-row">
              {scores.map((score) => (
                <div className="score-box" key={score._id}>
                  <span>{score.battingTeam?.name || `Innings ${score.innings}`}</span>
                  <b>{score.score ?? score.runs ?? 0}/{score.wickets ?? 0}</b>
                  <small>{score.overs ?? 0} overs</small>
                  <small>RR {score.runRate ?? '-'}</small>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Scorecard not started" message="Scores will appear when innings data is available." />
          )}
        </section>

        <aside className="panel">
          <h2>Match Info</h2>
          <p><b>Venue:</b> {match.venue || 'TBA'}</p>
          <p><b>Toss:</b> {match.tossWinner?.name || 'TBA'}</p>
          <p><b>Decision:</b> {match.tossDecision || 'TBA'}</p>
          <p><b>Winner:</b> {match.winner?.name || 'TBA'}</p>
        </aside>
      </div>

      <div className="two-column mt-5">
        <PlayingXiPanel title={teamName(match.team1)} players={match.playingXI?.team1} />
        <PlayingXiPanel title={teamName(match.team2)} players={match.playingXI?.team2} />
      </div>
    </div>
  );
}

function PlayingXiPanel({ title, players = [] }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>{title} XI</h2>
          <p>{players?.length || 0} players selected</p>
        </div>
      </div>
      {players?.length ? (
        <div className="discovery-list">
          {players.map((entry) => (
            <span key={entry.player?._id || entry._id}>
              {entry.player?.fullName || 'Player'}
              {entry.isCaptain ? ' (c)' : ''}
              {entry.isWicketKeeper ? ' (wk)' : ''}
            </span>
          ))}
        </div>
      ) : (
        <EmptyState title="XI not selected" message="Playing XI appears after selection." />
      )}
    </section>
  );
}
