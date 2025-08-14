import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trackingApi } from '../../Services/API/TrackingAPI';

// Async thunks for tracking operations
type SubmitApplicationPayload = {
  serviceId: string;
  applicationData: any;
  documents: any[];
};

export const submitApplication = createAsyncThunk<
  any, // Replace 'any' with the correct return type if known
  SubmitApplicationPayload
>(
  'tracking/submitApplication',
  async ({ serviceId, applicationData, documents }, { rejectWithValue }) => {
    try {
      const response = await trackingApi.submitApplication({
        serviceId,
        applicationData,
        documents,
      });
      
      if (response.success) {
        // Cache the submitted application
        const cachedApps = await AsyncStorage.getItem('userApplications');
        const applications = cachedApps ? JSON.parse(cachedApps) : [];
        applications.unshift(response.data);
        await AsyncStorage.setItem('userApplications', JSON.stringify(applications));
        
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Application submission failed');
      }
    } catch (error) {
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message
        : undefined;
      return rejectWithValue(errorMessage || 'Submission error');
    }
  }
);

export const fetchUserApplications = createAsyncThunk(
  'tracking/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await trackingApi.getUserApplications();
      
      if (response.success) {
        // Cache applications
        await AsyncStorage.setItem('userApplications', JSON.stringify(response.data));
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch applications');
      }
    } catch (error) {
      // Try to load from cache if network fails
      try {
        const cachedData = await AsyncStorage.getItem('userApplications');
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      } catch (cacheError) {
        console.log('No cached applications data available');
      }
      
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message
        : undefined;
      return rejectWithValue(errorMessage || 'Network error');
    }
  }
);

export const trackApplicationByReference = createAsyncThunk<
  any, // Replace 'any' with the correct return type if known
  string
>(
  'tracking/trackByReference',
  async (referenceNumber, { rejectWithValue }) => {
    try {
      const response = await trackingApi.trackByReference(referenceNumber);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Application not found');
      }
    } catch (error) {
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message
        : undefined;
      return rejectWithValue(errorMessage || 'Tracking failed');
    }
  }
);

export const fetchApplicationDetails = createAsyncThunk<
  any, // Replace 'any' with the correct return type if known
  string
>(
  'tracking/fetchDetails',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await trackingApi.getApplicationDetails(applicationId);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Application details not found');
      }
    } catch (error) {
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message
        : undefined;
      return rejectWithValue(errorMessage || 'Failed to fetch details');
    }
  }
);

type CancelApplicationPayload = {
  applicationId: string;
  reason: string;
};

export const cancelApplication = createAsyncThunk<
  { applicationId: string; status: string }, // Return type
  CancelApplicationPayload // Payload type
>(
  'tracking/cancelApplication',
  async ({ applicationId, reason }, { rejectWithValue }) => {
    try {
      const response = await trackingApi.cancelApplication(applicationId, reason);
      
      if (response.success) {
        return { applicationId, status: 'cancelled' };
      } else {
        return rejectWithValue(response.message || 'Cancellation failed');
      }
    } catch (error) {
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message
        : undefined;
      return rejectWithValue(errorMessage || 'Cancellation error');
    }
  }
);

type UploadAdditionalDocumentsPayload = {
  applicationId: string;
  documents: any[];
};

export const uploadAdditionalDocuments = createAsyncThunk<
  { applicationId: string; documents: any[]; updatedAt: string }, // Return type
  UploadAdditionalDocumentsPayload // Payload type
>(
  'tracking/uploadDocuments',
  async ({ applicationId, documents }, { rejectWithValue }) => {
    try {
      const response = await trackingApi.uploadDocuments(applicationId, documents);
      
      if (response.success) {
        return {
          applicationId,
          documents: response.data.documents,
          updatedAt: response.data.updatedAt,
        };
      } else {
        return rejectWithValue(response.message || 'Document upload failed');
      }
    } catch (error) {
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message
        : undefined;
      return rejectWithValue(errorMessage || 'Upload error');
    }
  }
);

export const fetchApplicationHistory = createAsyncThunk<
  { applicationId: string; history: any },
  string
>(
  'tracking/fetchHistory',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await trackingApi.getApplicationHistory(applicationId);
      
      if (response.success) {
        return {
          applicationId,
          history: response.data,
        };
      } else {
        return rejectWithValue(response.message || 'History not found');
      }
    } catch (error) {
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message
        : undefined;
      return rejectWithValue(errorMessage || 'Failed to fetch history');
    }
  }
);

// Define Application type
export interface Application {
  id: string;
  status: string;
  submittedAt: string;
  updatedAt?: string;
  serviceName: string;
  documents: any[];
  [key: string]: any;
}

// Initial state
interface TrackingState {
  applications: Application[];
  currentApplication: Application | null;
  applicationDetails: { [id: string]: Application };
  applicationHistory: { [id: string]: any };
  trackedApplication: Application | null;
  trackingReference: string;
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    approved: number;
    rejected: number;
    cancelled: number;
  };
  statusDefinitions: any;
  filters: {
    status: string;
    service: string;
    dateRange: string;
    sortBy: string;
  };
  isLoading: boolean;
  isSubmitting: boolean;
  isTracking: boolean;
  isLoadingDetails: boolean;
  isLoadingHistory: boolean;
  isUploading: boolean;
  isCancelling: boolean;
  error: string | null;
  submitError: string | null;
  trackingError: string | null;
  uploadError: string | null;
  cancelError: string | null;
  submitSuccess: boolean;
  trackingSuccess: boolean;
  uploadSuccess: boolean;
  cancelSuccess: boolean;
  showQRCode: boolean;
  selectedApplicationId: string | null;
  lastFetchTime: string | null;
  cacheExpiry: number;
}

const initialState: TrackingState = {
  // Applications data
  applications: [],
  currentApplication: null,
  applicationDetails: {},
  applicationHistory: {},
  
  // Tracking
  trackedApplication: null,
  trackingReference: '',
  
  // Statistics
  stats: {
    total: 0,
    pending: 0,
    inProgress: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  },
  
  // Status definitions
  statusDefinitions: {
    submitted: {
      name: 'Submitted',
      description: 'Application has been submitted successfully',
      color: '#3B82F6',
      icon: 'check-circle',
      order: 1,
    },
    received: {
      name: 'Received',
      description: 'Application received by the office',
      color: '#10B981',
      icon: 'inbox',
      order: 2,
    },
    reviewing: {
      name: 'Under Review',
      description: 'Application is being reviewed',
      color: '#F59E0B',
      icon: 'eye',
      order: 3,
    },
    documents_required: {
      name: 'Documents Required',
      description: 'Additional documents needed',
      color: '#EF4444',
      icon: 'file-plus',
      order: 4,
    },
    processing: {
      name: 'Processing',
      description: 'Application is being processed',
      color: '#8B5CF6',
      icon: 'clock',
      order: 5,
    },
    ready_for_collection: {
      name: 'Ready for Collection',
      description: 'Document ready for pickup',
      color: '#06D6A0',
      icon: 'package',
      order: 6,
    },
    completed: {
      name: 'Completed',
      description: 'Application process completed',
      color: '#059669',
      icon: 'check-double',
      order: 7,
    },
    rejected: {
      name: 'Rejected',
      description: 'Application has been rejected',
      color: '#DC2626',
      icon: 'x-circle',
      order: 8,
    },
    cancelled: {
      name: 'Cancelled',
      description: 'Application cancelled by user',
      color: '#6B7280',
      icon: 'x',
      order: 9,
    },
  },
  
  // Filters
  filters: {
    status: 'all',
    service: 'all',
    dateRange: 'all', // last_week, last_month, last_3_months, all
    sortBy: 'date_desc', // date_desc, date_asc, status, service
  },
  
  // Loading states
  isLoading: false,
  isSubmitting: false,
  isTracking: false,
  isLoadingDetails: false,
  isLoadingHistory: false,
  isUploading: false,
  isCancelling: false,
  
  // Error states
  error: null,
  submitError: null,
  trackingError: null,
  uploadError: null,
  cancelError: null,
  
  // Success states
  submitSuccess: false,
  trackingSuccess: false,
  uploadSuccess: false,
  cancelSuccess: false,
  
  // UI states
  showQRCode: false,
  selectedApplicationId: null,
  
  // Cache info
  lastFetchTime: null,
  cacheExpiry: 300000, // 5 minutes
};

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    // Clear error states
    clearTrackingErrors: (state) => {
      state.error = null;
      state.submitError = null;
      state.trackingError = null;
      state.uploadError = null;
      state.cancelError = null;
    },
    
    // Clear success states
    clearTrackingSuccess: (state) => {
      state.submitSuccess = false;
      state.trackingSuccess = false;
      state.uploadSuccess = false;
      state.cancelSuccess = false;
    },
    
    // Set tracking reference
    setTrackingReference: (state, action) => {
      state.trackingReference = action.payload;
    },
    
    // Clear tracking reference
    clearTrackingReference: (state) => {
      state.trackingReference = '';
      state.trackedApplication = null;
      state.trackingError = null;
    },
    
    // Set filters
    setTrackingFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Reset filters
    resetTrackingFilters: (state) => {
      state.filters = {
        status: 'all',
        service: 'all',
        dateRange: 'all',
        sortBy: 'date_desc',
      };
    },
    
    // Set current application
    setCurrentApplication: (state, action) => {
      state.currentApplication = action.payload;
    },
    
    // Clear current application
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
    
    // Set selected application ID
    setSelectedApplicationId: (state, action) => {
      state.selectedApplicationId = action.payload;
    },
    
    // Toggle QR code display
    toggleQRCode: (state, action) => {
      state.showQRCode = action.payload !== undefined ? action.payload : !state.showQRCode;
    },
    
    // Update application status
    updateApplicationStatus: (state, action) => {
      const { applicationId, status, updatedAt } = action.payload;
      const applicationIndex = state.applications.findIndex(app => app.id === applicationId);
      
      if (applicationIndex !== -1) {
        state.applications[applicationIndex].status = status;
        state.applications[applicationIndex].updatedAt = updatedAt || new Date().toISOString();
      }
      
      // Update current application if it matches
      if (state.currentApplication && state.currentApplication.id === applicationId) {
        state.currentApplication.status = status;
        state.currentApplication.updatedAt = updatedAt || new Date().toISOString();
      }
      
      // Recalculate stats
      state.stats = calculateApplicationStats(state.applications);
    },
    
    // Add new application
    addApplication: (state, action) => {
      state.applications.unshift(action.payload);
      state.stats = calculateApplicationStats(state.applications);
    },
    
    // Update application
    updateApplication: (state, action) => {
      const { id, updates } = action.payload;
      const applicationIndex = state.applications.findIndex(app => app.id === id);
      
      if (applicationIndex !== -1) {
        state.applications[applicationIndex] = {
          ...state.applications[applicationIndex],
          ...updates,
        };
      }
      
      state.stats = calculateApplicationStats(state.applications);
    },
    
    // Remove application
    removeApplication: (state, action) => {
      const applicationId = action.payload;
      state.applications = state.applications.filter(app => app.id !== applicationId);
      state.stats = calculateApplicationStats(state.applications);
      
      // Clear current application if it matches
      if (state.currentApplication && state.currentApplication.id === applicationId) {
        state.currentApplication = null;
      }
    },
    
    // Sort applications
    sortApplications: (state, action) => {
      const sortBy = action.payload;
      
      state.applications.sort((a, b) => {
        switch (sortBy) {
          case 'date_desc':
            return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
          case 'date_asc':
            return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
          case 'status':
            return a.status.localeCompare(b.status);
          case 'service':
            return a.serviceName.localeCompare(b.serviceName);
          default:
            return 0;
        }
      });
      
      state.filters.sortBy = sortBy;
    },
    
    // Reset tracking state
    resetTrackingState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Submit application
    builder
      .addCase(submitApplication.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.applications.unshift(action.payload);
        state.submitSuccess = true;
        state.submitError = null;
        state.stats = calculateApplicationStats(state.applications);
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = typeof action.payload === 'string' ? action.payload : String(action.payload ?? '');
        state.submitSuccess = false;
      });

    // Fetch user applications
    builder
      .addCase(fetchUserApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
        state.error = null;
        state.lastFetchTime = new Date().toISOString();
        state.stats = calculateApplicationStats(action.payload);
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : String(action.payload ?? '');
      });

    // Track application by reference
    builder
      .addCase(trackApplicationByReference.pending, (state) => {
        state.isTracking = true;
        state.trackingError = null;
        state.trackingSuccess = false;
      })
      .addCase(trackApplicationByReference.fulfilled, (state, action) => {
        state.isTracking = false;
        state.trackedApplication = action.payload;
        state.trackingSuccess = true;
        state.trackingError = null;
      })
      .addCase(trackApplicationByReference.rejected, (state, action) => {
        state.isTracking = false;
        state.trackingError = typeof action.payload === 'string' ? action.payload : String(action.payload ?? '');
        state.trackingSuccess = false;
        state.trackedApplication = null;
      });

    // Fetch application details
    builder
      .addCase(fetchApplicationDetails.pending, (state) => {
        state.isLoadingDetails = true;
      })
      .addCase(fetchApplicationDetails.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.currentApplication = action.payload;
        state.applicationDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchApplicationDetails.rejected, (state) => {
        state.isLoadingDetails = false;
      });

    // Cancel application
    builder
      .addCase(cancelApplication.pending, (state) => {
        state.isCancelling = true;
        state.cancelError = null;
        state.cancelSuccess = false;
      })
      .addCase(cancelApplication.fulfilled, (state, action) => {
        state.isCancelling = false;
        const { applicationId, status } = action.payload;
        
        // Update application status
        const applicationIndex = state.applications.findIndex(app => app.id === applicationId);
        if (applicationIndex !== -1) {
          state.applications[applicationIndex].status = status;
          state.applications[applicationIndex].updatedAt = new Date().toISOString();
        }
        
        state.cancelSuccess = true;
        state.cancelError = null;
        state.stats = calculateApplicationStats(state.applications);
      })
      .addCase(cancelApplication.rejected, (state, action) => {
        state.isCancelling = false;
        state.cancelError = typeof action.payload === 'string' ? action.payload : String(action.payload ?? '');
        state.cancelSuccess = false;
      });

    // Upload additional documents
    builder
      .addCase(uploadAdditionalDocuments.pending, (state) => {
        state.isUploading = true;
        state.uploadError = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadAdditionalDocuments.fulfilled, (state, action) => {
        state.isUploading = false;
        const { applicationId, documents, updatedAt } = action.payload;
        
        // Update application with new documents
        const applicationIndex = state.applications.findIndex(app => app.id === applicationId);
        if (applicationIndex !== -1) {
          state.applications[applicationIndex].documents = [
            ...state.applications[applicationIndex].documents,
            ...documents,
          ];
          state.applications[applicationIndex].updatedAt = updatedAt;
        }
        
        state.uploadSuccess = true;
        state.uploadError = null;
      })
      .addCase(uploadAdditionalDocuments.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadError = typeof action.payload === 'string' ? action.payload : String(action.payload ?? '');
        state.uploadSuccess = false;
      });

    // Fetch application history
    builder
      .addCase(fetchApplicationHistory.pending, (state) => {
        state.isLoadingHistory = true;
      })
      .addCase(fetchApplicationHistory.fulfilled, (state, action) => {
        state.isLoadingHistory = false;
        if (action.payload && typeof action.payload === 'object' && 'applicationId' in action.payload && 'history' in action.payload) {
          const { applicationId, history } = action.payload as unknown as { applicationId: string; history: any };
          state.applicationHistory[applicationId] = history;
        }
      })
      .addCase(fetchApplicationHistory.rejected, (state) => {
        state.isLoadingHistory = false;
      });
  },
});

// Helper function to calculate application statistics
const calculateApplicationStats = (applications: any[]) => {
  const stats = {
    total: applications.length,
    pending: 0,
    inProgress: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  };
  
  applications.forEach((app) => {
    switch (app.status) {
      case 'submitted':
      case 'received':
        stats.pending++;
        break;
      case 'reviewing':
      case 'documents_required':
      case 'processing':
        stats.inProgress++;
        break;
      case 'completed':
      case 'ready_for_collection':
        stats.approved++;
        break;
      case 'rejected':
        stats.rejected++;
        break;
      case 'cancelled':
        stats.cancelled++;
        break;
      default:
        break;
    }
  });
  
  return stats;
};

export const {
  clearTrackingErrors,
  clearTrackingSuccess,
  setTrackingReference,
  clearTrackingReference,
  setTrackingFilters,
  resetTrackingFilters,
  setCurrentApplication,
  clearCurrentApplication,
  setSelectedApplicationId,
  toggleQRCode,
  updateApplicationStatus,
  addApplication,
  updateApplication,
  removeApplication,
  sortApplications,
  resetTrackingState,
} = trackingSlice.actions;

export default trackingSlice.reducer;