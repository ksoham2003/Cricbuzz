import { apiClient } from './client.js';
import { API_ENDPOINTS } from '../config/api.js';

export const authApi = {
  register: (data) => apiClient.post(API_ENDPOINTS.AUTH_REGISTER, data),
  login: (email, password) => apiClient.post(API_ENDPOINTS.AUTH_LOGIN, { email, password }),
  logout: () => apiClient.post(API_ENDPOINTS.AUTH_LOGOUT),
  refresh: () => apiClient.post(API_ENDPOINTS.AUTH_REFRESH),
  me: () => apiClient.get(API_ENDPOINTS.AUTH_GET_ME),
};
