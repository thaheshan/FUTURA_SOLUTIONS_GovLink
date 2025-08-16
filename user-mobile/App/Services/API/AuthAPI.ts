// src/Api/authApi.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, RegisterData, OTPData } from '../../Store/Slices/AuthSlice';

const API_BASE_URL = 'https://api.gov-services.lk';

// Centralized axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to attach auth token from AsyncStorage
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message: string;
  error?: any;
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      await AsyncStorage.setItem('authToken', response.data.token);
      return { success: true, data: response.data, message: 'Login successful' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Login failed', error: error.response?.data || error.message };
    }
  },

  register: async (userData: RegisterData): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return { success: true, data: response.data, message: 'Registration successful' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Registration failed', error: error.response?.data || error.message };
    }
  },

  verifyOTP: async (otpData: OTPData): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/auth/verify-otp', otpData);
      return { success: true, data: response.data, message: 'OTP verified' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'OTP verification failed', error: error.response?.data || error.message };
    }
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/auth/refresh-token', { refreshToken });
      await AsyncStorage.setItem('authToken', response.data.token);
      return { success: true, data: response.data, message: 'Token refreshed' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Token refresh failed', error: error.response?.data || error.message };
    }
  },

  logout: async (token: string): Promise<ApiResponse<null>> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        await apiClient.post('/auth/logout', null, { headers: { Authorization: `Bearer ${token}` } });
      }
      await AsyncStorage.removeItem('authToken');
      return { success: true, message: 'Logged out successfully' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Logout failed', error: error.response?.data || error.message };
    }
  },

  forgotPassword: async (data: { email: string }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/auth/forgot-password', data);
      return { success: true, data: response.data, message: 'Password reset instructions sent' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Password reset failed', error: error.response?.data || error.message };
    }
  }
};
