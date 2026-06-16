import { apiClient } from './client.js';
import { API_ENDPOINTS } from '../config/api.js';

export const publicApi = {
  home: () => apiClient.get(API_ENDPOINTS.HOME),
  matches: (params = {}) => apiClient.get(API_ENDPOINTS.MATCHES, { params }),
  match: (id) => apiClient.get(API_ENDPOINTS.MATCH(id)),
  matchCenter: (id) => apiClient.get(API_ENDPOINTS.MATCH_CENTER(id)),
  scorecard: (id) => apiClient.get(API_ENDPOINTS.MATCH_SCORECARD(id)),
  commentary: (id, params = {}) => apiClient.get(API_ENDPOINTS.MATCH_COMMENTARY(id), { params }),
  series: (params = {}) => apiClient.get(API_ENDPOINTS.SERIES, { params }),
  seriesDetail: (id) => apiClient.get(API_ENDPOINTS.SERIES_DETAIL(id)),
  pointsTable: (id) => apiClient.get(API_ENDPOINTS.POINTS_TABLE(id)),
  teams: (params = {}) => apiClient.get(API_ENDPOINTS.TEAMS, { params }),
  team: (id) => apiClient.get(API_ENDPOINTS.TEAM(id)),
  players: (params = {}) => apiClient.get(API_ENDPOINTS.PLAYERS, { params }),
  player: (id) => apiClient.get(API_ENDPOINTS.PLAYER(id)),
  squads: (params = {}) => apiClient.get(API_ENDPOINTS.SQUADS, { params }),
  squad: (id) => apiClient.get(API_ENDPOINTS.SQUAD(id)),
  squadByTeam: (teamId) => apiClient.get(API_ENDPOINTS.SQUAD_BY_TEAM(teamId)),
  search: (params = {}) => apiClient.get(API_ENDPOINTS.SEARCH, { params }),
};
