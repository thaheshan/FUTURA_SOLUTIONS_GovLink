import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { 
  fetchServicesApi, 
  submitNICReissueApi, 
  fetchAppointmentsApi, 
  fetchTrackingRequestsApi 
} from '../../Services/API/ServiceAPI';

// Define types
export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  office: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  referenceNumber: string;
}

export interface TrackingRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  submittedDate: string;
  status: 'Submitted' | 'Processing' | 'Ready' | 'Rejected' | 'Completed';
  assignedOffice?: string;
  assignedOfficer?: string;
  estimatedCompletion?: string;
  referenceNumber: string;
}

interface ServicesState {
  services: Service[];
  appointments: Appointment[];
  trackingRequests: TrackingRequest[];
  selectedService: Service | null;
  loading: boolean;
  error: string | null;
  submissionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  currentTrackingId: string | null;
}

const initialState: ServicesState = {
  services: [],
  appointments: [],
  trackingRequests: [],
  selectedService: null,
  loading: false,
  error: null,
  submissionStatus: 'idle',
  currentTrackingId: null,
};

// Async thunks
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchServicesApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch services');
    }
  }
);

export const submitNICReissue = createAsyncThunk(
  'services/submitNICReissue',
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await submitNICReissueApi(formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Submission failed');
    }
  }
);

export const fetchAppointments = createAsyncThunk(
  'services/fetchAppointments',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetchAppointmentsApi(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch appointments');
    }
  }
);

export const fetchTrackingRequests = createAsyncThunk(
  'services/fetchTrackingRequests',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetchTrackingRequestsApi(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tracking requests');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSelectedService: (state, action: PayloadAction<Service | null>) => {
      state.selectedService = action.payload;
    },
    resetSubmissionStatus: (state) => {
      state.submissionStatus = 'idle';
    },
    setCurrentTrackingId: (state, action: PayloadAction<string | null>) => {
      state.currentTrackingId = action.payload;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    updateAppointmentStatus: (
      state, 
      action: PayloadAction<{id: string; status: 'Confirmed' | 'Cancelled' | 'Completed'}>
    ) => {
      const appointment = state.appointments.find(app => app.id === action.payload.id);
      if (appointment) {
        appointment.status = action.payload.status;
      }
    },
    updateTrackingRequest: (state, action: PayloadAction<TrackingRequest>) => {
      const index = state.trackingRequests.findIndex(
        req => req.id === action.payload.id
      );
      if (index !== -1) {
        state.trackingRequests[index] = action.payload;
      }
    },
    clearServicesData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Submit NIC Reissue
      .addCase(submitNICReissue.pending, (state) => {
        state.submissionStatus = 'loading';
      })
      .addCase(submitNICReissue.fulfilled, (state, action) => {
        state.submissionStatus = 'succeeded';
        state.trackingRequests.push(action.payload.trackingRequest);
        state.currentTrackingId = action.payload.trackingRequest.id;
      })
      .addCase(submitNICReissue.rejected, (state, action) => {
        state.submissionStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Tracking Requests
      .addCase(fetchTrackingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrackingRequests.fulfilled, (state, action: PayloadAction<TrackingRequest[]>) => {
        state.loading = false;
        state.trackingRequests = action.payload;
      })
      .addCase(fetchTrackingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { 
  setSelectedService, 
  resetSubmissionStatus, 
  setCurrentTrackingId,
  addAppointment,
  updateAppointmentStatus,
  updateTrackingRequest,
  clearServicesData
} = servicesSlice.actions;

// Selectors
export const selectServices = (state: RootState) => state.services.services;
export const selectAppointments = (state: RootState) => state.services.appointments;
export const selectTrackingRequests = (state: RootState) => state.services.trackingRequests;
export const selectSelectedService = (state: RootState) => state.services.selectedService;
export const selectSubmissionStatus = (state: RootState) => state.services.submissionStatus;
export const selectCurrentTrackingId = (state: RootState) => state.services.currentTrackingId;
export const selectTrackingRequestById = (id: string) => (state: RootState) => 
  state.services.trackingRequests.find((req: { id: string; }) => req.id === id);
export const selectServiceById = (id: string) => (state: RootState) => 
  state.services.services.find((service: { id: string; }) => service.id === id);

export default servicesSlice.reducer;