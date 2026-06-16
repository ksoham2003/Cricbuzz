import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { apiService } from '../services/api';
import MatchCard from '../components/MatchCard';
import { EmptyState, ErrorState, LoadingState } from '../components/PageStates';
import { apiErrorMessage, unwrapList } from '../utils/format';

export default function HomePage() {
  const [state, setState] = useState({
    loading: true,
    error: '',
    data: null,
    series: [],
    teams: [],
    players: [],
  });

  const loadHome = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const [home, series, teams, players] = await Promise.all([
        apiService.getHome(),
        apiService.getSeries({ limit: 6 }),
        apiService.getTeams({ limit: 6 }),
        apiService.getPlayers({ limit: 6 }),
      ]);

      setState({
        loading: false,
        error: '',
        data: home.data.data,
        series: unwrapList(series),
        teams: unwrapList(teams),
        players: unwrapList(players),
      });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: apiErrorMessage(error) }));
    }
  };

  useEffect(() => {
    loadHome();
  }, []);

  const counts = useMemo(() => {
    const data = state.data || {};
    return {
      live: data.liveMatches?.length || 0,
      upcoming: data.upcomingMatches?.length || 0,
      recent: data.recentMatches?.length || 0,
      series: state.series.length,
      teams: state.teams.length,
      players: state.players.length,
    };
  }, [state]);

  const featuredMatch = state.data?.liveMatches?.[0] || state.data?.upcomingMatches?.[0] || state.data?.recentMatches?.[0];

  return (
    <>
      <section className="hero product-hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Live cricket product</span>
            <h1>CricBuzz</h1>
            <p>
              Scores, fixtures, commentary, squads, players, series and standings in one clean
              cricket control center powered by your backend APIs.
            </p>
            <div className="hero-actions">
              <Link className="btn primary" to="/matches">Open match center</Link>
              <Link className="btn ghost" to="/series">Explore series</Link>
            </div>
          </div>

          <aside className="hero-console">
            <div className="console-head">
              <span className="pulse-dot" />
              <b>{featuredMatch ? 'Featured match' : 'API connected'}</b>
            </div>
            {featuredMatch ? (
              <MatchCard match={featuredMatch} compact />
            ) : (
              <div className="empty-console">
                <h2>Ready for match data</h2>
                <p>Backend is connected. Add matches from the API/admin flow and this panel becomes live instantly.</p>
                <div className="meta-row">
                  <span className="chip">Home feed</span>
                  <span className="chip">Matches</span>
                  <span className="chip">Commentary</span>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      <div className="page-shell product-shell">
        {state.loading && <LoadingState />}
        {state.error && <ErrorState message={state.error} onRetry={loadHome} />}

        {!state.loading && !state.error && (
          <>
            <div className="quick-stats">
              <StatTile value={counts.live} label="Live" />
              <StatTile value={counts.upcoming} label="Upcoming" />
              <StatTile value={counts.recent} label="Results" />
              <StatTile value={counts.series} label="Series loaded" />
              <StatTile value={counts.teams} label="Teams loaded" />
              <StatTile value={counts.players} label="Players loaded" />
            </div>

            <section className="product-band">
              <div className="section-heading">
                <div>
                  <h2>Match center</h2>
                  <p>Live, upcoming and recent matches from `/api/home`.</p>
                </div>
                <Link className="btn ghost" to="/matches">View all</Link>
              </div>
              <MatchRail title="Live now" matches={state.data?.liveMatches} empty="No live match at the moment." />
              <MatchRail title="Next fixtures" matches={state.data?.upcomingMatches} empty="No upcoming fixtures published." />
              <MatchRail title="Recent results" matches={state.data?.recentMatches} empty="No results yet." />
            </section>

            <div className="home-discovery">
              <DiscoveryPanel title="Series" to="/series" items={state.series} getTitle={(item) => item.name} />
              <DiscoveryPanel title="Teams" to="/teams" items={state.teams} getTitle={(item) => item.shortName || item.name} />
              <DiscoveryPanel title="Players" to="/players" items={state.players} getTitle={(item) => item.fullName || `${item.firstName || ''} ${item.lastName || ''}`} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

function StatTile({ value, label }) {
  return (
    <div className="stat-tile">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

function MatchRail({ title, matches = [], empty }) {
  return (
    <div className="match-rail">
      <div className="rail-title">
        <h3>{title}</h3>
        <span>{matches.length}</span>
      </div>
      {matches.length ? (
        <div className="content-grid">
          {matches.slice(0, 3).map((match) => <MatchCard key={match._id} match={match} />)}
        </div>
      ) : (
        <EmptyState title={title} message={empty} />
      )}
    </div>
  );
}

function DiscoveryPanel({ title, to, items, getTitle }) {
  return (
    <section className="panel discovery-panel">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          <p>{items.length} records available</p>
        </div>
        <Link className="btn ghost" to={to}>Open</Link>
      </div>
      {items.length ? (
        <div className="discovery-list">
          {items.slice(0, 5).map((item) => (
            <span key={item._id || getTitle(item)}>{getTitle(item)}</span>
          ))}
        </div>
      ) : (
        <EmptyState title={`No ${title.toLowerCase()} yet`} message="Add records in the backend and this section will populate." />
      )}
    </section>
  );
}
