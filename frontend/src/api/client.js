/**
 * api/client.js
 * ------------------------------------------------------------
 * A single configured axios instance used by every page/component.
 * - baseURL comes from VITE_API_URL (defaults to "/api", proxied
 *   to the backend by vite.config.js during dev).
 * - The request interceptor attaches the JWT (if present) to every
 *   outgoing call, so individual API functions don't need to.
 * ------------------------------------------------------------
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shegerflix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
