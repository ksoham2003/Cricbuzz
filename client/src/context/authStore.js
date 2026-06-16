import { create } from 'zustand';
import { apiService } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.register({ name, email, password });
      const { user } = response.data.data;
      set({ user, isAuthenticated: true, isLoading: false });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.login(email, password);
      const { user } = response.data.data;
      set({ user, isAuthenticated: true, isLoading: false });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getMe();
      const { user } = response.data.data;

      set({ user, isAuthenticated: true, isLoading: false });

      return user;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  },

  hasRole: (role) => {
    const state = useAuthStore.getState();
    return state.user?.role === role;
  },

  hasAnyRole: (roles) => {
    const state = useAuthStore.getState();
    return roles.includes(state.user?.role);
  },

  isAdmin: () => {
    const state = useAuthStore.getState();
    return ['SUPER_ADMIN', 'ADMIN'].includes(state.user?.role);
  },

  isScorer: () => {
    const state = useAuthStore.getState();
    return state.user?.role === 'SCORER';
  },

  isSuperAdmin: () => {
    const state = useAuthStore.getState();
    return state.user?.role === 'SUPER_ADMIN';
  },
}));
