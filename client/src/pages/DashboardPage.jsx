import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { apiService } from '../services/api';
import { apiErrorMessage, unwrapList } from '../utils/format';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [state, setState] = useState({ loading: true, error: '', stats: null });

  useEffect(() => {
    let alive = true;

    Promise.allSettled([
      apiService.getMatches({ limit: 1 }),
      apiService.getSeries({ limit: 1 }),
      apiService.getTeams({ limit: 1 }),
      apiService.getPlayers({ limit: 1 }),
      apiService.getSquads({ limit: 1 }),
    ]).then((results) => {
      if (!alive) return;
      const [matches, series, teams, players, squads] = results;
      const count = (result) => (result.status === 'fulfilled' ? unwrapList(result.value).length : 0);
      const failed = results.find((result) => result.status === 'rejected');

      setState({
        loading: false,
        error: failed ? apiErrorMessage(failed.reason) : '',
        stats: {
          matches: count(matches),
          series: count(series),
          teams: count(teams),
          players: count(players),
          squads: count(squads),
        },
      });
    });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <section className="ops-hero">
        <div>
          <span className="eyebrow">Protected workspace</span>
          <h1>{user?.name || 'Cricket operator'}</h1>
          <p>{user?.email} · {user?.role || 'User'}</p>
        </div>
        <div className="meta-row">
          <span className="chip">httpOnly cookie session</span>
          <span className="chip">Backend connected</span>
        </div>
      </section>

      <div className="quick-stats">
        <Stat label="Matches" value={state.stats?.matches ?? '-'} />
        <Stat label="Series" value={state.stats?.series ?? '-'} />
        <Stat label="Teams" value={state.stats?.teams ?? '-'} />
        <Stat label="Players" value={state.stats?.players ?? '-'} />
        <Stat label="Squads" value={state.stats?.squads ?? '-'} />
        <Stat label="Role" value={user?.role || '-'} />
      </div>

      {state.error && <p className="panel text-sm font-semibold text-amber-700">{state.error}</p>}

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Operations</h2>
            <p>Quick links mapped to the existing backend modules.</p>
          </div>
        </div>
        <div className="content-grid">
          <Action to="/matches" title="Match center" text="Track match details, scorecards and commentary." />
          <Action to="/series" title="Series hub" text="Open tournaments and points tables." />
          <Action to="/teams" title="Teams" text="Browse franchise or national team records." />
          <Action to="/players" title="Players" text="Search player roles, styles and countries." />
          <Action to="/squads" title="Squads" text="Review published squad composition." />
          <Action to="/search" title="Global search" text="Search players, teams and series together." />
          <Action to="/admin/scoring" title="Live scoring" text="Update score, toss, match status and commentary." />
          <Action to="/admin/manage" title="Admin manager" text="Create series, teams, players, squads, matches and users." />
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="stat-tile">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

function Action({ to, title, text }) {
  return (
    <Link className="entity-card no-underline" to={to}>
      <span className="chip">Open</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </Link>
  );
}
