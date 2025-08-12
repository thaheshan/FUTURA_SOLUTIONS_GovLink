import axios, { InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  // baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('authToken');

    // Make sure headers exist
    if (config.headers && token) {
      // Authorization header can be string or undefined, so assign string here
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
