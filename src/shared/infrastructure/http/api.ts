import axios from 'axios';

// TODO: Move base URL to environment variables
const API_BASE_URL = 'http://192.168.0.111:4005';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

let onSessionExpired: (() => void) | null = null;

export const registerSessionExpiredCallback = (callback: () => void) => {
  onSessionExpired = callback;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors (e.g., 401 Unauthorized)
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes('/auth/signin')
    ) {
      if (onSessionExpired) {
        onSessionExpired();
      } else {
        localStorage.removeItem('user'); // Clear user session data
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
