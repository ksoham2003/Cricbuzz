import { Link } from 'react-router-dom';
import { formatDate, getId, statusLabel, teamName } from '../utils/format';

export default function MatchCard({ match, compact = false }) {
  const id = getId(match);
  const isLive = ['LIVE', 'INNINGS_BREAK'].includes(match?.status);

  return (
    <article className={`match-card ${compact ? 'compact' : ''}`}>
      <div className="match-card-top">
        <span className={`status-badge ${isLive ? 'live' : ''}`}>{statusLabel(match?.status)}</span>
        <span>{formatDate(match?.startTime, { time: true, withYear: false })}</span>
      </div>

      <div className="teams-line">
        <div>
          <b>{teamName(match?.team1)}</b>
          <small>{match?.team1?.name}</small>
        </div>
        <span>vs</span>
        <div>
          <b>{teamName(match?.team2)}</b>
          <small>{match?.team2?.name}</small>
        </div>
      </div>

      <p className="match-meta">{match?.seriesId?.name || match?.seriesId?.shortName || 'Series TBA'}</p>
      {match?.result && <p className="result-text">{match.result}</p>}

      {id && (
        <div className="card-actions">
          <Link to={`/matches/${id}`}>Match center</Link>
          <Link to={`/matches/${id}/commentary`}>Commentary</Link>
        </div>
      )}
    </article>
  );
}
