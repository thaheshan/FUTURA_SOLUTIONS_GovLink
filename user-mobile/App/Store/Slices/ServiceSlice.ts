// src/store/slices/servicesSlice.ts - Available Services
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { servicesApi } from '../../Services/API/ServiceAPI';

// Types
export interface Service {
  id: string;
  name: string;
  nameTranslations: {
    si: string;
    ta: string;
  };
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
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface District {
  id: number;
  name: string;
  province: string;
}

export interface ServiceRequirement {
  id: string;
  name: string;
  description: string;
  isOptional: boolean;
  documentTypes: string[];
}

export interface ServiceFee {
  type: 'regular' | 'urgent' | 'express';
  amount: number;
  currency: string;
  description: string;
  processingTime: string;
}

export interface SearchFilters {
  district: string | null;
  category: string | null;
  type: string | null;
  fee: string | null;
}

export interface SearchResult {
  results: Service[];
  query: string;
  totalResults: number;
}

export interface ServicesState {
  // Services data
  services: Service[];
  featuredServices: Service[];
  popularServices: Service[];
  recentlyUsed: string[];
  
  // Current service details
  currentService: Service | null;
  serviceRequirements: Record<string, ServiceRequirement[]>;
  serviceFees: Record<string, ServiceFee[]>;
  
  // Search
  searchResults: Service[];
  searchQuery: string;
  searchFilters: SearchFilters;
  
  // Categories
  categories: ServiceCategory[];
  
  // Districts (Sri Lankan districts)
  districts: District[];
  
  // Available services (11 GS/DS services)
  availableServices: Service[];
  
  // Loading states
  isLoading: boolean;
  isSearching: boolean;
  isLoadingService: boolean;
  isLoadingRequirements: boolean;
  isLoadingFees: boolean;
  
  // Error states
  error: string | null;
  searchError: string | null;
  serviceError: string | null;
  
  // Success states
  searchSuccess: boolean;
  
  // Cache info
  lastFetchTime: string | null;
  cacheExpiry: number; // milliseconds
}

// Async thunks for services operations
export const fetchAllServices = createAsyncThunk<
  { services: Service[]; featured?: Service[]; popular?: Service[] },
  void,
  { rejectValue: string }
>(
  'services/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getAllServices();
      
      if (response.success) {
        // Cache services data for offline access
        await AsyncStorage.setItem('servicesData', JSON.stringify(response.data));
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch services');
      }
    } catch (error: any) {
      // Try to load from cache if network fails
      try {
        const cachedData = await AsyncStorage.getItem('servicesData');
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      } catch (cacheError) {
        console.log('No cached services data available');
      }
      
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchServiceById = createAsyncThunk<
  Service,
  string,
  { rejectValue: string }
>(
  'services/fetchById',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getServiceById(serviceId);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Service not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch service details');
    }
  }
);

export const fetchServicesByDistrict = createAsyncThunk<
  { districtId: string; services: Service[] },
  string,
  { rejectValue: string }
>(
  'services/fetchByDistrict',
  async (districtId, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getServicesByDistrict(districtId);
      
      if (response.success) {
        return {
          districtId,
          services: response.data,
        };
      } else {
        return rejectWithValue(response.message || 'No services found for this district');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch district services');
    }
  }
);

export const searchServices = createAsyncThunk<
  SearchResult,
  { query: string; filters?: Partial<SearchFilters> },
  { rejectValue: string }
>(
  'services/search',
  async ({ query, filters = {} }, { rejectWithValue }) => {
    try {
      const completeFilters: SearchFilters = {
        district: filters.district ?? null,
        category: filters.category ?? null,
        type: filters.type ?? null,
        fee: filters.fee ?? null,
      };
      const response = await servicesApi.searchServices(query, completeFilters);
      
      if (response.success) {
        return {
          query,
          results: response.data,
          totalResults: response.total || response.data.length,
        };
      } else {
        return rejectWithValue(response.message || 'No services found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

export const fetchServiceRequirements = createAsyncThunk<
  { serviceId: string; requirements: ServiceRequirement[] },
  string,
  { rejectValue: string }
>(
  'services/fetchRequirements',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getServiceRequirements(serviceId);
      
      if (response.success) {
        return {
          serviceId,
          requirements: response.data,
        };
      } else {
        return rejectWithValue(response.message || 'Requirements not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch requirements');
    }
  }
);

export const fetchServiceFees = createAsyncThunk<
  { serviceId: string; fees: ServiceFee[] },
  string,
  { rejectValue: string }
>(
  'services/fetchFees',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getServiceFees(serviceId);
      
      if (response.success) {
        return {
          serviceId,
          fees: response.data,
        };
      } else {
        return rejectWithValue(response.message || 'Fee information not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch fee information');
    }
  }
);

// Initial state
const initialState: ServicesState = {
  // Services data
  services: [],
  featuredServices: [],
  popularServices: [],
  recentlyUsed: [],
  
  // Current service details
  currentService: null,
  serviceRequirements: {},
  serviceFees: {},
  
  // Search
  searchResults: [],
  searchQuery: '',
  searchFilters: {
    district: null,
    category: null,
    type: null,
    fee: null,
  },
  
  // Categories
  categories: [
    { id: 'registry', name: 'Registry Services', icon: 'file-text', color: '#3B82F6' },
    { id: 'certificates', name: 'Certificates', icon: 'award', color: '#10B981' },
    { id: 'permits', name: 'Permits & Licenses', icon: 'clipboard-check', color: '#F59E0B' },
    { id: 'welfare', name: 'Welfare Services', icon: 'heart', color: '#EF4444' },
    { id: 'land', name: 'Land Services', icon: 'map', color: '#8B5CF6' },
    { id: 'other', name: 'Other Services', icon: 'more-horizontal', color: '#6B7280' },
  ],
  
  // Districts (Sri Lankan districts)
  districts: [
    { id: 1, name: 'Colombo', province: 'Western' },
    { id: 2, name: 'Gampaha', province: 'Western' },
    { id: 3, name: 'Kalutara', province: 'Western' },
    { id: 4, name: 'Kandy', province: 'Central' },
    { id: 5, name: 'Matale', province: 'Central' },
    { id: 6, name: 'Nuwara Eliya', province: 'Central' },
    { id: 7, name: 'Galle', province: 'Southern' },
    { id: 8, name: 'Matara', province: 'Southern' },
    { id: 9, name: 'Hambantota', province: 'Southern' },
    { id: 10, name: 'Jaffna', province: 'Northern' },
    { id: 11, name: 'Kilinochchi', province: 'Northern' },
    { id: 12, name: 'Mannar', province: 'Northern' },
    { id: 13, name: 'Mullaitivu', province: 'Northern' },
    { id: 14, name: 'Vavuniya', province: 'Northern' },
    { id: 15, name: 'Batticaloa', province: 'Eastern' },
    { id: 16, name: 'Ampara', province: 'Eastern' },
    { id: 17, name: 'Trincomalee', province: 'Eastern' },
    { id: 18, name: 'Kurunegala', province: 'North Western' },
    { id: 19, name: 'Puttalam', province: 'North Western' },
    { id: 20, name: 'Anuradhapura', province: 'North Central' },
    { id: 21, name: 'Polonnaruwa', province: 'North Central' },
    { id: 22, name: 'Badulla', province: 'Uva' },
    { id: 23, name: 'Monaragala', province: 'Uva' },
    { id: 24, name: 'Ratnapura', province: 'Sabaragamuwa' },
    { id: 25, name: 'Kegalle', province: 'Sabaragamuwa' },
  ],
  
  // Available services (11 GS/DS services)
  availableServices: [
    {
      id: 'nic_reissue',
      name: 'NIC Reissue',
      nameTranslations: {
        si: 'හැදුනුම්පත් නැවත නිකුත් කිරීම',
        ta: 'அடையாள அட்டை மறுவழங்கல்',
      },
      category: 'registry',
      isActive: true,
      description: 'Apply for National Identity Card reissue',
      estimatedTime: '7-14 days',
      fee: 'Rs. 100',
      icon: 'id-card',
      color: '#3B82F6',
      requirements: ['Current NIC (if available)', 'Birth Certificate', 'Recent passport-size photograph'],
      isOnline: true,
    },
    {
      id: 'birth_certificate',
      name: 'Birth Certificate',
      nameTranslations: {
        si: 'උප්පැන්න සහතිකය',
        ta: 'பிறப்பு சான்றிதழ்',
      },
      category: 'certificates',
      isActive: false,
      description: 'Obtain certified copy of birth certificate',
      estimatedTime: '3-7 days',
      fee: 'Rs. 50',
      icon: 'baby',
      color: '#10B981',
      isOnline: false,
      comingSoon: true,
    },
    {
      id: 'marriage_certificate',
      name: 'Marriage Certificate',
      nameTranslations: {
        si: 'විවාහ සහතිකය',
        ta: 'திருமண சான்றிதழ்',
      },
      category: 'certificates',
      isActive: false,
      description: 'Obtain certified copy of marriage certificate',
      estimatedTime: '3-7 days',
      fee: 'Rs. 50',
      icon: 'heart',
      color: '#EF4444',
      isOnline: false,
      comingSoon: true,
    },
    {
      id: 'death_certificate',
      name: 'Death Certificate',
      nameTranslations: {
        si: 'මරණ සහතිකය',
        ta: 'இறப்பு சான்றிதழ்',
      },
      category: 'certificates',
      isActive: false,
      description: 'Obtain certified copy of death certificate',
      estimatedTime: '3-7 days',
      fee: 'Rs. 50',
      icon: 'cross',
      color: '#6B7280',
      isOnline: false,
      comingSoon: true,
    },
    {
      id: 'income_certificate',
      name: 'Income Certificate',
      nameTranslations: {
        si: 'ආදායම් සහතිකය',
        ta: 'வருமான சான்றிதழ்',
      },
      category: 'certificates',
      isActive: false,
      description: 'Certificate for income verification',
      estimatedTime: '5-10 days',
      fee: 'Rs. 25',
      icon: 'dollar-sign',
      color: '#F59E0B',
      isOnline: false,
      comingSoon: true,
    },
    {
      id: 'residence_certificate',
      name: 'Residence Certificate',
      nameTranslations: {
        si: 'පදිංචි සහතිකය',
        ta: 'குடியிருப்பு சான்றிதழ்',
      },
      category: 'certificates',
      isActive: false,
      description: 'Certificate of permanent residence',
      estimatedTime: '5-10 days',
      fee: 'Rs. 25',
      icon: 'home',
      color: '#8B5CF6',
      isOnline: false,
      comingSoon: true,
    },
    {
      id: 'character_certificate',
      name: 'Character Certificate',
      nameTranslations: {
        si: 'චරිත සහතිකය',
        ta: 'நல்லொழுக்க சான்றிதழ்',
      },
      category: 'certificates',
      isActive: false,
      description: 'Police clearance/character certificate',
      estimatedTime: '14-21 days',
      fee: 'Rs. 500',
      icon: 'shield-check',
      color: '#059669',
      isOnline: false,
      comingSoon: true,
    },
    {
      id: 'business_registration',
      name: 'Business Registration',
      nameTranslations: {
        si: 'ව්‍යාපාර ලියාපදිංචිය',
        ta: 'வணிக பதிவு',
      },
      category: 'permits',
      isActive: false,
      description: 'Register new business with local authority',
      estimatedTime: '10-15 days',
      fee: 'Rs. 1000',
      icon: 'briefcase',
      color: '#DC2626',
      isOnline: false,
      comingSoon: true,
    },
    {
      id: 'land_certificate',
      name: 'Land Certificate',
      nameTranslations: {
        si: 'ඉඩම් සහතිකය',
        ta: 'நிலச் சான்றிதழ்',
      },
      category: 'land',
      isActive: false,
      description: 'Land ownership verification certificate',
      estimatedTime: '21-30 days',
      fee: 'Rs. 200',
      icon: 'map-pin',
      color: '#7C3AED',
      isOnline: false,
      comingSoon: true,
    },
    {
      id: 'welfare_benefits',
      name: 'Welfare Benefits',
      nameTranslations: {
        si: 'සුභසාධන ප්‍රතිලාභ',
        ta: 'நலன்புரி நன்மைகள்',
      },
      category: 'welfare',
      isActive: false,
      description: 'Apply for government welfare programs',
      estimatedTime: '30-45 days',
      fee: 'Free',
      icon: 'gift',
      color: '#EC4899',
      isOnline: false,
      comingSoon: true,
    },
    {
      id: 'senior_citizen_id',
      name: 'Senior Citizen ID',
      nameTranslations: {
        si: 'ජ්‍යෙෂ්ඨ පුරවැසි හැදුනුම්පත',
        ta: 'மூத்த குடிமக்கள் அடையாள அட்டை',
      },
      category: 'welfare',
      isActive: false,
      description: 'Senior citizen identification card',
      estimatedTime: '14-21 days',
      fee: 'Free',
      icon: 'users',
      color: '#0D9488',
      isOnline: false,
      comingSoon: true,
    },
  ],
  
  // Loading states
  isLoading: false,
  isSearching: false,
  isLoadingService: false,
  isLoadingRequirements: false,
  isLoadingFees: false,
  
  // Error states
  error: null,
  searchError: null,
  serviceError: null,
  
  // Success states
  searchSuccess: false,
  
  // Cache info
  lastFetchTime: null,
  cacheExpiry: 3600000, // 1 hour in milliseconds
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    // Clear error states
    clearServicesErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.serviceError = null;
    },
    
    // Clear search
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
      state.searchError = null;
      state.searchSuccess = false;
    },
    
    // Set search query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    // Set search filters
    setSearchFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    
    // Reset search filters
    resetSearchFilters: (state) => {
      state.searchFilters = {
        district: null,
        category: null,
        type: null,
        fee: null,
      };
    },
    
    // Set current service
    setCurrentService: (state, action: PayloadAction<Service | null>) => {
      state.currentService = action.payload;
    },
    
    // Clear current service
    clearCurrentService: (state) => {
      state.currentService = null;
    },
    
    // Add to recently used
    addToRecentlyUsed: (state, action: PayloadAction<string>) => {
      const serviceId = action.payload;
      const existingIndex = state.recentlyUsed.findIndex(id => id === serviceId);
      
      if (existingIndex !== -1) {
        // Move to front if already exists
        state.recentlyUsed.splice(existingIndex, 1);
      }
      
      state.recentlyUsed.unshift(serviceId);
      
      // Keep only last 5
      if (state.recentlyUsed.length > 5) {
        state.recentlyUsed = state.recentlyUsed.slice(0, 5);
      }
    },
    
    // Update service in list
    updateService: (state, action: PayloadAction<{ id: string; updates: Partial<Service> }>) => {
      const { id, updates } = action.payload;
      const serviceIndex = state.services.findIndex(service => service.id === id);
      
      if (serviceIndex !== -1) {
        state.services[serviceIndex] = { ...state.services[serviceIndex], ...updates };
      }
    },
    
    // Set featured services
    setFeaturedServices: (state, action: PayloadAction<Service[]>) => {
      state.featuredServices = action.payload;
    },
    
    // Set popular services
    setPopularServices: (state, action: PayloadAction<Service[]>) => {
      state.popularServices = action.payload;
    },
    
    // Reset services state
    resetServicesState: (state) => {
      return { ...initialState, districts: state.districts, categories: state.categories };
    },
  },
  extraReducers: (builder) => {
    // Fetch all services
    builder
      .addCase(fetchAllServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload.services || state.availableServices;
        state.featuredServices = action.payload.featured || [];
        state.popularServices = action.payload.popular || [];
        state.error = null;
        state.lastFetchTime = new Date().toISOString();
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch services';
        // Use default services if API fails
        state.services = state.availableServices;
      });

    // Fetch service by ID
    builder
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
      });

    // Fetch services by district
    builder
      .addCase(fetchServicesByDistrict.fulfilled, (state, action) => {
        const { districtId, services } = action.payload;
        // Update services with district-specific info
        state.services = state.services.map(service => {
          const districtService = services.find(ds => ds.id === service.id);
          return districtService ? { ...service, ...districtService } : service;
        });
      });

    // Search services
    builder
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
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload || 'Search failed';
        state.searchSuccess = false;
        state.searchResults = [];
      });

    // Fetch service requirements
    builder
      .addCase(fetchServiceRequirements.pending, (state) => {
        state.isLoadingRequirements = true;
      })
      .addCase(fetchServiceRequirements.fulfilled, (state, action) => {
        state.isLoadingRequirements = false;
        const { serviceId, requirements } = action.payload;
        state.serviceRequirements[serviceId] = requirements;
      })
      .addCase(fetchServiceRequirements.rejected, (state) => {
        state.isLoadingRequirements = false;
      });

    // Fetch service fees
    builder
      .addCase(fetchServiceFees.pending, (state) => {
        state.isLoadingFees = true;
      })
      .addCase(fetchServiceFees.fulfilled, (state, action) => {
        state.isLoadingFees = false;
        const { serviceId, fees } = action.payload;
        state.serviceFees[serviceId] = fees;
      })
      .addCase(fetchServiceFees.rejected, (state) => {
        state.isLoadingFees = false;
      });
  },
});

export const {
  clearServicesErrors,
  clearSearch,
  setSearchQuery,
  setSearchFilters,
  resetSearchFilters,
  setCurrentService,
  clearCurrentService,
  addToRecentlyUsed,
  updateService,
  setFeaturedServices,
  setPopularServices,
  resetServicesState,
} = servicesSlice.actions;

export default servicesSlice.reducer;