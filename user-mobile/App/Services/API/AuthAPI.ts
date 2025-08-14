import axios from 'axios';
import { LoginCredentials, RegisterData, OTPData } from '../../Store/Slices/AuthSlice';

const API_BASE_URL = 'https://api.gov-services.lk';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        error: error.response?.data || error.message
      };
    }
  },

  register: async (userData: RegisterData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return {
        success: true,
        data: response.data,
        message: 'Registration successful'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        error: error.response?.data || error.message
      };
    }
  },

  verifyOTP: async (otpData: OTPData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, otpData);
      return {
        success: true,
        data: response.data,
        message: 'OTP verified'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed',
        error: error.response?.data || error.message
      };
    }
  },

  refreshToken: async (refreshToken: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
      return {
        success: true,
        data: response.data,
        message: 'Token refreshed'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Token refresh failed',
        error: error.response?.data || error.message
      };
    }
  },

  logout: async (token: string) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true, message: 'Logged out successfully' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
        error: error.response?.data || error.message
      };
    }
  },

  forgotPassword: async (data: { email: string }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, data);
      return {
        success: true,
        data: response.data,
        message: 'Password reset instructions sent'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
        error: error.response?.data || error.message
      };
    }
  }
};