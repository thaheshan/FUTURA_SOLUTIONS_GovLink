// Navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

// Auth Screens
import GovLinkLogin from '../Screens/Auth/LoginScreen';
import RegistrationFlow from '../Screens/Auth/SignupScreen';
import OTPVerification from '../Screens/Auth/AuthVerification';
import ForgotPasswordScreen from '../Screens/Auth/ForgotPassword';

// Main App Screens
import HomeScreen from '../Screens/Main/HomeScreen';
import ProfileScreen from '../Screens/Main/ProfileScreen';
import ServicesScreen from '../Screens/Main/ServiceScreen';
import FeedScreen from '../Screens/Main/FeedScreen';
import AIAssistantScreen from '../Screens/Main/AIAssistantScreen';
import ComingSoonScreen from '../components/common/ComingSoon';

// Appointment Screens
import AppointmentsHomeScreen from '../Screens/Appointments//BookAppointmentScreen';
import BookAppointmentOptionsScreen from '../Screens/Appointments/AppontmentOptionsScreen';
import BookAppointmentDetailScreen from '../Screens/Appointments/BookingAppointmentDetailsScreen';
import AllAppointmentsScreen from '../Screens/Appointments/AppontmentOptionsScreen';
import AppointmentTrackingScreen from '../Screens/Appointments/AppointmentTrackingScreen';
import AppointmentConfirmationScreen from '../Screens/Appointments/AppointmentConfirmationScreen';

// Legacy Appointment Screen (keeping for backward compatibility)
import BookAppointmentScreen from '../Screens/Appointments/BookAppointmentScreen';

// Tracking Screens
import TrackRequestsScreen from '../components/Tracking/TrackingList';
import ApplicationTrackingScreen from '../components/Tracking/NICTrackingDetails';

// NIC Services Screens
import NICServicesScreen from '../components/Services/NIC Services/NICServices';
import NICNewApplicationScreen from '../components/Services/NIC Services/NICNewApplication';

// NIC Re-issue Workflow Screens
import NICReissueOverviewScreen from '../components/Services/NIC Services/NICReissueApplication';
import NICReissueSelectReasonScreen from '../components/Services/NIC Services/NICReissueReason';
import NICReissueVerificationScreen from '../components/Services/NIC Services/NICReissueVerification';
import NICReissueApplicationScreen from '../components/Services/NIC Services/NICReissueApplication';
import NICReissueDocumentUploadScreen from '../components/Services/NIC Services/NICReissueUploadDocument';
import NICSecurityVerificationScreen from '../components/Services/NIC Services/NICReissueVerifcation';

// NIC Corrections Workflow Screens
import NICCorrectionsSelectScreen from '../components/Services/NIC Services/NICCorrectionScreen';
import NICCorrectionsFormScreen from '../components/Services/NIC Services/NICCorrectionFormScreen';
import NICCorrectionsDocumentUploadScreen from '../components/Services/NIC Services/NICCorrectionDocument';

// Shared Screens
import PaymentScreen from '../components/Services/NIC Services/NICPaymentScreen';
import ConfirmationScreen from '../components/Services/NIC Services/NICConfirmationScreen';
import ConfirmationReissueScreen from '../components/Services/NIC Services/NICReissueConfirmationScreen';
import ConfirmationNewScreen from '../components/Services/NIC Services/NewNicApplicationConfirmattionScreen';

// Enhanced Root Stack Params with Appointment Screens
export type RootStackParamList = {
  // Auth Screens
  Login: undefined;
  Registration: undefined;
  ForgotPassword: undefined;
  OTPVerification: {
    mobileNumber?: string;
    phoneNumber?: string;
    fromScreen?: string;
  };
  
  // Main App Screens
  Home: undefined;
  Profile: undefined;
  Services: undefined;
  Feed: undefined;
  Assistant: undefined;
  AIAssistant: undefined;
  ComingSoon: undefined;
  
  // Appointment Screens
  AppointmentsHome: undefined;
  BookAppointmentOptions: undefined;
  BookAppointmentDetail: { 
    type: 'complaint' | 'service' | 'inquiry' 
  };
  AllAppointments: undefined;
  AppointmentTracking: { 
    appointmentId: string 
  };
  AppointmentConfirmation: {
    appointmentData: {
      type: 'complaint' | 'service' | 'inquiry';
      trackingNumber: string;
      division: string;
      date: string;
      time: string;
      subject: string;
      fullName: string;
      phone: string;
      email?: string;
      urgency: 'low' | 'medium' | 'high';
    };
  };
  
  // Legacy Appointment Screen (keeping for backward compatibility)
  BookAppointment: undefined;
  
  // Tracking Screens
  TrackRequests: undefined;
  ApplicationTracking: {
    trackingNumber?: string;
    applicationType?: string;
    applicationDate?: string;
    status?: string;
  };
  
  // Main NIC Services
  NICServices: undefined;
  NICNewApplication: undefined;
  
  // NIC Re-issue Workflow
  NICReissueOverview: undefined;
  NICReissueSelectReason: undefined;
  NICReissueVerification: {
    reason?: string;
  };
  NICReissueApplication: {
    reason?: string;
    verificationData?: any;
  };
  NICReissueDocumentUpload: {
    applicationData?: any;
  };
  NICSecurityVerification: {
    applicationData?: any;
    documents?: any[];
  };
  
  // NIC Corrections Workflow
  NICCorrectionsSelect: undefined;
  NICCorrectionsForm: {
    correctionType?: string;
  };
  NICCorrectionsDocumentUpload: {
    correctionData?: any;
  };
  
  // Shared Screens
  Payment: {
    serviceType: 'reissue' | 'correction' | 'new';
    applicationData?: any;
    amount?: number;
  };
  Confirmation: {
    serviceType: 'reissue' | 'correction' | 'new';
    trackingNumber?: string;
    applicationData?: any;
  };
  ConfirmationNew: {
    trackingNumber?: string;
    applicationData?: any;
  };
  ConfirmationReissue: {
    trackingNumber?: string;
    applicationData?: any;
  };
  
  // Division Detail Screen (for future use)
  DivisionDetail: {
    divisionId: string;
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen
          name="Login"
          component={GovLinkLogin}
          options={{
            title: 'Login',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationFlow}
          options={{
            title: 'Register',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{
            title: 'Reset Password',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="OTPVerification"
          component={OTPVerification}
          options={{
            title: 'Verify OTP',
            animation: 'fade',
          }}
        />

        {/* Main App Screens */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            gestureEnabled: true,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
            animation: 'fade',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Services"
          component={ServicesScreen}
          options={{
            title: 'Services',
            animation: 'fade',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            title: 'Feed',
            animation: 'fade',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Assistant"
          component={AIAssistantScreen}
          options={{
            title: 'Assistant',
            animation: 'fade',
            gestureEnabled: true,
          }}
        />

        {/* Appointment Screens */}
        <Stack.Screen
          name="AppointmentsHome"
          component={AppointmentsHomeScreen}
          options={{
            title: 'Appointments',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="BookAppointmentOptions"
          component={BookAppointmentOptionsScreen}
          options={{
            title: 'Book Appointment',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="BookAppointmentDetail"
          component={BookAppointmentDetailScreen}
          options={{
            title: 'Appointment Details',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="AllAppointments"
          component={AllAppointmentsScreen}
          options={{
            title: 'All Appointments',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="AppointmentTracking"
          component={AppointmentTrackingScreen}
          options={{
            title: 'Track Appointment',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="AppointmentConfirmation"
          component={AppointmentConfirmationScreen}
          options={{
            title: 'Appointment Confirmed',
            animation: 'fade',
            gestureEnabled: false, // Prevent going back from confirmation
          }}
        />

        {/* Legacy Appointment Screen */}
        <Stack.Screen
          name="BookAppointment"
          component={BookAppointmentScreen}
          options={{
            title: 'Book Appointment (Legacy)',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />

        {/* Tracking Screens */}
        <Stack.Screen
          name="TrackRequests"
          component={TrackRequestsScreen}
          options={{
            title: 'Track Requests',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="ApplicationTracking"
          component={ApplicationTrackingScreen}
          options={{
            title: 'Application Tracking',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />

        {/* Utility Screens */}
        <Stack.Screen
          name="ComingSoon"
          component={ComingSoonScreen}
          options={{
            title: 'Coming Soon',
            animation: 'fade_from_bottom',
            gestureEnabled: true,
          }}
        />

        {/* Main NIC Services Screens */}
        <Stack.Screen
          name="NICServices"
          component={NICServicesScreen}
          options={{
            title: 'NIC Services',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="NICNewApplication"
          component={NICNewApplicationScreen}
          options={{
            title: 'New NIC Application',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />

        {/* NIC Re-issue Workflow Screens */}
        <Stack.Screen
          name="NICReissueOverview"
          component={NICReissueOverviewScreen}
          options={{
            title: 'NIC Re-issue',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="NICReissueSelectReason"
          component={NICReissueSelectReasonScreen}
          options={{
            title: 'Select Reason',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="NICReissueVerification"
          component={NICReissueVerificationScreen}
          options={{
            title: 'Verification',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="NICReissueApplication"
          component={NICReissueApplicationScreen}
          options={{
            title: 'Re-issue Application',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="NICReissueDocumentUpload"
          component={NICReissueDocumentUploadScreen}
          options={{
            title: 'Upload Documents',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="NICSecurityVerification"
          component={NICSecurityVerificationScreen}
          options={{
            title: 'Security Verification',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />

        {/* NIC Corrections Workflow Screens */}
        <Stack.Screen
          name="NICCorrectionsSelect"
          component={NICCorrectionsSelectScreen}
          options={{
            title: 'Select Correction',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="NICCorrectionsForm"
          component={NICCorrectionsFormScreen}
          options={{
            title: 'Correction Form',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="NICCorrectionsDocumentUpload"
          component={NICCorrectionsDocumentUploadScreen}
          options={{
            title: 'Upload Documents',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />

        {/* Shared Screens */}
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{
            title: 'Payment',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />

        {/* Confirmation Screens */}
        <Stack.Screen
          name="Confirmation"
          component={ConfirmationScreen}
          options={{
            title: 'Confirmation',
            animation: 'fade',
            gestureEnabled: false, // Prevent going back from confirmation
          }}
        />
        <Stack.Screen
          name="ConfirmationNew"
          component={ConfirmationNewScreen}
          options={{
            title: 'New NIC Confirmation',
            animation: 'fade',
            gestureEnabled: false, // Prevent going back from confirmation
          }}
        />
        <Stack.Screen
          name="ConfirmationReissue"
          component={ConfirmationReissueScreen}
          options={{
            title: 'Re-issue Confirmation',
            animation: 'fade',
            gestureEnabled: false, // Prevent going back from confirmation
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}