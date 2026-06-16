import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api.js';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest?.url?.startsWith('/auth/');

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH_REFRESH}`, {}, { withCredentials: true });
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const envelope = (response) => response?.data;

export const payload = (response) => response?.data?.data;

export const listPayload = (response) => {
  const data = payload(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

export const paginationPayload = (response) => payload(response)?.pagination || null;

export const apiErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || error?.message || fallback;

export default apiClient;
