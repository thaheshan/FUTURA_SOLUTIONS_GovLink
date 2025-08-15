import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

// Root Stack - Top level navigation
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Splash?: undefined;
  Onboarding?: undefined;
};

// Auth Stack - Authentication related screens
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Registration: undefined;
  ForgotPassword: undefined;
  OTPVerification: { 
    phoneNumber: string;
    mobileNumber?: string; 
    fromScreen?: string;
  };
  ResetPassword?: { token: string };
};

// Main Tab Navigator - Bottom tab screens (Updated to match TabNavigator)
export type MainTabParamList = {
  Home: undefined;
  Services: undefined;
  Assistant: undefined; // This matches your TabNavigator component
  Feed: undefined;
  Profile: undefined;
};

// Service Stack - Services related screens
export type ServiceStackParamList = {
  AllServices: undefined;
  NICReissue: undefined;
  BirthCertificate: undefined;
  MarriageCertificate: undefined;
  DeathCertificate: undefined;
  EducationalCertificates: undefined;
  DriverLicense: undefined;
  Appointments: undefined;
  TrackRequest: undefined;
  ComingSoon: { serviceName: string };
  ServiceDetails: { serviceId: string };
  ServiceForm: { serviceType: string };
  PaymentGateway: { 
    amount: number; 
    serviceType: string; 
    applicationId: string; 
  };
};

// AI Stack - AI Assistant related screens (Updated naming)
export type AIStackParamList = {
  AIChat: undefined;
  AIAssistant: undefined;
  AIResults: { query: string };
  VoiceAssistant: undefined;
  ChatHistory: undefined;
  AISettings: undefined;
};

// Feed Stack - Feed related screens
export type FeedStackParamList = {
  FeedMain: undefined;
  FeedDetails: { postId: string };
  CreatePost: undefined;
  PostComments: { postId: string };
  NewsDetails: { newsId: string };
  EditPost: { postId: string };
  UserFeed: { userId: string };
};

// Profile Stack - Profile related screens
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
  ChangePassword: undefined;
  NotificationSettings: undefined;
  MyApplications: undefined;
  Documents: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  ContactUs: undefined;
  FAQ: undefined;
};

// Appointment Stack - Appointment related screens
export type AppointmentStackParamList = {
  BookAppointment: undefined;
  AppointmentDetails: { appointmentId: string };
  SelectTimeSlot: { serviceType: string };
  AppointmentConfirmation: { appointmentData: AppointmentData };
  AppointmentHistory: undefined;
  RescheduleAppointment: { appointmentId: string };
  CancelAppointment: { appointmentId: string };
};

// Tracking Stack - Request tracking screens
export type TrackingStackParamList = {
  TrackMain: undefined;
  TrackDetails: { requestId: string };
  RequestHistory: undefined;
  RequestStatus: { requestId: string };
  DocumentUpload: { requestId: string };
  TrackingNotifications: undefined;
};

// Notification Stack - Notification related screens
export type NotificationStackParamList = {
  NotificationList: undefined;
  NotificationDetails: { notificationId: string };
  NotificationSettings: undefined;
};

// Navigation Props
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
export type ServiceNavigationProp = NativeStackNavigationProp<ServiceStackParamList>;
export type AINavigationProp = NativeStackNavigationProp<AIStackParamList>;
export type FeedNavigationProp = NativeStackNavigationProp<FeedStackParamList>;
export type ProfileNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;
export type AppointmentNavigationProp = NativeStackNavigationProp<AppointmentStackParamList>;
export type TrackingNavigationProp = NativeStackNavigationProp<TrackingStackParamList>;
export type NotificationNavigationProp = NativeStackNavigationProp<NotificationStackParamList>;

// Root Navigation Prop for global navigation
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Composite Navigation Props for nested navigation
export type ServiceCompositeNavigationProp = CompositeNavigationProp<
  ServiceNavigationProp,
  MainTabNavigationProp
>;

export type AICompositeNavigationProp = CompositeNavigationProp<
  AINavigationProp,
  MainTabNavigationProp
>;

export type FeedCompositeNavigationProp = CompositeNavigationProp<
  FeedNavigationProp,
  MainTabNavigationProp
>;

export type ProfileCompositeNavigationProp = CompositeNavigationProp<
  ProfileNavigationProp,
  MainTabNavigationProp
>;

export type AppointmentCompositeNavigationProp = CompositeNavigationProp<
  AppointmentNavigationProp,
  MainTabNavigationProp
>;

export type TrackingCompositeNavigationProp = CompositeNavigationProp<
  TrackingNavigationProp,
  MainTabNavigationProp
>;

// Route Props
export type AuthRouteProp<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;
export type MainTabRouteProp<T extends keyof MainTabParamList> = RouteProp<MainTabParamList, T>;
export type ServiceRouteProp<T extends keyof ServiceStackParamList> = RouteProp<ServiceStackParamList, T>;
export type AIRouteProp<T extends keyof AIStackParamList> = RouteProp<AIStackParamList, T>;
export type FeedRouteProp<T extends keyof FeedStackParamList> = RouteProp<FeedStackParamList, T>;
export type ProfileRouteProp<T extends keyof ProfileStackParamList> = RouteProp<ProfileStackParamList, T>;
export type AppointmentRouteProp<T extends keyof AppointmentStackParamList> = RouteProp<AppointmentStackParamList, T>;
export type TrackingRouteProp<T extends keyof TrackingStackParamList> = RouteProp<TrackingStackParamList, T>;
export type NotificationRouteProp<T extends keyof NotificationStackParamList> = RouteProp<NotificationStackParamList, T>;

// Screen Props Types
export type AuthScreenProps<T extends keyof AuthStackParamList> = {
  navigation: AuthNavigationProp;
  route: AuthRouteProp<T>;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = {
  navigation: MainTabNavigationProp;
  route: MainTabRouteProp<T>;
};

export type ServiceScreenProps<T extends keyof ServiceStackParamList> = {
  navigation: ServiceCompositeNavigationProp;
  route: ServiceRouteProp<T>;
};

export type AIScreenProps<T extends keyof AIStackParamList> = {
  navigation: AICompositeNavigationProp;
  route: AIRouteProp<T>;
};

export type FeedScreenProps<T extends keyof FeedStackParamList> = {
  navigation: FeedCompositeNavigationProp;
  route: FeedRouteProp<T>;
};

export type ProfileScreenProps<T extends keyof ProfileStackParamList> = {
  navigation: ProfileCompositeNavigationProp;
  route: ProfileRouteProp<T>;
};

export type AppointmentScreenProps<T extends keyof AppointmentStackParamList> = {
  navigation: AppointmentCompositeNavigationProp;
  route: AppointmentRouteProp<T>;
};

export type TrackingScreenProps<T extends keyof TrackingStackParamList> = {
  navigation: TrackingCompositeNavigationProp;
  route: TrackingRouteProp<T>;
};

// Helper Interfaces
export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  available?: boolean;
  description?: string;
  category?: string;
  estimatedTime?: string;
  requirements?: string[];
}

export interface District {
  id: string;
  name: string;
  province: string;
  code?: string;
}

export interface Province {
  id: string;
  name: string;
  districts: District[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  nic?: string;
  profileImage?: string;
  address?: Address;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  occupation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Address {
  street?: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
  country?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'voice' | 'image' | 'file';
  metadata?: {
    voiceDuration?: number;
    imageUrl?: string;
    fileName?: string;
    fileSize?: number;
  };
  isTyping?: boolean;
  error?: boolean;
  retryable?: boolean;
}

export interface FeedPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    profileImage?: string;
  };
  timestamp: Date;
  likes: number;
  comments: number;
  shares?: number;
  category: string;
  imageUrl?: string;
  tags?: string[];
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    profileImage?: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
  isLiked?: boolean;
}

export interface Appointment {
  id: string;
  serviceType: string;
  serviceName: string;
  date: Date;
  time: string;
  location: {
    name: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  reminderSent?: boolean;
  qrCode?: string;
  estimatedDuration?: number;
}

export interface AppointmentData {
  serviceType: string;
  date: Date;
  time: string;
  location: string;
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    nic: string;
  };
  additionalNotes?: string;
}

export interface Application {
  id: string;
  serviceType: string;
  serviceName: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';
  submittedDate: Date;
  expectedDate?: Date;
  completedDate?: Date;
  trackingNumber: string;
  documents: ApplicationDocument[];
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  fees?: {
    serviceFee: number;
    processingFee: number;
    total: number;
  };
  notes?: string;
  rejectionReason?: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  url?: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadDate: Date;
  size?: number;
  rejectionReason?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'appointment' | 'application';
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    appointmentId?: string;
    applicationId?: string;
    postId?: string;
  };
}

// Tab Navigator Active Tab Type (Updated to match your TabNavigator)
export type ActiveTab = 'Home' | 'Services' | 'Assistant' | 'Feed' | 'Profile';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  nic?: string;
}

export interface OTPVerificationForm {
  otp: string;
  phoneNumber: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  token: string;
  password: string;
  confirmPassword: string;
}

// Legacy support for existing components (Maintained for backward compatibility)
export type RootStackParamListLegacy = {
  Login: undefined;
  Registration: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  OTPVerification: { 
    phoneNumber: string;
    mobileNumber?: string; 
    fromScreen?: string;
  };
  Home: undefined;
  Profile: undefined;
  Services: undefined;
  Feed: undefined;
  Assistant: undefined;
  AIAssistant: undefined;
};

// Updated Navigation Prop to use the main type system
export type NavigationProp = NativeStackNavigationProp<RootStackParamListLegacy>;

// Export commonly used combined types
export type TabNavigatorProps = {
  activeTab?: ActiveTab;
};

// Theme and Style Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

// Configuration Types
export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  supportEmail: string;
  supportPhone: string;
  termsUrl: string;
  privacyUrl: string;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Export all types for easy importing
export * from '@react-navigation/native';
export * from '@react-navigation/native-stack';
export * from '@react-navigation/bottom-tabs';

