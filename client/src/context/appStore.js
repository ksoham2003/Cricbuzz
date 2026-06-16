/**
 * App Data Store - Zustand
 * Global application state for series, teams, matches, etc.
 */

import { create } from 'zustand';
import { apiService } from '../services/api';

const payload = (response) => response?.data?.data;
const listFrom = (response) => {
  const data = payload(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.scores)) return data.scores;
  if (Array.isArray(data?.commentary)) return data.commentary;
  if (Array.isArray(data?.squads)) return data.squads;
  return [];
};
const objectFrom = (response, key) => {
  const data = payload(response);
  if (data?.[key]) return data[key];
  if (data?._id) return data;
  return data;
};

export const useAppStore = create((set) => ({
  // State
  series: [],
  teams: [],
  players: [],
  squads: [],
  users: [],
  matches: [],
  scores: [],
  commentary: [],
  currentMatch: null,
  isLoading: false,
  error: null,

  // Series actions
  fetchSeries: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getSeries(query);
      set({
        series: listFrom(response),
        isLoading: false,
      });
      return listFrom(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch series';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createSeries: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.createSeries(data);
      const created = objectFrom(response, 'series');
      set((state) => ({
        series: created?._id ? [...state.series, created] : state.series,
        isLoading: false,
      }));
      return created;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create series';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Teams actions
  fetchTeams: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getTeams(query);
      set({
        teams: listFrom(response),
        isLoading: false,
      });
      return listFrom(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch teams';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createTeam: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.createTeam(data);
      const created = objectFrom(response, 'team');
      set((state) => ({
        teams: created?._id ? [...state.teams, created] : state.teams,
        isLoading: false,
      }));
      return created;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create team';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Players actions
  fetchPlayers: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getPlayers(query);
      const players = listFrom(response);
      set({ players, isLoading: false });
      return players;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch players';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createPlayer: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.createPlayer(data);
      const created = objectFrom(response, 'player');
      set((state) => ({
        players: created?._id ? [...state.players, created] : state.players,
        isLoading: false,
      }));
      return created;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create player';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Squads actions
  fetchSquads: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getSquads(query);
      const squads = listFrom(response);
      set({ squads, isLoading: false });
      return squads;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch squads';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createSquad: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.createSquad(data);
      const created = objectFrom(response, 'squad');
      set((state) => ({
        squads: created?._id ? [...state.squads, created] : state.squads,
        isLoading: false,
      }));
      return created;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create squad';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Users actions
  fetchUsers: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getUsers(query);
      const users = listFrom(response);
      set({ users, isLoading: false });
      return users;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.createUser(data);
      const created = objectFrom(response, 'user');
      set((state) => ({
        users: created?._id ? [...state.users, created] : state.users,
        isLoading: false,
      }));
      return created;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Matches actions
  fetchMatches: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getMatches(query);
      set({
        matches: listFrom(response),
        isLoading: false,
      });
      return listFrom(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch matches';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getMatchById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getMatchById(id);
      const match = objectFrom(response, 'match');
      set({
        currentMatch: match,
        isLoading: false,
      });
      return match;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch match';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createMatch: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.createMatch(data);
      const created = objectFrom(response, 'match');
      set((state) => ({
        matches: created?._id ? [...state.matches, created] : state.matches,
        isLoading: false,
      }));
      return created;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create match';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Scores actions
  fetchScores: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getScores(query);
      set({
        scores: listFrom(response),
        isLoading: false,
      });
      return listFrom(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch scores';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Commentary actions
  fetchCommentary: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getCommentary(query);
      set({
        commentary: listFrom(response),
        isLoading: false,
      });
      return listFrom(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch commentary';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Generic actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () =>
    set({
      series: [],
      teams: [],
      players: [],
      squads: [],
      users: [],
      matches: [],
      scores: [],
      commentary: [],
      currentMatch: null,
      isLoading: false,
      error: null,
    }),
}));
