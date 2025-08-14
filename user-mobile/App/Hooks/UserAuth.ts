import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  nicNumber: string;
  verified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  fullName: string;
  nicNumber: string;
  mobileNumber: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface OTPVerificationData {
  mobileNumber: string;
  otp: string;
  fromScreen: 'registration' | 'login' | 'profile';
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  // Simulate checking for existing auth token on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate checking stored auth token
      // In a real app, you'd check AsyncStorage or similar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, assume no stored auth
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to check authentication status',
      }));
    }
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simple validation (in real app, this would be server-side)
      if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
        const mockUser: User = {
          id: '1',
          fullName: 'John Doe',
          email: credentials.email,
          mobileNumber: '+94712345678',
          nicNumber: '199012345678',
          verified: true,
        };

        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegistrationData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validate form data
      if (!data.fullName || !data.email || !data.password) {
        throw new Error('Please fill in all required fields');
      }

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (!data.agreeTerms) {
        throw new Error('Please agree to the terms and conditions');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, you'd send this data to your backend
      console.log('Registration data:', data);

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
      return false;
    }
  }, []);

  const verifyOTP = useCallback(async (data: OTPVerificationData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simple validation (in real app, this would be server-side)
      if (data.otp === '123456') {
        if (data.fromScreen === 'registration') {
          // For registration flow, just mark as verified
          Alert.alert('Success', 'Phone number verified successfully!');
        } else if (data.fromScreen === 'login') {
          // For login flow, authenticate user
          const mockUser: User = {
            id: '1',
            fullName: 'John Doe',
            email: 'user@example.com',
            mobileNumber: data.mobileNumber,
            nicNumber: '199012345678',
            verified: true,
          };

          setAuthState({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        }

        return true;
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'OTP verification failed',
      }));
      return false;
    }
  }, []);

  const resendOTP = useCallback(async (mobileNumber: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('OTP Sent', 'A new OTP has been sent to your mobile number.');
      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call and clearing stored tokens
      await new Promise(resolve => setTimeout(resolve, 500));

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Logout failed',
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    if (!authState.user) return false;

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedUser = { ...authState.user, ...updates };
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update profile',
      }));
      return false;
    }
  }, [authState.user]);

  return {
    // State
    ...authState,
    
    // Actions
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    clearError,
    updateProfile,
    checkAuthStatus,
  };
};