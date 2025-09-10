import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Error:', error.message);

    // In development mode, we'll let individual services handle fallbacks
    // Comment out redirect for development to prevent unwanted redirects
    // if (error.response?.status === 401) {
    //   // Handle unauthorized access
    //   localStorage.removeItem('authToken');
    //   window.location.href = '/signin';
    // }

    return Promise.reject(error);
  }
);

export default api;
