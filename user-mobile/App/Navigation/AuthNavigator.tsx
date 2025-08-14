import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import RegistrationFlow from '../Screens/Auth/SignupScreen';
import OTPVerification from '../Screens/Auth/AuthVerification';
import GovLinkLogin from '../Screens/Auth/LoginScreen';

export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  OTPVerification: {
    mobileNumber: string;
    fromScreen: 'registration' | 'login' | 'profile';
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={GovLinkLogin}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Registration" 
          component={RegistrationFlow}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="OTPVerification" 
          component={OTPVerification}
          options={{ 
            headerShown: false,
            gestureEnabled: false, // Prevent swipe back during OTP verification
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}