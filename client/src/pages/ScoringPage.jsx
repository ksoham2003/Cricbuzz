import { useState } from 'react';
import { apiService } from '../services/api';

const emptyScore = {
  innings: 1,
  battingTeam: '',
  score: 0,
  wickets: 0,
  overs: '0.0',
  runRate: 0,
  target: '',
};

const teamName = (team) => team?.name || team?.shortName || team || 'TBA';

export const ScoringPage = () => {
  const [matchId, setMatchId] = useState('');
  const [match, setMatch] = useState(null);
  const [scores, setScores] = useState([]);
  const [commentary, setCommentary] = useState([]);
  const [scoreForm, setScoreForm] = useState(emptyScore);
  const [commentaryForm, setCommentaryForm] = useState({
    over: 0,
    ball: 1,
    type: 'NORMAL',
    text: '',
  });
  const [completeForm, setCompleteForm] = useState({ winner: '', result: '' });
  const [tossForm, setTossForm] = useState({ tossWinner: '', tossDecision: 'BAT' });
  const [activeScoreId, setActiveScoreId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMatch = async () => {
    if (!matchId) return;
    setLoading(true);
    setError('');
    try {
      const [matchRes, scoresRes, commentaryRes] = await Promise.all([
        apiService.getMatchById(matchId),
        apiService.getScores({ matchId }),
        apiService.getCommentary({ matchId }),
      ]);
      setMatch(matchRes.data.data.match);
      setScores(scoresRes.data.data.scores || []);
      setCommentary(commentaryRes.data.data.commentary || commentaryRes.data.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load match');
    } finally {
      setLoading(false);
    }
  };

  const runAction = async (action) => {
    setLoading(true);
    setError('');
    try {
      await action();
      await loadMatch();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
      setLoading(false);
    }
  };

  const submitScore = async (event) => {
    event.preventDefault();
    const payload = {
      ...scoreForm,
      matchId,
      innings: Number(scoreForm.innings),
      score: Number(scoreForm.score),
      wickets: Number(scoreForm.wickets),
      runRate: Number(scoreForm.runRate),
      target: scoreForm.target === '' ? null : Number(scoreForm.target),
    };

    await runAction(async () => {
      if (activeScoreId) {
        await apiService.updateScore(activeScoreId, payload);
      } else {
        await apiService.createScore(payload);
      }
      setScoreForm(emptyScore);
      setActiveScoreId('');
    });
  };

  const submitCommentary = async (event) => {
    event.preventDefault();
    await runAction(async () => {
      await apiService.createCommentary({
        ...commentaryForm,
        matchId,
        over: Number(commentaryForm.over),
        ball: Number(commentaryForm.ball),
      });
      setCommentaryForm({ over: 0, ball: 1, type: 'NORMAL', text: '' });
    });
  };

  const editScore = (score) => {
    setActiveScoreId(score._id);
    setScoreForm({
      innings: score.innings,
      battingTeam: score.battingTeam?._id || score.battingTeam || '',
      score: score.score,
      wickets: score.wickets,
      overs: score.overs,
      runRate: score.runRate,
      target: score.target ?? '',
    });
  };

  return (
    <div className="scoring-page">
      <div className="page-header">
        <h1>Live Scoring</h1>
        <button className="btn btn-secondary" onClick={loadMatch} disabled={loading || !matchId}>
          Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card form-card">
        <h2>Load Match</h2>
        <div className="form-group">
          <label>Match ID</label>
          <input value={matchId} onChange={(event) => setMatchId(event.target.value)} placeholder="Paste match ObjectId" />
        </div>
        <button className="btn btn-primary" onClick={loadMatch} disabled={loading || !matchId}>
          {loading ? 'Loading...' : 'Load Match'}
        </button>
      </div>

      {match && (
        <>
          <div className="card">
            <h2>{teamName(match.team1)} vs {teamName(match.team2)}</h2>
            <p><strong>Status:</strong> <span className="badge badge-primary">{match.status}</span></p>
            <p><strong>Venue:</strong> {match.venue}</p>
            <p><strong>Start:</strong> {new Date(match.startTime).toLocaleString()}</p>
          </div>

          <div className="grid grid-2">
            <div className="card form-card">
              <h2>Toss</h2>
              <div className="form-group">
                <label>Toss Winner Team ID</label>
                <input value={tossForm.tossWinner} onChange={(e) => setTossForm({ ...tossForm, tossWinner: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Decision</label>
                <select value={tossForm.tossDecision} onChange={(e) => setTossForm({ ...tossForm, tossDecision: e.target.value })}>
                  <option>BAT</option>
                  <option>BOWL</option>
                </select>
              </div>
              <button className="btn btn-success" onClick={() => runAction(() => apiService.conductToss(matchId, tossForm))} disabled={loading}>
                Save Toss
              </button>
            </div>

            <div className="card form-card">
              <h2>Match Controls</h2>
              <div className="card-actions">
                <button className="btn btn-success" onClick={() => runAction(() => apiService.startMatch(matchId))} disabled={loading}>Start</button>
                <button className="btn btn-secondary" onClick={() => runAction(() => apiService.inningsBreak(matchId))} disabled={loading}>Innings Break</button>
              </div>
              <div className="form-group">
                <label>Winner Team ID</label>
                <input value={completeForm.winner} onChange={(e) => setCompleteForm({ ...completeForm, winner: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Result</label>
                <input value={completeForm.result} onChange={(e) => setCompleteForm({ ...completeForm, result: e.target.value })} placeholder="Won by 6 wickets" />
              </div>
              <button className="btn btn-danger" onClick={() => runAction(() => apiService.completeMatch(matchId, completeForm))} disabled={loading}>
                Complete Match
              </button>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="card form-card">
              <h2>{activeScoreId ? 'Update Innings Score' : 'Create Innings Score'}</h2>
              <form onSubmit={submitScore}>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label>Innings</label>
                    <input type="number" min="1" value={scoreForm.innings} onChange={(e) => setScoreForm({ ...scoreForm, innings: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Batting Team ID</label>
                    <input value={scoreForm.battingTeam} onChange={(e) => setScoreForm({ ...scoreForm, battingTeam: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Runs</label>
                    <input type="number" min="0" value={scoreForm.score} onChange={(e) => setScoreForm({ ...scoreForm, score: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Wickets</label>
                    <input type="number" min="0" max="10" value={scoreForm.wickets} onChange={(e) => setScoreForm({ ...scoreForm, wickets: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Overs</label>
                    <input value={scoreForm.overs} onChange={(e) => setScoreForm({ ...scoreForm, overs: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Run Rate</label>
                    <input type="number" min="0" step="0.01" value={scoreForm.runRate} onChange={(e) => setScoreForm({ ...scoreForm, runRate: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Target</label>
                    <input type="number" min="0" value={scoreForm.target} onChange={(e) => setScoreForm({ ...scoreForm, target: e.target.value })} />
                  </div>
                </div>
                <button className="btn btn-success" disabled={loading}>{activeScoreId ? 'Update Score' : 'Create Score'}</button>
              </form>
            </div>

            <div className="card">
              <h2>Scores</h2>
              {scores.length > 0 ? scores.map((score) => (
                <div key={score._id} className="card-actions">
                  <span>Inn {score.innings}: {teamName(score.battingTeam)} {score.score}/{score.wickets} ({score.overs})</span>
                  <button className="btn btn-sm btn-secondary" onClick={() => editScore(score)}>Edit</button>
                </div>
              )) : <p>No scores yet.</p>}
            </div>
          </div>

          <div className="grid grid-2">
            <div className="card form-card">
              <h2>Add Commentary</h2>
              <form onSubmit={submitCommentary}>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label>Over</label>
                    <input type="number" min="0" value={commentaryForm.over} onChange={(e) => setCommentaryForm({ ...commentaryForm, over: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Ball</label>
                    <input type="number" min="1" max="6" value={commentaryForm.ball} onChange={(e) => setCommentaryForm({ ...commentaryForm, ball: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select value={commentaryForm.type} onChange={(e) => setCommentaryForm({ ...commentaryForm, type: e.target.value })}>
                      <option>NORMAL</option>
                      <option>FOUR</option>
                      <option>SIX</option>
                      <option>WICKET</option>
                      <option>MILESTONE</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Text</label>
                  <textarea value={commentaryForm.text} onChange={(e) => setCommentaryForm({ ...commentaryForm, text: e.target.value })} required />
                </div>
                <button className="btn btn-success" disabled={loading}>Add Commentary</button>
              </form>
            </div>

            <div className="card">
              <h2>Commentary</h2>
              {commentary.length > 0 ? commentary.map((item) => (
                <p key={item._id}><strong>{item.over}.{item.ball}</strong> {item.text}</p>
              )) : <p>No commentary yet.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScoringPage;
