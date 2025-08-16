import axios, { AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Config constants (replace with your env/config file if needed)
const API_CONFIG = {
  BASE_URL: "http://localhost:3000", // ✅ update with your backend URL
  TIMEOUT: 10000,
};

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token if available
import type { InternalAxiosRequestConfig } from "axios";

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        if (!config.headers) {
          config.headers = new axios.AxiosHeaders();
        }
        // Ensure headers is always an object
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("⚠️ Error retrieving auth token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// (Optional) Response interceptor - handle global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: handle 401 errors globally
    if (error.response?.status === 401) {
      console.warn("🚨 Unauthorized, redirect to login maybe?");
    }
    return Promise.reject(error);
  }
);

export default apiClient;


