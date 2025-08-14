import axios from 'axios';
import { UserProfile, UserPreferences } from '../../Store/Slices/UserSlice';

const API_BASE_URL = 'https://api.gov-services.lk';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const profileApi = {
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: getAuthHeader()
      });
      return {
        success: true,
        data: response.data,
        message: 'Profile fetched successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile',
        error: error.response?.data || error.message
      };
    }
  },

  updateProfile: async (profileData: Partial<UserProfile>) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/profile`, profileData, {
        headers: getAuthHeader()
      });
      return {
        success: true,
        data: response.data,
        message: 'Profile updated successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
        error: error.response?.data || error.message
      };
    }
  },

  uploadPhoto: async (photoData: FormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/profile/photo`, photoData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        success: true,
        data: response.data,
        message: 'Photo uploaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Photo upload failed',
        error: error.response?.data || error.message
      };
    }
  },

  updatePreferences: async (preferences: Partial<UserPreferences>) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/profile/preferences`, preferences, {
        headers: getAuthHeader()
      });
      return {
        success: true,
        data: response.data,
        message: 'Preferences updated successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Preferences update failed',
        error: error.response?.data || error.message
      };
    }
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/profile/password`, data, {
        headers: getAuthHeader()
      });
      return {
        success: true,
        message: response.data.message || 'Password changed successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password change failed',
        error: error.response?.data || error.message
      };
    }
  }
};