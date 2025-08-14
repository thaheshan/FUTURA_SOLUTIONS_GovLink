import axios from 'axios';

const API_BASE_URL = 'https://api.gov-services.lk';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const notificationsApi = {
  getNotifications: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: getAuthHeader()
      });
      return {
        success: true,
        data: response.data,
        message: 'Notifications fetched'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch notifications',
        error: error.response?.data || error.message
      };
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await axios.put(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {},
        { headers: getAuthHeader() }
      );
      return { success: true, message: 'Marked as read' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Mark as read failed',
        error: error.response?.data || error.message
      };
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, {
        headers: getAuthHeader()
      });
      return { success: true, message: 'Notification deleted' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Deletion failed',
        error: error.response?.data || error.message
      };
    }
  },

  clearAll: async () => {
    try {
      await axios.delete(`${API_BASE_URL}/notifications`, {
        headers: getAuthHeader()
      });
      return { success: true, message: 'All notifications cleared' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Clear all failed',
        error: error.response?.data || error.message
      };
    }
  }
};