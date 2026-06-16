const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ORIGIN = rawBaseUrl.replace(/\/$/, '');
export const API_BASE_URL = `${API_ORIGIN}/api`;

export const API_ENDPOINTS = {
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_GET_ME: '/auth/me',

  HOME: '/home',
  MATCHES: '/matches',
  MATCH: (id) => `/matches/${id}`,
  MATCH_CENTER: (id) => `/matches/${id}/center`,
  MATCH_SCORECARD: (id) => `/matches/${id}/scorecard`,
  MATCH_COMMENTARY: (id) => `/matches/${id}/commentary`,
  SERIES: '/series',
  SERIES_DETAIL: (id) => `/series/${id}`,
  POINTS_TABLE: (id) => `/series/${id}/points-table`,
  TEAMS: '/teams',
  TEAM: (id) => `/teams/${id}`,
  PLAYERS: '/players',
  PLAYER: (id) => `/players/${id}`,
  SQUADS: '/squads',
  SQUAD: (id) => `/squads/${id}`,
  SQUAD_BY_TEAM: (teamId) => `/squads/team/${teamId}`,
  SEARCH: '/search',
};

export default API_BASE_URL;
