// src/services/api/apiClient.ts

// Add auth token from localStorage to every request
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('adminToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor to handle global errors
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: { response: { status: number; }; }) => {
    // Example: handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Redirect to login or clear token.');
      // localStorage.removeItem('adminToken');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
