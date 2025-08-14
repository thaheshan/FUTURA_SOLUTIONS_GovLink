import axios from 'axios';
import { Appointment } from '../../Store/Slices/AppointmentSlice';

const API_BASE_URL = 'https://api.gov-services.lk';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const appointmentsApi = {
  getAppointments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: getAuthHeader()
      });
      return {
        success: true,
        data: response.data,
        message: 'Appointments fetched'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch appointments',
        error: error.response?.data || error.message
      };
    }
  },

  createAppointment: async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appointments`, appointmentData, {
        headers: getAuthHeader()
      });
      return {
        success: true,
        data: response.data,
        message: 'Appointment created'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Creation failed',
        error: error.response?.data || error.message
      };
    }
  },

  updateAppointment: async (appointmentId: string, updates: Partial<Appointment>) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/appointments/${appointmentId}`,
        updates,
        { headers: getAuthHeader() }
      );
      return {
        success: true,
        data: response.data,
        message: 'Appointment updated'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed',
        error: error.response?.data || error.message
      };
    }
  },

  cancelAppointment: async (appointmentId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/appointments/${appointmentId}`, {
        headers: getAuthHeader()
      });
      return { success: true, message: 'Appointment cancelled' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Cancellation failed',
        error: error.response?.data || error.message
      };
    }
  },

  rescheduleAppointment: async (appointmentId: string, newDate: string, newTime: string) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/appointments/${appointmentId}/reschedule`,
        { newDate, newTime },
        { headers: getAuthHeader() }
      );
      return {
        success: true,
        data: response.data,
        message: 'Appointment rescheduled'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Rescheduling failed',
        error: error.response?.data || error.message
      };
    }
  }
};