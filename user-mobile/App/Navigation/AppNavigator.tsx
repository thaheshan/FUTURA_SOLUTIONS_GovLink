// Navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import GovLinkLogin from '../Screens/Auth/LoginScreen';
import RegistrationFlow from '../Screens/Auth/SignupScreen';
import OTPVerification from '../Screens/Auth/AuthVerification';
import ForgotPasswordScreen from '../Screens/Auth/ForgotPassword';
import HomeScreen from '../Screens/Main/HomeScreen';
import ProfileScreen from '../Screens/Main/ProfileScreen';
import ServicesScreen from '../Screens/Main/ServiceScreen';
import FeedScreen from '../Screens/Main/FeedScreen';
import AIAssistantScreen from '../Screens/Main/AIAssistantScreen';
import BookAppointmentScreen from '../Screens/Appointments/BookAppointmentScreen'; // ✅ Import BookAppointment Screen
import ComingSoonScreen from '../components/common/ComingSoon'; // ✅ Import Coming Soon Screen

// Unified Root Stack Params (Legacy + New + Coming Soon)
export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  ForgotPassword: undefined;
  OTPVerification: {
    mobileNumber?: string;
    phoneNumber?: string;
    fromScreen?: string;
  };
  Home: undefined;
  Profile: undefined;
  Services: undefined;
  Feed: undefined;
  Assistant: undefined; // ✅ Now included
  AIAssistant: undefined;
  BookAppointment: undefined; // ✅ Added BookAppointment Screen
  ComingSoon: undefined; // ✅ Added Coming Soon Screen
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
          component={AIAssistantScreen}  // Use the same component
          options={{
            title: 'Assistant',
            animation: 'fade',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="BookAppointment"
          component={BookAppointmentScreen}
          options={{
            title: 'Book Appointment',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="ComingSoon"
          component={ComingSoonScreen}
          options={{
            title: 'Coming Soon',
            animation: 'fade_from_bottom',
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}