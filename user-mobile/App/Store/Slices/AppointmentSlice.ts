// src/store/slices/appointmentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appointmentsApi } from '../../Services/API/AppointmentAPI';

// Types
export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceNameTranslations?: {
    si?: string;
    ta?: string;
  };
  date: string; // YYYY-MM-DD
  time: string; // HH:MM format
  office: string;
  officeAddress: string;
  purpose: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  createdAt: string;
  updatedAt: string;
  referenceNumber?: string;
  reminderSent?: boolean;
  userId: string;
}

interface AppointmentsState {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isCancelling: boolean;
  isRescheduling: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  cancelError: string | null;
  rescheduleError: string | null;
  lastFetchTime: string | null;
}

// Initial state
const initialState: AppointmentsState = {
  appointments: [],
  upcomingAppointments: [],
  pastAppointments: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isCancelling: false,
  isRescheduling: false,
  error: null,
  createError: null,
  updateError: null,
  cancelError: null,
  rescheduleError: null,
  lastFetchTime: null,
};

// Helper function to categorize appointments
const categorizeAppointments = (appointments: Appointment[]) => {
  const now = new Date();
  return {
    upcoming: appointments.filter(app => new Date(app.date) >= now),
    past: appointments.filter(app => new Date(app.date) < now)
  };
};

// Async thunks
export const fetchAppointments = createAsyncThunk<Appointment[], void, { rejectValue: string }>(
  'appointments/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentsApi.getAppointments();
      
      if (response.success) {
        await AsyncStorage.setItem('userAppointments', JSON.stringify(response.data));
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch appointments');
    } catch (error: any) {
      try {
        const cachedData = await AsyncStorage.getItem('userAppointments');
        if (cachedData) return JSON.parse(cachedData);
      } catch {}
      
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const createAppointment = createAsyncThunk<Appointment, Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>, { rejectValue: string }>(
  'appointments/create',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await appointmentsApi.createAppointment(appointmentData);
      if (response.success) return response.data;
      return rejectWithValue(response.message || 'Failed to create appointment');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Creation failed');
    }
  }
);

export const updateAppointment = createAsyncThunk<{
  appointmentId: string;
  updates: Partial<Appointment>;
}, { 
  appointmentId: string; 
  updates: Partial<Appointment> 
}, { rejectValue: string }>(
  'appointments/update',
  async ({ appointmentId, updates }, { rejectWithValue }) => {
    try {
      const response = await appointmentsApi.updateAppointment(appointmentId, updates);
      if (response.success) return { appointmentId, updates: response.data };
      return rejectWithValue(response.message || 'Failed to update appointment');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Update failed');
    }
  }
);

export const cancelAppointment = createAsyncThunk<string, string, { rejectValue: string }>(
  'appointments/cancel',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await appointmentsApi.cancelAppointment(appointmentId);
      if (response.success) return appointmentId;
      return rejectWithValue(response.message || 'Failed to cancel appointment');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Cancellation failed');
    }
  }
);

export const rescheduleAppointment = createAsyncThunk<{
  appointmentId: string;
  newDate: string;
  newTime: string;
}, { 
  appointmentId: string; 
  newDate: string; 
  newTime: string 
}, { rejectValue: string }>(
  'appointments/reschedule',
  async ({ appointmentId, newDate, newTime }, { rejectWithValue }) => {
    try {
      const response = await appointmentsApi.rescheduleAppointment(appointmentId, newDate, newTime);
      if (response.success) return { appointmentId, newDate, newTime };
      return rejectWithValue(response.message || 'Failed to reschedule appointment');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Rescheduling failed');
    }
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
      const categorized = categorizeAppointments(state.appointments);
      state.upcomingAppointments = categorized.upcoming;
      state.pastAppointments = categorized.past;
    },
    
    updateAppointmentLocally: (state, action: PayloadAction<{ appointmentId: string; updates: Partial<Appointment> }>) => {
      const index = state.appointments.findIndex(app => app.id === action.payload.appointmentId);
      if (index !== -1) {
        state.appointments[index] = { 
          ...state.appointments[index], 
          ...action.payload.updates,
          updatedAt: new Date().toISOString()
        };
        const categorized = categorizeAppointments(state.appointments);
        state.upcomingAppointments = categorized.upcoming;
        state.pastAppointments = categorized.past;
      }
    },
    
    cancelAppointmentLocally: (state, action: PayloadAction<string>) => {
      const index = state.appointments.findIndex(app => app.id === action.payload);
      if (index !== -1) {
        state.appointments.splice(index, 1);
        const categorized = categorizeAppointments(state.appointments);
        state.upcomingAppointments = categorized.upcoming;
        state.pastAppointments = categorized.past;
      }
    },
    
    clearAppointmentErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.cancelError = null;
      state.rescheduleError = null;
    },
    
    resetAppointmentsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
        const categorized = categorizeAppointments(action.payload);
        state.upcomingAppointments = categorized.upcoming;
        state.pastAppointments = categorized.past;
        state.lastFetchTime = new Date().toISOString();
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch appointments';
      })
      
      .addCase(createAppointment.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isCreating = false;
        state.appointments.push(action.payload);
        const categorized = categorizeAppointments(state.appointments);
        state.upcomingAppointments = categorized.upcoming;
        state.pastAppointments = categorized.past;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload || 'Failed to create appointment';
      })
      
      .addCase(updateAppointment.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.appointments.findIndex(app => app.id === action.payload.appointmentId);
        if (index !== -1) {
          state.appointments[index] = { 
            ...state.appointments[index], 
            ...action.payload.updates,
            updatedAt: new Date().toISOString()
          };
          const categorized = categorizeAppointments(state.appointments);
          state.upcomingAppointments = categorized.upcoming;
          state.pastAppointments = categorized.past;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload || 'Failed to update appointment';
      })
      
      .addCase(cancelAppointment.pending, (state) => {
        state.isCancelling = true;
        state.cancelError = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.isCancelling = false;
        const index = state.appointments.findIndex(app => app.id === action.payload);
        if (index !== -1) {
          state.appointments.splice(index, 1);
          const categorized = categorizeAppointments(state.appointments);
          state.upcomingAppointments = categorized.upcoming;
          state.pastAppointments = categorized.past;
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.isCancelling = false;
        state.cancelError = action.payload || 'Failed to cancel appointment';
      })
      
      .addCase(rescheduleAppointment.pending, (state) => {
        state.isRescheduling = true;
        state.rescheduleError = null;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.isRescheduling = false;
        const index = state.appointments.findIndex(app => app.id === action.payload.appointmentId);
        if (index !== -1) {
          state.appointments[index] = { 
            ...state.appointments[index], 
            date: action.payload.newDate,
            time: action.payload.newTime,
            status: 'rescheduled',
            updatedAt: new Date().toISOString()
          };
          const categorized = categorizeAppointments(state.appointments);
          state.upcomingAppointments = categorized.upcoming;
          state.pastAppointments = categorized.past;
        }
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.isRescheduling = false;
        state.rescheduleError = action.payload || 'Failed to reschedule appointment';
      });
  },
});

export const {
  addAppointment,
  updateAppointmentLocally,
  cancelAppointmentLocally,
  clearAppointmentErrors,
  resetAppointmentsState,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;