// Navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import GovLinkLogin from '../Screens/Auth/LoginScreen';
import RegistrationFlow from '../Screens/Auth/SignupScreen';
import OTPVerification from '../Screens/Auth/AuthVerification';
import HomeScreen from '../Screens/Main/HomeScreen';
import ProfileScreen from '../Screens/Main/ProfileScreen';
import ServicesScreen from '../Screens/Main/ServiceScreen'; // Add ServicesScreen import
import FeedScreen from '../Screens/Main/FeedScreen'; // Add FeedScreen import

// Define your navigation types
export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  OTPVerification: {
    mobileNumber: string;
    fromScreen: string;
  };
  Home: undefined;
  Profile: undefined;
  Services: undefined; // Add Services to the type definition
  Feed: undefined; // Add Feed to the type definition
  // Assistant: undefined;    // Uncomment when Assistant screen is created
};

// Navigation prop type for components
export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Create the stack navigator with types
const Stack = createNativeStackNavigator<RootStackParamList>();

// Main App Navigator
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
            gestureEnabled: false, // Disable swipe back on login screen
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
            gestureEnabled: false, // Disable swipe back on home screen
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Services"
          component={ServicesScreen}
          options={{
            title: 'Services',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            title: 'Feed',
            animation: 'slide_from_right',
          }}
        />
        {/* 
        Uncomment these screens when you create them:
        
        <Stack.Screen
          name="Assistant"
          component={AssistantScreen}
          options={{
            title: 'Assistant',
            animation: 'slide_from_bottom',
          }}
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}