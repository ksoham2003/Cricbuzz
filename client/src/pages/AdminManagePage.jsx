import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { apiErrorMessage, formatDate, getId, playerName, teamName, unwrapList } from '../utils/format';

const tabs = ['series', 'teams', 'players', 'squads', 'matches', 'users'];

const initialForms = {
  series: { name: '', shortName: '', description: '', format: 'TEST', startDate: '', endDate: '' },
  teams: { name: '', shortName: '', city: '', coach: '', seriesId: '', primaryColor: '#007a5a', secondaryColor: '#10211d' },
  players: { firstName: '', lastName: '', age: 24, role: 'BATSMAN', teamId: '', nationality: 'India', battingStyle: 'RIGHT_HAND_BAT', bowlingStyle: '' },
  squads: { seriesId: '', teamId: '' },
  matches: { seriesId: '', team1: '', team2: '', matchNumber: '', venue: '', startTime: '' },
  users: { name: '', email: '', password: 'password123', role: 'SCORER' },
};

export default function AdminManagePage() {
  const [active, setActive] = useState('series');
  const [forms, setForms] = useState(initialForms);
  const [state, setState] = useState({
    loading: true,
    saving: false,
    error: '',
    success: '',
    series: [],
    teams: [],
    players: [],
    squads: [],
    matches: [],
    users: [],
  });

  const loadAll = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    const requests = await Promise.allSettled([
      apiService.getSeries({ limit: 100 }),
      apiService.getTeams({ limit: 100 }),
      apiService.getPlayers({ limit: 200 }),
      apiService.getSquads({ limit: 100 }),
      apiService.getMatches({ limit: 100 }),
      apiService.getUsers(),
    ]);

    setState((current) => ({
      ...current,
      loading: false,
      series: requests[0].status === 'fulfilled' ? unwrapList(requests[0].value) : [],
      teams: requests[1].status === 'fulfilled' ? unwrapList(requests[1].value) : [],
      players: requests[2].status === 'fulfilled' ? unwrapList(requests[2].value) : [],
      squads: requests[3].status === 'fulfilled' ? unwrapList(requests[3].value) : [],
      matches: requests[4].status === 'fulfilled' ? unwrapList(requests[4].value) : [],
      users: requests[5].status === 'fulfilled' ? unwrapList(requests[5].value) : [],
      error: requests.find((item) => item.status === 'rejected') ? 'Some protected resources require SUPER_ADMIN or ADMIN role.' : '',
    }));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const setField = (scope, field, value) => {
    setForms((current) => ({ ...current, [scope]: { ...current[scope], [field]: value } }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setState((current) => ({ ...current, saving: true, error: '', success: '' }));

    try {
      if (active === 'series') {
        await apiService.createSeries(forms.series);
      }
      if (active === 'teams') {
        await apiService.createTeam(clean(forms.teams));
      }
      if (active === 'players') {
        await apiService.createPlayer({
          ...clean(forms.players),
          age: Number(forms.players.age),
          bowlingStyle: forms.players.bowlingStyle || null,
        });
      }
      if (active === 'squads') {
        await apiService.createSquad(forms.squads);
      }
      if (active === 'matches') {
        await apiService.createMatch({ ...forms.matches, startTime: new Date(forms.matches.startTime).toISOString() });
      }
      if (active === 'users') {
        await apiService.createUser(forms.users);
      }

      setForms((current) => ({ ...current, [active]: initialForms[active] }));
      setState((current) => ({ ...current, saving: false, success: `${label(active)} created successfully.` }));
      await loadAll();
    } catch (error) {
      setState((current) => ({ ...current, saving: false, error: apiErrorMessage(error, 'Save failed') }));
    }
  };

  return (
    <div className="page-shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow dark">Admin control room</span>
          <h1>Manage cricket data</h1>
          <p>Create and review backend records without leaving the product UI.</p>
        </div>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button key={tab} className={active === tab ? 'active' : ''} type="button" onClick={() => setActive(tab)}>
            {label(tab)}
          </button>
        ))}
      </div>

      {state.error && <div className="error-message">{state.error}</div>}
      {state.success && <div className="success-message">{state.success}</div>}

      <div className="two-column">
        <section className="panel">
          <h2>Create {label(active)}</h2>
          <form className="form-stack mt-4" onSubmit={submit}>
            {active === 'series' && <SeriesForm form={forms.series} setField={setField} />}
            {active === 'teams' && <TeamForm form={forms.teams} setField={setField} series={state.series} />}
            {active === 'players' && <PlayerForm form={forms.players} setField={setField} teams={state.teams} />}
            {active === 'squads' && <SquadForm form={forms.squads} setField={setField} series={state.series} teams={state.teams} />}
            {active === 'matches' && <MatchForm form={forms.matches} setField={setField} series={state.series} teams={state.teams} />}
            {active === 'users' && <UserForm form={forms.users} setField={setField} />}
            <button className="btn primary full" disabled={state.saving}>{state.saving ? 'Saving...' : `Create ${label(active)}`}</button>
          </form>
        </section>

        <section className="panel">
          <h2>{label(active)} records</h2>
          {state.loading ? <p>Loading...</p> : <RecordList active={active} state={state} />}
        </section>
      </div>
    </div>
  );
}

function SeriesForm({ form, setField }) {
  return (
    <>
      <Text label="Name" value={form.name} onChange={(v) => setField('series', 'name', v)} />
      <Text label="Short name" value={form.shortName} onChange={(v) => setField('series', 'shortName', v)} />
      <Text label="Description" value={form.description} onChange={(v) => setField('series', 'description', v)} />
      <Select label="Format" value={form.format} onChange={(v) => setField('series', 'format', v)} options={['TEST', 'ODI', 'T20', 'T10']} />
      <Text label="Start date" type="date" value={form.startDate} onChange={(v) => setField('series', 'startDate', v)} />
      <Text label="End date" type="date" value={form.endDate} onChange={(v) => setField('series', 'endDate', v)} />
    </>
  );
}

function TeamForm({ form, setField, series }) {
  return (
    <>
      <Select label="Series" value={form.seriesId} onChange={(v) => setField('teams', 'seriesId', v)} options={series.map((item) => [getId(item), item.name])} />
      <Text label="Name" value={form.name} onChange={(v) => setField('teams', 'name', v)} />
      <Text label="Short name" value={form.shortName} onChange={(v) => setField('teams', 'shortName', v)} />
      <Text label="City" value={form.city} onChange={(v) => setField('teams', 'city', v)} />
      <Text label="Coach" value={form.coach} onChange={(v) => setField('teams', 'coach', v)} />
      <Text label="Primary color" type="color" value={form.primaryColor} onChange={(v) => setField('teams', 'primaryColor', v)} />
      <Text label="Secondary color" type="color" value={form.secondaryColor} onChange={(v) => setField('teams', 'secondaryColor', v)} />
    </>
  );
}

function PlayerForm({ form, setField, teams }) {
  return (
    <>
      <Select label="Team" value={form.teamId} onChange={(v) => setField('players', 'teamId', v)} options={teams.map((item) => [getId(item), item.name])} />
      <Text label="First name" value={form.firstName} onChange={(v) => setField('players', 'firstName', v)} />
      <Text label="Last name" value={form.lastName} onChange={(v) => setField('players', 'lastName', v)} />
      <Text label="Age" type="number" value={form.age} onChange={(v) => setField('players', 'age', v)} />
      <Select label="Role" value={form.role} onChange={(v) => setField('players', 'role', v)} options={['BATSMAN', 'BOWLER', 'ALL_ROUNDER', 'WICKET_KEEPER']} />
      <Select label="Batting style" value={form.battingStyle} onChange={(v) => setField('players', 'battingStyle', v)} options={['RIGHT_HAND_BAT', 'LEFT_HAND_BAT']} />
      <Select label="Bowling style" value={form.bowlingStyle} onChange={(v) => setField('players', 'bowlingStyle', v)} options={['', 'RIGHT_ARM_FAST', 'LEFT_ARM_FAST', 'RIGHT_ARM_SPIN', 'LEFT_ARM_SPIN']} />
      <Text label="Nationality" value={form.nationality} onChange={(v) => setField('players', 'nationality', v)} />
    </>
  );
}

function SquadForm({ form, setField, series, teams }) {
  return (
    <>
      <Select label="Series" value={form.seriesId} onChange={(v) => setField('squads', 'seriesId', v)} options={series.map((item) => [getId(item), item.name])} />
      <Select label="Team" value={form.teamId} onChange={(v) => setField('squads', 'teamId', v)} options={teams.map((item) => [getId(item), item.name])} />
    </>
  );
}

function MatchForm({ form, setField, series, teams }) {
  return (
    <>
      <Select label="Series" value={form.seriesId} onChange={(v) => setField('matches', 'seriesId', v)} options={series.map((item) => [getId(item), item.name])} />
      <Select label="Team 1" value={form.team1} onChange={(v) => setField('matches', 'team1', v)} options={teams.map((item) => [getId(item), item.name])} />
      <Select label="Team 2" value={form.team2} onChange={(v) => setField('matches', 'team2', v)} options={teams.map((item) => [getId(item), item.name])} />
      <Text label="Match number" value={form.matchNumber} onChange={(v) => setField('matches', 'matchNumber', v)} />
      <Text label="Venue" value={form.venue} onChange={(v) => setField('matches', 'venue', v)} />
      <Text label="Start time" type="datetime-local" value={form.startTime} onChange={(v) => setField('matches', 'startTime', v)} />
    </>
  );
}

function UserForm({ form, setField }) {
  return (
    <>
      <Text label="Name" value={form.name} onChange={(v) => setField('users', 'name', v)} />
      <Text label="Email" type="email" value={form.email} onChange={(v) => setField('users', 'email', v)} />
      <Text label="Password" type="password" value={form.password} onChange={(v) => setField('users', 'password', v)} />
      <Select label="Role" value={form.role} onChange={(v) => setField('users', 'role', v)} options={['SUPER_ADMIN', 'ADMIN', 'SCORER']} />
    </>
  );
}

function Text({ label, value, onChange, type = 'text' }) {
  return (
    <label>
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={type !== 'color'} />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  const normalized = options.map((option) => (Array.isArray(option) ? option : [option, option || 'None']));
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} required>
        <option value="">Select {label.toLowerCase()}</option>
        {normalized.map(([id, name]) => <option key={id || name} value={id}>{name}</option>)}
      </select>
    </label>
  );
}

function RecordList({ active, state }) {
  const records = state[active] || [];
  if (!records.length) return <p className="text-sm font-semibold text-slate-500">No records yet.</p>;

  return (
    <div className="discovery-list">
      {records.slice(0, 12).map((item) => (
        <span key={getId(item) || item.email}>
          {active === 'players' && playerName(item)}
          {active === 'teams' && teamName(item)}
          {active === 'series' && item.name}
          {active === 'squads' && `${item.teamId?.name || item.teamId || 'Squad'} · ${item.status || 'ACTIVE'}`}
          {active === 'matches' && `${teamName(item.team1)} vs ${teamName(item.team2)} · ${item.status}`}
          {active === 'users' && `${item.name} · ${item.role}`}
          {active === 'series' && item.startDate ? ` · ${formatDate(item.startDate)}` : ''}
        </span>
      ))}
    </div>
  );
}

function label(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function clean(object) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== '' && value !== null && value !== undefined));
}
