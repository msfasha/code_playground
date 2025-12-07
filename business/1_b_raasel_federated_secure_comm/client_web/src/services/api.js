/**
 * Raasel Chat Platform - API Service
 * 
 * Centralized API service for making HTTP requests to the Raasel server.
 * Handles authentication, request/response formatting, and error handling.
 * 
 * Features:
 * - Automatic token management
 * - Request/response interceptors
 * - Error handling and retry logic
 * - SSL certificate handling for development
 * 
 * Dependencies: axios
 */

import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // For development with self-signed certificates
  httpsAgent: process.env.NODE_ENV === 'development' ? 
    new (require('https').Agent)({ rejectUnauthorized: false }) : undefined
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses
api.interceptors.response.use(
  (response) => {
    // Return the data directly for easier handling
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.reload();
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error occurred');
          break;
        default:
          console.error(`HTTP ${status}: ${data?.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - no response received');
    } else {
      // Other error
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common operations
const apiService = {
  // Authentication
  register: (userData) => api.post('/clients/register', userData),
  login: (credentials) => api.post('/clients/login', credentials),
  
  // User profile
  getProfile: () => api.get('/clients/me'),
  
  // Generic methods
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
  
  // Utility methods
  setToken: (token) => {
    localStorage.setItem('token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default apiService; 