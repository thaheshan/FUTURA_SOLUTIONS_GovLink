// src/services/api/appointmentsApi.ts
import axios from 'axios';
import { Appointment } from '../../Store/Slices/AppointmentSlice';

const API_BASE_URL = 'https://api.gov-services.lk';

// Enhanced types for appointment booking
interface AppointmentBookingData {
  serviceId: string;
  appointmentDate: string;
  timeSlot: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  additionalNotes?: string;
  purpose?: string;
  fullName?: string;
  nic?: string;
  divisionId?: string;
  divisionName?: string;
  urgency?: 'low' | 'medium' | 'high';
  appointmentType?: string;
  subject?: string;
  description?: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  maxCapacity: number;
  currentBookings: number;
}

interface Division {
  id: string;
  name: string;
  type: 'GS' | 'DS';
  area: string;
  officer: {
    name: string;
    phone: string;
    email?: string;
  };
  address?: string;
  workingHours?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: any;
  statusCode?: number;
}

interface AppointmentResponse {
  appointmentId: string;
  id: string;
  referenceNumber: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  appointmentDate: string;
  timeSlot: string;
  divisionName: string;
  appointmentType: string;
  createdAt: string;
  updatedAt: string;
}

// Extend Axios request config to include metadata
import type { InternalAxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

// Helper function to get authorization header with enhanced error handling
const getAuthHeader = () => {
  try {
    // For React Native, use AsyncStorage instead of localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('accessToken');
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
    
    // For React Native environments
    // You might want to use AsyncStorage here
    // const token = await AsyncStorage.getItem('accessToken');
    // return token ? { Authorization: `Bearer ${token}` } : {};
    
    return {};
  } catch (error) {
    console.warn('Failed to get auth token:', error);
    return {};
  }
};

// Create axios instance with enhanced configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Enhanced request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeader();
    
    // Handle different axios versions
    if (config.headers && typeof config.headers.set === 'function') {
      // Axios v1+ uses AxiosHeaders instance
      Object.entries(authHeaders).forEach(([key, value]) => {
        config.headers.set(key, value as string);
      });
    } else if (config.headers) {
      // Fallback for plain object headers
      Object.assign(config.headers, authHeaders);
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date().getTime() };
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const endTime = new Date().getTime();
    const duration = endTime - (response.config.metadata?.startTime || endTime);
    
    if (__DEV__) {
      console.log(`API Request completed in ${duration}ms:`, {
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        status: response.status,
        duration: `${duration}ms`
      });
    }
    
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    return Promise.reject(error);
  }
);

export const appointmentsApi = {
  // Get all appointments for the user with enhanced error handling
  getAppointments: async (): Promise<ApiResponse<Appointment[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: getAuthHeader()
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Appointments fetched successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch appointments',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  },

  // Get user's appointments with pagination support
  getMyAppointments: async (page: number = 1, limit: number = 10): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(`/appointments/my?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data,
        message: 'My appointments fetched successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch my appointments',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  },

  // Get available time slots with enhanced filtering
  getAvailableSlots: async (date: string, serviceId?: string): Promise<ApiResponse<TimeSlot[]>> => {
    try {
      let url = `/appointments/slots?date=${date}`;
      if (serviceId) {
        url += `&serviceId=${serviceId}`;
      }
      
      const response = await apiClient.get(url);
      
      // Ensure data is in expected format
      const slots = Array.isArray(response.data) ? response.data : response.data.slots || [];
      
      return {
        success: true,
        data: slots,
        message: 'Available slots fetched successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch available slots',
        error: error.response?.data || error.message,
        statusCode: error.response?.status,
        data: [] // Return empty array on error
      };
    }
  },

  // Get divisions list
  getDivisions: async (): Promise<ApiResponse<Division[]>> => {
    try {
      const response = await apiClient.get('/divisions');
      return {
        success: true,
        data: response.data,
        message: 'Divisions fetched successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch divisions',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  },

  // Create a new appointment with comprehensive data
  createAppointment: async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<ApiResponse<AppointmentResponse>> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appointments`, appointmentData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Appointment created successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create appointment',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  },

  // Enhanced book appointment method
  bookAppointment: async (appointmentData: AppointmentBookingData): Promise<ApiResponse<AppointmentResponse>> => {
    try {
      // Validate required fields
      if (!appointmentData.appointmentDate || !appointmentData.timeSlot) {
        return {
          success: false,
          message: 'Date and time slot are required',
          error: 'Validation error'
        };
      }

      const response = await apiClient.post('/appointments', {
        ...appointmentData,
        // Add timestamp for tracking
        requestTimestamp: new Date().toISOString(),
        // Add client info
        clientInfo: {
          platform: 'mobile',
          version: '1.0.0'
        }
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Appointment booked successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to book appointment',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  },

  // Update an existing appointment
  updateAppointment: async (appointmentId: string, updates: Partial<Appointment>): Promise<ApiResponse<AppointmentResponse>> => {
    try {
      if (!appointmentId) {
        return {
          success: false,
          message: 'Appointment ID is required',
          error: 'Validation error'
        };
      }

      const response = await axios.put(
        `${API_BASE_URL}/appointments/${appointmentId}`,
        {
          ...updates,
          updatedAt: new Date().toISOString()
        },
        { 
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        success: true,
        data: response.data,
        message: 'Appointment updated successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update appointment',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  },

  // Reschedule an appointment (primary method)
  rescheduleAppointment: async (appointmentId: string, newDate: string, newTime: string, reason?: string): Promise<ApiResponse<AppointmentResponse>> => {
    try {
      if (!appointmentId || !newDate || !newTime) {
        return {
          success: false,
          message: 'Appointment ID, date, and time are required',
          error: 'Validation error'
        };
      }

      const response = await axios.put(
        `${API_BASE_URL}/appointments/${appointmentId}/reschedule`,
        { 
          newDate, 
          newTime,
          reason,
          rescheduledAt: new Date().toISOString()
        },
        { headers: getAuthHeader() }
      );
      
      return {
        success: true,
        data: response.data,
        message: 'Appointment rescheduled successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reschedule appointment',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  },

  // Alternative reschedule method
  rescheduleAppointmentAlt: async (appointmentId: string, newDate: string, newTimeSlot: string): Promise<ApiResponse<AppointmentResponse>> => {
    try {
      const response = await apiClient.put(`/appointments/${appointmentId}`, {
        appointmentDate: newDate,
        timeSlot: newTimeSlot,
        status: 'rescheduled',
        updatedAt: new Date().toISOString()
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Appointment rescheduled successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reschedule appointment',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  },

  // Cancel an appointment (simple cancellation)
  cancelAppointment: async (appointmentId: string): Promise<ApiResponse> => {
    try {
      if (!appointmentId) {
        return {
          success: false,
          message: 'Appointment ID is required',
          error: 'Validation error'
        };
      }

      const response = await axios.delete(`${API_BASE_URL}/appointments/${appointmentId}`, {
        headers: getAuthHeader()
      });
      
      return { 
        success: true, 
        message: 'Appointment cancelled successfully',
        data: response.data,
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel appointment',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  },

  // Cancel appointment with reason
  cancelAppointmentWithReason: async (appointmentId: string, reason: string): Promise<ApiResponse> => {
    try {
      if (!appointmentId || !reason) {
        return {
          success: false,
          message: 'Appointment ID and cancellation reason are required',
          error: 'Validation error'
        };
      }

      const response = await apiClient.delete(`/appointments/${appointmentId}`, {
        data: { 
          reason,
          cancelledAt: new Date().toISOString(),
          status: 'cancelled'
        }
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Appointment cancelled successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel appointment',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  },

  // Get appointment details by ID with enhanced data
  getAppointmentById: async (appointmentId: string): Promise<ApiResponse<AppointmentResponse>> => {
    try {
      if (!appointmentId) {
        return {
          success: false,
          message: 'Appointment ID is required',
          error: 'Validation error'
        };
      }

      const response = await apiClient.get(`/appointments/${appointmentId}`);
      return {
        success: true,
        data: response.data,
        message: 'Appointment details fetched successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch appointment details',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  },

  // Get appointment statistics
  getAppointmentStats: async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get('/appointments/stats');
      return {
        success: true,
        data: response.data,
        message: 'Appointment statistics fetched successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch appointment statistics',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  },

  // Check slot availability in real-time
  checkSlotAvailability: async (date: string, timeSlot: string, serviceId?: string): Promise<ApiResponse<{ available: boolean; capacity: number; currentBookings: number }>> => {
    try {
      let url = `/appointments/check-availability?date=${date}&timeSlot=${timeSlot}`;
      if (serviceId) {
        url += `&serviceId=${serviceId}`;
      }
      
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data,
        message: 'Slot availability checked successfully',
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check slot availability',
        error: error.response?.data || error.message,
        statusCode: error.response?.status
      };
    }
  }
};

// Export all types for use in other files
export type { 
  AppointmentBookingData, 
  ApiResponse, 
  TimeSlot, 
  Division, 
  AppointmentResponse 
};