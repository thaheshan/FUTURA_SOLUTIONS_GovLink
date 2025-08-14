// src/store/slices/userSlice.ts - User Profile Data
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { profileApi } from '../../Services/API/ProfileAPI';

// Types
export interface UserAddress {
  street: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
}

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string | null;
  gender: 'male' | 'female' | 'other' | '';
  address: UserAddress;
  nic: string;
  profilePhoto: string | null;
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  sms: boolean;
}

export interface UserPreferences {
  language: 'en' | 'si' | 'ta';
  notifications: NotificationPreferences;
  theme: 'light' | 'dark' | 'system';
  biometricAuth: boolean;
  autoLogout: number; // minutes
}

export interface UserStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  upcomingAppointments: number;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface UserState {
  // Profile data
  profile: UserProfile;
  
  // User preferences
  preferences: UserPreferences;
  
  // Application statistics
  stats: UserStats;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  isUploadingPhoto: boolean;
  isChangingPassword: boolean;
  
  // Error states
  error: string | null;
  updateError: string | null;
  uploadError: string | null;
  passwordError: string | null;
  
  // Success states
  updateSuccess: boolean;
  uploadSuccess: boolean;
  passwordChangeSuccess: boolean;
  
  // UI states
  profileCompleted: boolean;
  profileCompletionPercentage: number;
  lastSyncTime: string | null;
}

// Async thunks for user profile operations
export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.getProfile();
      
      if (response.success) {
        // Cache profile data
        await AsyncStorage.setItem('userProfile', JSON.stringify(response.data));
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch profile');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateUserProfile = createAsyncThunk<
  UserProfile,
  Partial<UserProfile>,
  { rejectValue: string }
>(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await profileApi.updateProfile(profileData);
      
      if (response.success) {
        // Update cached profile data
        await AsyncStorage.setItem('userProfile', JSON.stringify(response.data));
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Update failed');
    }
  }
);

export const uploadProfilePhoto = createAsyncThunk<
  { photoUrl: string },
  FormData,
  { rejectValue: string }
>(
  'user/uploadPhoto',
  async (photoData, { rejectWithValue }) => {
    try {
      const response = await profileApi.uploadPhoto(photoData);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Photo upload failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Upload error');
    }
  }
);

export const updatePreferences = createAsyncThunk<
  UserPreferences,
  Partial<UserPreferences>,
  { rejectValue: string }
>(
  'user/updatePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await profileApi.updatePreferences(preferences);
      
      if (response.success) {
        // Store preferences locally
        await AsyncStorage.setItem('userPreferences', JSON.stringify(response.data));
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update preferences');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Preferences update failed');
    }
  }
);

export const changePassword = createAsyncThunk<
  string,
  PasswordChangeData,
  { rejectValue: string }
>(
  'user/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await profileApi.changePassword({
        currentPassword,
        newPassword,
      });
      
      if (response.success) {
        return response.message;
      } else {
        return rejectWithValue(response.message || 'Password change failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password change error');
    }
  }
);

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (profile: UserProfile): number => {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'dateOfBirth',
    'nic',
    'address.street',
    'address.city',
    'address.district',
  ];
  
  let completedFields = 0;
  
  requiredFields.forEach((field) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (profile[parent as keyof UserProfile] && 
          (profile[parent as keyof UserProfile] as any)[child]) {
        completedFields++;
      }
    } else {
      if (profile[field as keyof UserProfile]) {
        completedFields++;
      }
    }
  });
  
  return Math.round((completedFields / requiredFields.length) * 100);
};

// Initial state
const initialState: UserState = {
  // Profile data
  profile: {
    id: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    fullName: '',
    dateOfBirth: null,
    gender: '',
    address: {
      street: '',
      city: '',
      district: '',
      province: '',
      postalCode: '',
    },
    nic: '',
    profilePhoto: null,
    isVerified: false,
    verificationStatus: 'pending',
    createdAt: '',
    updatedAt: '',
  },
  
  // User preferences
  preferences: {
    language: 'en',
    notifications: {
      push: true,
      email: true,
      sms: false,
    },
    theme: 'light',
    biometricAuth: false,
    autoLogout: 30,
  },
  
  // Application statistics
  stats: {
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    upcomingAppointments: 0,
  },
  
  // Loading states
  isLoading: false,
  isUpdating: false,
  isUploadingPhoto: false,
  isChangingPassword: false,
  
  // Error states
  error: null,
  updateError: null,
  uploadError: null,
  passwordError: null,
  
  // Success states
  updateSuccess: false,
  uploadSuccess: false,
  passwordChangeSuccess: false,
  
  // UI states
  profileCompleted: false,
  profileCompletionPercentage: 0,
  lastSyncTime: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Clear error states
    clearUserErrors: (state) => {
      state.error = null;
      state.updateError = null;
      state.uploadError = null;
      state.passwordError = null;
    },
    
    // Clear success states
    clearUserSuccess: (state) => {
      state.updateSuccess = false;
      state.uploadSuccess = false;
      state.passwordChangeSuccess = false;
    },
    
    // Update profile locally
    setProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
      state.profileCompletionPercentage = calculateProfileCompletion(state.profile);
      state.profileCompleted = state.profileCompletionPercentage >= 80;
    },
    
    // Update preferences locally
    setPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    // Update specific preference
    updatePreference: (state, action: PayloadAction<{ key: keyof UserPreferences; value: any }>) => {
      const { key, value } = action.payload;
      (state.preferences as any)[key] = value;
    },
    
    // Update notification preferences
    updateNotificationPreferences: (state, action: PayloadAction<Partial<NotificationPreferences>>) => {
      state.preferences.notifications = {
        ...state.preferences.notifications,
        ...action.payload,
      };
    },
    
    // Update user stats
    setUserStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    
    // Set last sync time
    setLastSyncTime: (state) => {
      state.lastSyncTime = new Date().toISOString();
    },
    
    // Reset user state
    resetUserState: () => {
      return initialState;
    },
    
    // Set profile completion
    setProfileCompletion: (state, action: PayloadAction<number>) => {
      state.profileCompletionPercentage = action.payload;
      state.profileCompleted = action.payload >= 80;
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = { ...state.profile, ...action.payload };
        state.error = null;
        state.lastSyncTime = new Date().toISOString();
        state.profileCompletionPercentage = calculateProfileCompletion(state.profile);
        state.profileCompleted = state.profileCompletionPercentage >= 80;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch profile';
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = { ...state.profile, ...action.payload };
        state.updateSuccess = true;
        state.updateError = null;
        state.profileCompletionPercentage = calculateProfileCompletion(state.profile);
        state.profileCompleted = state.profileCompletionPercentage >= 80;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload || 'Profile update failed';
        state.updateSuccess = false;
      });

    // Upload profile photo
    builder
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.isUploadingPhoto = true;
        state.uploadError = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.isUploadingPhoto = false;
        state.profile.profilePhoto = action.payload.photoUrl;
        state.uploadSuccess = true;
        state.uploadError = null;
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.isUploadingPhoto = false;
        state.uploadError = action.payload || 'Photo upload failed';
        state.uploadSuccess = false;
      });

    // Update preferences
    builder
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
      });

    // Change password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isChangingPassword = true;
        state.passwordError = null;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isChangingPassword = false;
        state.passwordChangeSuccess = true;
        state.passwordError = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isChangingPassword = false;
        state.passwordError = action.payload || 'Password change failed';
        state.passwordChangeSuccess = false;
      });
  },
});

export const {
  clearUserErrors,
  clearUserSuccess,
  setProfile,
  setPreferences,
  updatePreference,
  updateNotificationPreferences,
  setUserStats,
  setLastSyncTime,
  resetUserState,
  setProfileCompletion,
} = userSlice.actions;

export default userSlice.reducer;