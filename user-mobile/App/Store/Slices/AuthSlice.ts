// src/store/slices/authSlice.ts - Authentication State
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../Services/API/AuthAPI';

// Types
export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nic?: string;
  isVerified: boolean;
  profilePhoto?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  nic?: string;
  agreeToTerms: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterResponse {
  user: User;
  message: string;
  requiresOTP: boolean;
  otpSent: boolean;
}

export interface OTPData {
  phone: string;
  otp: string;
}

export interface AuthState {
  // User authentication state
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  
  // Loading states
  isLoading: boolean;
  isRegistering: boolean;
  isVerifyingOTP: boolean;
  isRefreshingToken: boolean;
  
  // Error states
  error: string | null;
  loginError: string | null;
  registerError: string | null;
  otpError: string | null;
  
  // Success states
  loginSuccess: boolean;
  registerSuccess: boolean;
  otpSuccess: boolean;
  logoutSuccess: boolean;
  
  // OTP state
  otpSent: boolean;
  otpVerified: boolean;
  pendingVerification: boolean;
  
  // Password reset
  passwordResetSent: boolean;
  passwordResetError: string | null;
  
  // Remember me
  rememberedEmail: string | null;
  
  // Session info
  lastLoginTime: string | null;
  sessionExpiry: string | null;
  tokenExpiry: number | null;
}

// Async thunks for API calls
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/loginUser',
  async ({ email, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success) {
        // Store tokens
        await AsyncStorage.setItem('accessToken', response.data.token);
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        
        if (rememberMe) {
          await AsyncStorage.setItem('rememberedEmail', email);
        }
        
        return {
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          expiresIn: response.data.expiresIn,
        };
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterData,
  { rejectValue: string }
>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      
      if (response.success) {
        return {
          user: response.data.user,
          message: response.message,
          requiresOTP: response.data.requiresOTP,
          otpSent: response.data.otpSent,
        };
      } else {
        return rejectWithValue(response.message || 'Registration failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration error occurred');
    }
  }
);

export const verifyOTP = createAsyncThunk<
  LoginResponse,
  OTPData,
  { rejectValue: string }
>(
  'auth/verifyOTP',
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyOTP({ phone, otp });
      
      if (response.success) {
        await AsyncStorage.setItem('accessToken', response.data.token);
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        
        return {
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          expiresIn: response.data.expiresIn,
        };
      } else {
        return rejectWithValue(response.message || 'OTP verification failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'OTP verification error');
    }
  }
);

export const refreshAccessToken = createAsyncThunk<
  { token: string; refreshToken: string },
  void,
  { 
    state: { auth: AuthState }; 
    rejectValue: string;
  }
>(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.refreshToken) {
        return rejectWithValue('No refresh token available');
      }

      const response = await authApi.refreshToken(auth.refreshToken);
      
      if (response.success) {
        await AsyncStorage.setItem('accessToken', response.data.token);
        return {
          token: response.data.token,
          refreshToken: response.data.refreshToken || auth.refreshToken,
        };
      } else {
        return rejectWithValue('Token refresh failed');
      }
    } catch (error: any) {
      return rejectWithValue('Token refresh error');
    }
  }
);

export const logoutUser = createAsyncThunk<
  boolean,
  void,
  { 
    state: { auth: AuthState }; 
    rejectValue: string;
  }
>(
  'auth/logoutUser',
  async (_, { getState }) => {
    try {
      const { auth } = getState();
      
      // Call logout API to blacklist token
      if (auth.token) {
        await authApi.logout(auth.token);
      }
      
      // Clear stored tokens
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'userProfile',
      ]);
      
      return true;
    } catch (error) {
      // Even if API call fails, clear local data
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'userProfile',
      ]);
      return true;
    }
  }
);

export const forgotPassword = createAsyncThunk<
  { message: string; resetToken?: string },
  { email: string },
  { rejectValue: string }
>(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword({ email });
      
      if (response.success) {
        return {
          message: response.message,
          resetToken: response.data.resetToken,
        };
      } else {
        return rejectWithValue(response.message || 'Password reset failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password reset error');
    }
  }
);

// Initial state
const initialState: AuthState = {
  // User authentication state
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  
  // Loading states
  isLoading: false,
  isRegistering: false,
  isVerifyingOTP: false,
  isRefreshingToken: false,
  
  // Error states
  error: null,
  loginError: null,
  registerError: null,
  otpError: null,
  
  // Success states
  loginSuccess: false,
  registerSuccess: false,
  otpSuccess: false,
  logoutSuccess: false,
  
  // OTP state
  otpSent: false,
  otpVerified: false,
  pendingVerification: false,
  
  // Password reset
  passwordResetSent: false,
  passwordResetError: null,
  
  // Remember me
  rememberedEmail: null,
  
  // Session info
  lastLoginTime: null,
  sessionExpiry: null,
  tokenExpiry: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error states
    clearAuthErrors: (state) => {
      state.error = null;
      state.loginError = null;
      state.registerError = null;
      state.otpError = null;
      state.passwordResetError = null;
    },
    
    // Clear success states
    clearAuthSuccess: (state) => {
      state.loginSuccess = false;
      state.registerSuccess = false;
      state.otpSuccess = false;
      state.logoutSuccess = false;
      state.passwordResetSent = false;
    },
    
    // Set remembered email
    setRememberedEmail: (state, action: PayloadAction<string>) => {
      state.rememberedEmail = action.payload;
    },
    
    // Clear remembered email
    clearRememberedEmail: (state) => {
      state.rememberedEmail = null;
    },
    
    // Update user profile
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    // Set session expiry
    setSessionExpiry: (state, action: PayloadAction<string>) => {
      state.sessionExpiry = action.payload;
    },
    
    // Clear OTP state
    clearOTPState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
      state.pendingVerification = false;
      state.otpError = null;
      state.isVerifyingOTP = false;
    },
    
    // Reset auth state (for logout)
    resetAuthState: (state) => {
      return {
        ...initialState,
        rememberedEmail: state.rememberedEmail,
      };
    },
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loginError = null;
        state.loginSuccess = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.loginSuccess = true;
        state.loginError = null;
        state.lastLoginTime = new Date().toISOString();
        state.tokenExpiry = action.payload.expiresIn;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.payload || 'Login failed';
        state.loginSuccess = false;
        state.isAuthenticated = false;
      });

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.isRegistering = true;
        state.registerError = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.registerSuccess = true;
        state.registerError = null;
        
        if (action.payload.requiresOTP) {
          state.pendingVerification = true;
          state.otpSent = action.payload.otpSent;
        } else {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegistering = false;
        state.registerError = action.payload || 'Registration failed';
        state.registerSuccess = false;
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isVerifyingOTP = true;
        state.otpError = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isVerifyingOTP = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.otpSuccess = true;
        state.otpVerified = true;
        state.pendingVerification = false;
        state.lastLoginTime = new Date().toISOString();
        state.tokenExpiry = action.payload.expiresIn;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isVerifyingOTP = false;
        state.otpError = action.payload || 'OTP verification failed';
        state.otpSuccess = false;
      });

    // Refresh token
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.isRefreshingToken = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isRefreshingToken = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isRefreshingToken = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });

    // Logout user
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        return {
          ...initialState,
          logoutSuccess: true,
          rememberedEmail: state.rememberedEmail,
        };
      });

    // Forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.passwordResetError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passwordResetSent = true;
        state.passwordResetError = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.passwordResetError = action.payload || 'Password reset failed';
        state.passwordResetSent = false;
      });
  },
});

export const {
  clearAuthErrors,
  clearAuthSuccess,
  setRememberedEmail,
  clearRememberedEmail,
  updateUserProfile,
  setSessionExpiry,
  clearOTPState,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;