import { apiClient } from './client.js';

export const adminApi = {
  users: (params = {}) => apiClient.get('/users', { params }),
  createUser: (data) => apiClient.post('/users', data),

  createSeries: (data) => apiClient.post('/series', data),
  updateSeries: (id, data) => apiClient.patch(`/series/${id}`, data),
  deleteSeries: (id) => apiClient.delete(`/series/${id}`),

  createTeam: (data) => apiClient.post('/teams', data),
  updateTeam: (id, data) => apiClient.patch(`/teams/${id}`, data),
  deleteTeam: (id) => apiClient.delete(`/teams/${id}`),

  createSquad: (data) => apiClient.post('/squads', data),
  addPlayerToSquad: (id, playerId) => apiClient.post(`/squads/${id}/players`, { playerId }),
  removePlayerFromSquad: (id, playerId) => apiClient.delete(`/squads/${id}/players/${playerId}`),
  updateSquadStatus: (id, status) => apiClient.patch(`/squads/${id}/status`, { status }),

  createPlayer: (data) => apiClient.post('/players', data),
  updatePlayer: (id, data) => apiClient.patch(`/players/${id}`, data),
  deletePlayer: (id) => apiClient.delete(`/players/${id}`),

  createMatch: (data) => apiClient.post('/matches', data),
  updateMatch: (id, data) => apiClient.patch(`/matches/${id}`, data),
  deleteMatch: (id) => apiClient.delete(`/matches/${id}`),
  conductToss: (id, data) => apiClient.patch(`/matches/${id}/toss`, data),
  selectPlayingXi: (id, data) => apiClient.post(`/playing-xi/${id}`, data),
  startMatch: (id) => apiClient.patch(`/matches/${id}/start`),
  inningsBreak: (id) => apiClient.patch(`/matches/${id}/innings-break`),
  completeMatch: (id, data) => apiClient.patch(`/matches/${id}/complete`, data),

  createScore: (data) => apiClient.post('/scores', data),
  updateScore: (id, data) => apiClient.patch(`/scores/${id}`, data),
  scores: (params = {}) =>
    params.matchId
      ? apiClient.get(`/scores/match/${params.matchId}`)
      : Promise.resolve({ data: { success: true, data: [] } }),

  createCommentary: (data) => apiClient.post('/commentary', data),
  deleteCommentary: (id) => apiClient.delete(`/commentary/${id}`),
  commentary: (params = {}) =>
    params.matchId
      ? apiClient.get(`/commentary/match/${params.matchId}`, { params })
      : Promise.resolve({ data: { success: true, data: [] } }),
};
