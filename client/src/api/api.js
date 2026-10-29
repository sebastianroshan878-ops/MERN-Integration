import axios from 'axios';

// Create an Axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT authorization token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized, clean storage if 401
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('crm_token')) {
        localStorage.removeItem('crm_token');
        localStorage.removeItem('crm_user');
        // Optional redirect to login if not already there
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
