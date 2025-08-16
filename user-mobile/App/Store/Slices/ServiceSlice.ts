// src/store/slices/servicesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { servicesApi } from '../../Services/API/ServiceAPI';
import type { 
  ApiResponse, 
  NICApplicationResponse, 
  ApplicationStatus, 
  DocumentUpload, 
  PaymentDetails,
  NotificationPreferences,
  ServiceStats
} from '../../Services/API/ServiceAPI';

// --- Enhanced Types ---
export interface Service {
  id: string;
  name: string;
  nameTranslations: { si: string; ta: string };
  category: 'registry' | 'certificates' | 'permits' | 'welfare' | 'land' | 'other';
  isActive: boolean;
  description: string;
  estimatedTime: string;
  fee: string;
  icon: string;
  color: string;
  requirements?: string[];
  isOnline: boolean;
  comingSoon?: boolean;
  popularity?: number;
  rating?: number;
  totalApplications?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  serviceCount?: number;
}

export interface District {
  id: number;
  name: string;
  province: string;
  serviceCount?: number;
}

export interface ServiceRequirement {
  id: string;
  name: string;
  description: string;
  isOptional: boolean;
  documentTypes: string[];
  validationRules?: any;
  examples?: string[];
}

export interface ServiceFee {
  type: 'regular' | 'urgent' | 'express';
  amount: number;
  currency: string;
  description: string;
  processingTime: string;
  additionalCharges?: { name: string; amount: number }[];
}

export interface SearchFilters {
  district: string | null;
  category: string | null;
  type: string | null;
  fee: string | null;
  rating?: number | null;
  popularity?: 'high' | 'medium' | 'low' | null;
}

export interface TrackingFilters {
  status: 'all' | 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  dateRange: { start: string; end: string };
  serviceType: string | null;
  sortBy?: 'date' | 'status' | 'service';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  results: Service[];
  query: string;
  totalResults: number;
  filters?: SearchFilters;
  suggestions?: string[];
}

export interface NICApplicationData {
  fullName: string;
  dateOfBirth: string;
  nicNumber?: string;
  fathersName: string;
  mothersName: string;
  previousAddress?: string;
  policeReportNumber?: string;
  currentAddress: string;
  maritalStatus?: string;
  nameChange?: string;
  contactNumber: string;
  applicationType?: string;
  documents: DocumentUpload[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferredLanguage?: 'en' | 'si' | 'ta';
  notificationPreferences?: NotificationPreferences;
}

export interface UserApplication {
  referenceNumber: string;
  serviceId: string;
  serviceName: string;
  status: ApplicationStatus['status'];
  submittedAt: string;
  lastUpdated: string;
  estimatedCompletionDate?: string;
  currentStage: string;
  progress: number;
  canCancel: boolean;
  canUpdate: boolean;
  requiresAction: boolean;
}

export interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  contactNumber: string;
  email?: string;
  workingHours: string;
  services: string[];
  coordinates?: { lat: number; lng: number };
  rating?: number;
  reviews?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  applicationRef?: string;
}

// --- Enhanced State Interface ---
export interface ServicesState {
  // Services Data
  services: Service[];
  featuredServices: Service[];
  popularServices: Service[];
  recentlyUsed: string[];
  currentService: Service | null;
  serviceRequirements: Record<string, ServiceRequirement[]>;
  serviceFees: Record<string, ServiceFee[]>;
  serviceCenters: ServiceCenter[];
  
  // Search & Filters
  searchResults: Service[];
  searchQuery: string;
  searchFilters: SearchFilters;
  trackingFilters: TrackingFilters;
  searchSuggestions: string[];
  
  // Categories & Locations
  categories: ServiceCategory[];
  districts: District[];
  
  // Applications
  userApplications: UserApplication[];
  currentApplication: NICApplicationData | null;
  applicationStatus: Record<string, ApplicationStatus>;
  
  // Notifications
  notifications: Notification[];
  unreadNotificationCount: number;
  notificationPreferences: NotificationPreferences;
  
  // Statistics
  serviceStats: ServiceStats | null;
  
  // Loading States
  isLoading: boolean;
  isSearching: boolean;
  isLoadingService: boolean;
  isLoadingRequirements: boolean;
  isLoadingFees: boolean;
  isLoadingApplications: boolean;
  isSubmittingApplication: boolean;
  isLoadingNotifications: boolean;
  isLoadingStats: boolean;
  
  // Error States
  error: string | null;
  searchError: string | null;
  serviceError: string | null;
  applicationError: string | null;
  notificationError: string | null;
  
  // Success States
  searchSuccess: boolean;
  applicationSubmitSuccess: boolean;
  
  // Cache Management
  lastFetchTime: string | null;
  cacheExpiry: number;
  
  // UI State
  selectedDistrict: string | null;
  selectedCategory: string | null;
  activeTab: 'services' | 'applications' | 'notifications';
}

// --- Enhanced Async Thunks ---

export const fetchAllServices = createAsyncThunk<
  { services: Service[]; featured?: Service[]; popular?: Service[] },
  { page?: number; limit?: number; filters?: Partial<SearchFilters> },
  { rejectValue: string }
>('services/fetchAll', async ({ page = 1, limit = 20, filters }, { rejectWithValue }) => {
  try {
    const response = await servicesApi.getAllServices(page, limit, filters);
    if (response.success) {
      await AsyncStorage.setItem('servicesData', JSON.stringify(response.data));
      await AsyncStorage.setItem('servicesLastFetch', new Date().toISOString());
      return { services: response.data };
    }
    return rejectWithValue(response.message || 'Failed to fetch services');
  } catch (error: any) {
    try {
      const cachedData = await AsyncStorage.getItem('servicesData');
      const lastFetch = await AsyncStorage.getItem('servicesLastFetch');
      if (cachedData && lastFetch) {
        const cacheAge = Date.now() - new Date(lastFetch).getTime();
        if (cacheAge < 3600000) { // 1 hour cache
          return JSON.parse(cachedData);
        }
      }
    } catch {}
    return rejectWithValue(error.message || 'Network error');
  }
});

export const fetchServiceById = createAsyncThunk<Service, string, { rejectValue: string }>(
  'services/fetchById',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getServiceById(serviceId);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Service not found');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch service details');
    }
  }
);

export const fetchPopularServices = createAsyncThunk<Service[], number, { rejectValue: string }>(
  'services/fetchPopular',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getPopularServices(limit);
      if (response.success) return response.data;
      return rejectWithValue(response.message || 'Failed to fetch popular services');
    } catch (error: any) {
      try {
        const cachedData = await AsyncStorage.getItem('popularServices');
        if (cachedData) return JSON.parse(cachedData);
      } catch {}
      return rejectWithValue(error?.message || 'Failed to fetch popular services');
    }
  }
);

export const fetchServicesByDistrict = createAsyncThunk<
  { districtId: string; services: Service[] },
  { districtId: string; useCache?: boolean },
  { rejectValue: string }
>('services/fetchByDistrict', async ({ districtId, useCache = true }, { rejectWithValue }) => {
  try {
    const response = await servicesApi.getServicesByDistrict(districtId, useCache);
    if (response.success) return { districtId, services: response.data ?? [] };
    return rejectWithValue(response.message || 'No services found for this district');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch district services');
  }
});

export const searchServices = createAsyncThunk<
  SearchResult,
  { query: string; filters?: Partial<SearchFilters> },
  { rejectValue: string }
>('services/search', async ({ query, filters = {} }, { rejectWithValue }) => {
  try {
    const completeFilters: SearchFilters = {
      district: filters.district ?? null,
      category: filters.category ?? null,
      type: filters.type ?? null,
      fee: filters.fee ?? null,
      rating: filters.rating ?? null,
      popularity: filters.popularity ?? null,
    };
    const response = await servicesApi.searchServices(query, completeFilters);
    if (response.success) {
      return { 
        query, 
        results: response.data ?? [], 
        totalResults: response.total ?? (response.data ? response.data.length : 0),
        filters: completeFilters
      };
    }
    return rejectWithValue(response.message || 'No services found');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Search failed');
  }
});

export const fetchServiceRequirements = createAsyncThunk<
  { serviceId: string; requirements: ServiceRequirement[] },
  string,
  { rejectValue: string }
>('services/fetchRequirements', async (serviceId, { rejectWithValue }) => {
  try {
    const response = await servicesApi.getServiceRequirements(serviceId);
    if (response.success) return { serviceId, requirements: response.data ?? [] };
    return rejectWithValue(response.message || 'Requirements not found');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch requirements');
  }
});

export const fetchServiceFees = createAsyncThunk<
  { serviceId: string; fees: ServiceFee[] },
  string,
  { rejectValue: string }
>('services/fetchFees', async (serviceId, { rejectWithValue }) => {
  try {
    const response = await servicesApi.getServiceFees(serviceId);
    if (response.success) return { serviceId, fees: response.data ?? [] };
    return rejectWithValue(response.message || 'Fee information not found');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch fee information');
  }
});

export const fetchDistricts = createAsyncThunk<District[], void, { rejectValue: string }>(
  'services/fetchDistricts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getDistricts();
      if (response.success) {
        await AsyncStorage.setItem('districtsData', JSON.stringify(response.data));
        return response.data as District[];
      }
      return rejectWithValue(response.message || 'Failed to fetch districts');
    } catch (error: any) {
      try {
        const cachedData = await AsyncStorage.getItem('districtsData');
        if (cachedData) return JSON.parse(cachedData);
      } catch {}
      return rejectWithValue(error.message || 'Failed to fetch districts');
    }
  }
);

export const fetchServiceCenters = createAsyncThunk<
  ServiceCenter[],
  { districtId?: string; serviceId?: string },
  { rejectValue: string }
>('services/fetchServiceCenters', async (params, { rejectWithValue }) => {
  try {
    const response = await servicesApi.getServiceCenters(params.districtId, params.serviceId);
    if (response.success) return response.data ?? [];
    return rejectWithValue(response.message || 'Failed to fetch service centers');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch service centers');
  }
});

// Application Management Thunks
export const submitNICApplication = createAsyncThunk<
  NICApplicationResponse,
  NICApplicationData,
  { rejectValue: string }
>('services/submitNICApplication', async (applicationData, { rejectWithValue }) => {
  try {
    const response = await servicesApi.submitNICApplication(applicationData);
    if (response.success && response.data) {
      // Store application data locally for offline access
      await AsyncStorage.setItem(`application_${response.data.referenceNumber}`, JSON.stringify({
        ...applicationData,
        ...response.data,
        submittedAt: new Date().toISOString()
      }));
      return response.data;
    }
    return rejectWithValue(response.message || 'Application submission failed');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Application submission failed');
  }
});

export const fetchUserApplications = createAsyncThunk<
  UserApplication[],
  { status?: string; limit?: number; offset?: number },
  { rejectValue: string }
>('services/fetchUserApplications', async (filters = {}, { rejectWithValue }) => {
  try {
    const response = await servicesApi.getUserApplications(filters);
    if (response.success) {
      await AsyncStorage.setItem('userApplications', JSON.stringify(response.data));
      return (response.data ?? []).map((app: any) => ({
        referenceNumber: app.referenceNumber,
        serviceId: app.serviceId || 'unknown',
        serviceName: app.serviceName || 'Unknown Service',
        status: app.status,
        submittedAt: app.submittedAt,
        lastUpdated: app.lastUpdated,
        estimatedCompletionDate: app.estimatedCompletionDate,
        currentStage: app.currentStage,
        progress: app.progress || 0,
        canCancel: app.canCancel !== false,
        canUpdate: app.canUpdate !== false,
        requiresAction: app.requiresAction || false,
      }));
    }
    return rejectWithValue(response.message || 'Failed to fetch applications');
  } catch (error: any) {
    try {
      const cachedData = await AsyncStorage.getItem('userApplications');
      if (cachedData) return JSON.parse(cachedData);
    } catch {}
    return rejectWithValue(error.message || 'Failed to fetch applications');
  }
});

export const trackApplication = createAsyncThunk<
  ApplicationStatus,
  string,
  { rejectValue: string }
>('services/trackApplication', async (referenceNumber, { rejectWithValue }) => {
  try {
    const response = await servicesApi.getApplicationStatus(referenceNumber);
    if (response.success && response.data) {
      return response.data;
    } else {
      return rejectWithValue(response.message || 'Application not found');
    }
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to track application');
  }
});

export const cancelApplication = createAsyncThunk<
  { referenceNumber: string },
  { referenceNumber: string; reason: string },
  { rejectValue: string }
>('services/cancelApplication', async ({ referenceNumber, reason }, { rejectWithValue }) => {
  try {
    const response = await servicesApi.cancelApplication(referenceNumber, reason);
    if (response.success) return { referenceNumber };
    return rejectWithValue(response.message || 'Failed to cancel application');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to cancel application');
  }
});

// Notification Thunks
export const fetchNotifications = createAsyncThunk<
  { notifications: Notification[]; total: number },
  { limit?: number; offset?: number },
  { rejectValue: string }
>('services/fetchNotifications', async ({ limit = 20, offset = 0 }, { rejectWithValue }) => {
  try {
    const response = await servicesApi.getUserNotifications(limit, offset);
    if (response.success) {
      return { notifications: response.data ?? [], total: response.total ?? (response.data ? response.data.length : 0) };
    }
    return rejectWithValue(response.message || 'Failed to fetch notifications');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch notifications');
  }
});

export const markNotificationAsRead = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('services/markNotificationAsRead', async (notificationId, { rejectWithValue }) => {
  try {
    const response = await servicesApi.markNotificationAsRead(notificationId);
    if (response.success) return notificationId;
    return rejectWithValue(response.message || 'Failed to mark notification as read');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to mark notification as read');
  }
});

// Statistics Thunk
export const fetchServiceStats = createAsyncThunk<
  ServiceStats,
  void,
  { rejectValue: string }
>('services/fetchServiceStats', async (_, { rejectWithValue }) => {
  try {
    const response = await servicesApi.getServiceStats();
    if (response.success && response.data) {
      return response.data;
    }
    return rejectWithValue(response.message || 'Failed to fetch service statistics');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch service statistics');
  }
});

// --- Initial State ---
const initialState: ServicesState = {
  // Services Data
  services: [],
  featuredServices: [],
  popularServices: [],
  recentlyUsed: [],
  currentService: null,
  serviceRequirements: {},
  serviceFees: {},
  serviceCenters: [],
  
  // Search & Filters
  searchResults: [],
  searchQuery: '',
  searchFilters: { district: null, category: null, type: null, fee: null, rating: null, popularity: null },
  trackingFilters: {
    status: 'all',
    dateRange: { 
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), 
      end: new Date().toISOString() 
    },
    serviceType: null,
    sortBy: 'date',
    sortOrder: 'desc',
  },
  searchSuggestions: [],
  
  // Categories & Locations
  categories: [
    { id: 'registry', name: 'Registry Services', icon: 'file-text', color: '#3B82F6', serviceCount: 0 },
    { id: 'certificates', name: 'Certificates', icon: 'award', color: '#10B981', serviceCount: 0 },
    { id: 'permits', name: 'Permits & Licenses', icon: 'clipboard-check', color: '#F59E0B', serviceCount: 0 },
    { id: 'welfare', name: 'Welfare Services', icon: 'heart', color: '#EF4444', serviceCount: 0 },
    { id: 'land', name: 'Land Services', icon: 'map', color: '#8B5CF6', serviceCount: 0 },
    { id: 'other', name: 'Other Services', icon: 'more-horizontal', color: '#6B7280', serviceCount: 0 },
  ],
  districts: [],
  
  // Applications
  userApplications: [],
  currentApplication: null,
  applicationStatus: {},
  
  // Notifications
  notifications: [],
  unreadNotificationCount: 0,
  notificationPreferences: {
    smsNotifications: true,
    emailNotifications: true,
    pushNotifications: true,
    statusUpdates: true,
    reminderAlerts: true,
  },
  
  // Statistics
  serviceStats: null,
  
  // Loading States
  isLoading: false,
  isSearching: false,
  isLoadingService: false,
  isLoadingRequirements: false,
  isLoadingFees: false,
  isLoadingApplications: false,
  isSubmittingApplication: false,
  isLoadingNotifications: false,
  isLoadingStats: false,
  
  // Error States
  error: null,
  searchError: null,
  serviceError: null,
  applicationError: null,
  notificationError: null,
  
  // Success States
  searchSuccess: false,
  applicationSubmitSuccess: false,
  
  // Cache Management
  lastFetchTime: null,
  cacheExpiry: 3600000, // 1 hour
  
  // UI State
  selectedDistrict: null,
  selectedCategory: null,
  activeTab: 'services',
};

// --- Enhanced Slice ---
const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    // Error Management
    clearServicesErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.serviceError = null;
      state.applicationError = null;
      state.notificationError = null;
    },
    clearSpecificError: (state, action: PayloadAction<keyof ServicesState>) => {
      const errorField = action.payload;
      if (errorField in state && typeof state[errorField] === 'string') {
        (state as any)[errorField] = null;
      }
    },
    
    // Search Management
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
      state.searchError = null;
      state.searchSuccess = false;
      state.searchSuggestions = [];
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    setTrackingFilters: (state, action: PayloadAction<Partial<TrackingFilters>>) => {
      state.trackingFilters = { ...state.trackingFilters, ...action.payload };
    },
    resetSearchFilters: (state) => {
      state.searchFilters = { district: null, category: null, type: null, fee: null, rating: null, popularity: null };
    },
    addSearchSuggestion: (state, action: PayloadAction<string>) => {
      const suggestion = action.payload;
      if (!state.searchSuggestions.includes(suggestion)) {
        state.searchSuggestions = [suggestion, ...state.searchSuggestions].slice(0, 10);
      }
    },
    
    // Service Management
    setCurrentService: (state, action: PayloadAction<Service | null>) => {
      state.currentService = action.payload;
    },
    clearCurrentService: (state) => {
      state.currentService = null;
    },
    updateService: (state, action: PayloadAction<{ id: string; updates: Partial<Service> }>) => {
      const index = state.services.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = { ...state.services[index], ...action.payload.updates };
      }
    },
    setFeaturedServices: (state, action: PayloadAction<Service[]>) => {
      state.featuredServices = action.payload;
    },
    setPopularServices: (state, action: PayloadAction<Service[]>) => {
      state.popularServices = action.payload;
    },
    
    // Recently Used Management
    addToRecentlyUsed: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.recentlyUsed = [id, ...state.recentlyUsed.filter(x => x !== id)].slice(0, 10);
    },
    clearRecentlyUsed: (state) => {
      state.recentlyUsed = [];
    },
    
    // Application Management
    setCurrentApplication: (state, action: PayloadAction<NICApplicationData | null>) => {
      state.currentApplication = action.payload;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
    updateApplicationStatus: (state, action: PayloadAction<{ referenceNumber: string; status: ApplicationStatus }>) => {
      state.applicationStatus[action.payload.referenceNumber] = action.payload.status;
      
      // Update user applications list
      const appIndex = state.userApplications.findIndex(app => app.referenceNumber === action.payload.referenceNumber);
      if (appIndex !== -1) {
        state.userApplications[appIndex].status = action.payload.status.status;
        state.userApplications[appIndex].lastUpdated = action.payload.status.lastUpdated;
        state.userApplications[appIndex].currentStage = action.payload.status.currentStage;
      }
    },
    
    // Notification Management
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications = [action.payload, ...state.notifications];
      if (!action.payload.read) {
        state.unreadNotificationCount += 1;
      }
    },
    updateNotificationPreferences: (state, action: PayloadAction<Partial<NotificationPreferences>>) => {
      state.notificationPreferences = { ...state.notificationPreferences, ...action.payload };
    },
    
    // UI State Management
    setSelectedDistrict: (state, action: PayloadAction<string | null>) => {
      state.selectedDistrict = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'services' | 'applications' | 'notifications'>) => {
      state.activeTab = action.payload;
    },
    
    // Cache Management
    invalidateCache: (state) => {
      state.lastFetchTime = null;
    },
    updateCacheExpiry: (state, action: PayloadAction<number>) => {
      state.cacheExpiry = action.payload;
    },
    
    // Reset Functions
    resetServicesState: (state) => ({
      ...initialState,
      districts: state.districts,
      categories: state.categories,
      recentlyUsed: state.recentlyUsed,
      notificationPreferences: state.notificationPreferences,
    }),
    resetSearchState: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
      state.searchError = null;
      state.searchSuccess = false;
      state.searchSuggestions = [];
      state.isSearching = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllServices
      .addCase(fetchAllServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload.services || [];
        state.featuredServices = action.payload.featured || [];
        state.popularServices = action.payload.popular || [];
        state.error = null;
        state.lastFetchTime = new Date().toISOString();
        
        // Update category counts
        state.categories = state.categories.map(category => ({
          ...category,
          serviceCount: state.services.filter(service => service.category === category.id).length
        }));
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch services';
      })
      
      // fetchServiceById
      .addCase(fetchServiceById.pending, (state) => {
        state.isLoadingService = true;
        state.serviceError = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.isLoadingService = false;
        state.currentService = action.payload;
        state.serviceError = null;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.isLoadingService = false;
        state.serviceError = action.payload || 'Failed to fetch service';
      })
      
      // fetchPopularServices
      .addCase(fetchPopularServices.fulfilled, (state, action) => {
        state.popularServices = action.payload;
      })
      
      // fetchServicesByDistrict
      .addCase(fetchServicesByDistrict.fulfilled, (state, action) => {
        const { services } = action.payload;
        // Update services with district-specific data
        state.services = state.services.map(s => 
          services.find(ds => ds.id === s.id) || s
        );
      })
      
      // searchServices
      .addCase(searchServices.pending, (state) => {
        state.isSearching = true;
        state.searchError = null;
        state.searchSuccess = false;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.results;
        state.searchQuery = action.payload.query;
        state.searchSuccess = true;
        state.searchError = null;
        
        // Add to search suggestions if not already present
        if (action.payload.query && !state.searchSuggestions.includes(action.payload.query)) {
          state.searchSuggestions = [action.payload.query, ...state.searchSuggestions].slice(0, 10);
        }
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload || 'Search failed';
        state.searchSuccess = false;
        state.searchResults = [];
      })
      
      // fetchServiceRequirements
      .addCase(fetchServiceRequirements.pending, (state) => {
        state.isLoadingRequirements = true;
      })
      .addCase(fetchServiceRequirements.fulfilled, (state, action) => {
        state.isLoadingRequirements = false;
        state.serviceRequirements[action.payload.serviceId] = action.payload.requirements;
      })
      .addCase(fetchServiceRequirements.rejected, (state) => {
        state.isLoadingRequirements = false;
      })
      
      // fetchServiceFees
      .addCase(fetchServiceFees.pending, (state) => {
        state.isLoadingFees = true;
      })
      .addCase(fetchServiceFees.fulfilled, (state, action) => {
        state.isLoadingFees = false;
        state.serviceFees[action.payload.serviceId] = action.payload.fees;
      })
      .addCase(fetchServiceFees.rejected, (state) => {
        state.isLoadingFees = false;
      })
      
      // fetchDistricts
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.districts = action.payload;
      })
      
      // fetchServiceCenters
      .addCase(fetchServiceCenters.fulfilled, (state, action) => {
        state.serviceCenters = action.payload;
      })
      
      // submitNICApplication
      .addCase(submitNICApplication.pending, (state) => {
        state.isSubmittingApplication = true;
        state.applicationError = null;
        state.applicationSubmitSuccess = false;
      })
      .addCase(submitNICApplication.fulfilled, (state, action) => {
        state.isSubmittingApplication = false;
        state.applicationSubmitSuccess = true;
        state.applicationError = null;
        
        // Add to user applications
        const newApplication: UserApplication = {
          referenceNumber: action.payload.referenceNumber,
          serviceId: 'nic-reissue',
          serviceName: 'NIC Re-Issue',
          status: action.payload.status as ApplicationStatus['status'],
          submittedAt: action.payload.submittedAt,
          lastUpdated: action.payload.submittedAt,
          estimatedCompletionDate: action.payload.estimatedCompletionDate,
          currentStage: 'Application Received',
          progress: 10,
          canCancel: true,
          canUpdate: false,
          requiresAction: false,
        };
        
        state.userApplications = [newApplication, ...state.userApplications];
        
        // Clear current application
        state.currentApplication = null;
      })
      .addCase(submitNICApplication.rejected, (state, action) => {
        state.isSubmittingApplication = false;
        state.applicationError = action.payload || 'Application submission failed';
        state.applicationSubmitSuccess = false;
      })
      
      // fetchUserApplications
      .addCase(fetchUserApplications.pending, (state) => {
        state.isLoadingApplications = true;
        state.applicationError = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.isLoadingApplications = false;
        state.userApplications = action.payload;
        state.applicationError = null;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.isLoadingApplications = false;
        state.applicationError = action.payload || 'Failed to fetch applications';
      })
      
      // trackApplication
      .addCase(trackApplication.fulfilled, (state, action) => {
        const status = action.payload;
        state.applicationStatus[status.referenceNumber] = status;
        
        // Update user applications
        const appIndex = state.userApplications.findIndex(
          app => app.referenceNumber === status.referenceNumber
        );
        if (appIndex !== -1) {
          state.userApplications[appIndex] = {
            ...state.userApplications[appIndex],
            status: status.status,
            lastUpdated: status.lastUpdated,
            currentStage: status.currentStage,
            progress: calculateProgress(status.stages),
            requiresAction: checkRequiresAction(status),
          };
        }
      })
      
      // cancelApplication
      .addCase(cancelApplication.fulfilled, (state, action) => {
        const { referenceNumber } = action.payload;
        
        // Update application status
        const appIndex = state.userApplications.findIndex(
          app => app.referenceNumber === referenceNumber
        );
        if (appIndex !== -1) {
          state.userApplications[appIndex] = {
            ...state.userApplications[appIndex],
            status: 'cancelled',
            canCancel: false,
            canUpdate: false,
            requiresAction: false,
          };
        }
        
        // Update application status record
        if (state.applicationStatus[referenceNumber]) {
          state.applicationStatus[referenceNumber] = {
            ...state.applicationStatus[referenceNumber],
            status: 'cancelled',
            lastUpdated: new Date().toISOString(),
          };
        }
      })
      
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoadingNotifications = true;
        state.notificationError = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoadingNotifications = false;
        state.notifications = action.payload.notifications;
        state.unreadNotificationCount = action.payload.notifications.filter(n => !n.read).length;
        state.notificationError = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoadingNotifications = false;
        state.notificationError = action.payload || 'Failed to fetch notifications';
      })
      
      // markNotificationAsRead
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadNotificationCount = Math.max(0, state.unreadNotificationCount - 1);
        }
      })
      
      // fetchServiceStats
      .addCase(fetchServiceStats.pending, (state) => {
        state.isLoadingStats = true;
      })
      .addCase(fetchServiceStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.serviceStats = action.payload;
      })
      .addCase(fetchServiceStats.rejected, (state) => {
        state.isLoadingStats = false;
      });
  },
});

// --- Helper Functions ---
const calculateProgress = (stages: ApplicationStatus['stages']): number => {
  if (!stages || stages.length === 0) return 0;
  
  const completedStages = stages.filter((stage: { status: string; }) => stage.status === 'completed').length;
  return Math.round((completedStages / stages.length) * 100);
};

const checkRequiresAction = (status: ApplicationStatus): boolean => {
  // Check if any stage is failed or requires user action
  return status.stages?.some((stage: { status: string; name: string; }) => 
    stage.status === 'failed' || 
    stage.name.toLowerCase().includes('document') && stage.status === 'pending'
  ) || false;
};

// --- Selectors ---
export const selectServices = (state: { services: ServicesState }) => state.services.services;
export const selectFeaturedServices = (state: { services: ServicesState }) => state.services.featuredServices;
export const selectPopularServices = (state: { services: ServicesState }) => state.services.popularServices;
export const selectCurrentService = (state: { services: ServicesState }) => state.services.currentService;
export const selectSearchResults = (state: { services: ServicesState }) => state.services.searchResults;
export const selectUserApplications = (state: { services: ServicesState }) => state.services.userApplications;
export const selectNotifications = (state: { services: ServicesState }) => state.services.notifications;
export const selectUnreadNotificationCount = (state: { services: ServicesState }) => state.services.unreadNotificationCount;
export const selectServiceStats = (state: { services: ServicesState }) => state.services.serviceStats;

export const selectServicesByCategory = (state: { services: ServicesState }, category: string) =>
  state.services.services.filter(service => service.category === category);

export const selectRecentlyUsedServices = (state: { services: ServicesState }) =>
  state.services.recentlyUsed
    .map(id => state.services.services.find(service => service.id === id))
    .filter(Boolean) as Service[];

export const selectApplicationsByStatus = (state: { services: ServicesState }, status: string) =>
  status === 'all' 
    ? state.services.userApplications
    : state.services.userApplications.filter(app => app.status === status);

export const selectServiceRequirements = (state: { services: ServicesState }, serviceId: string) =>
  state.services.serviceRequirements[serviceId] || [];

export const selectServiceFees = (state: { services: ServicesState }, serviceId: string) =>
  state.services.serviceFees[serviceId] || [];

export const selectIsLoading = (state: { services: ServicesState }) => ({
  services: state.services.isLoading,
  service: state.services.isLoadingService,
  requirements: state.services.isLoadingRequirements,
  fees: state.services.isLoadingFees,
  applications: state.services.isLoadingApplications,
  submitting: state.services.isSubmittingApplication,
  notifications: state.services.isLoadingNotifications,
  stats: state.services.isLoadingStats,
  searching: state.services.isSearching,
});

export const selectErrors = (state: { services: ServicesState }) => ({
  general: state.services.error,
  search: state.services.searchError,
  service: state.services.serviceError,
  application: state.services.applicationError,
  notification: state.services.notificationError,
});

// --- Export Actions ---
export const {
  // Error Management
  clearServicesErrors,
  clearSpecificError,
  
  // Search Management
  clearSearch,
  setSearchQuery,
  setSearchFilters,
  setTrackingFilters,
  resetSearchFilters,
  addSearchSuggestion,
  
  // Service Management
  setCurrentService,
  clearCurrentService,
  updateService,
  setFeaturedServices,
  setPopularServices,
  
  // Recently Used Management
  addToRecentlyUsed,
  clearRecentlyUsed,
  
  // Application Management
  setCurrentApplication,
  clearCurrentApplication,
  updateApplicationStatus,
  
  // Notification Management
  addNotification,
  updateNotificationPreferences,
  
  // UI State Management
  setSelectedDistrict,
  setSelectedCategory,
  setActiveTab,
  
  // Cache Management
  invalidateCache,
  updateCacheExpiry,
  
  // Reset Functions
  resetServicesState,
  resetSearchState,
} = servicesSlice.actions;

export default servicesSlice.reducer;