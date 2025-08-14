// Screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigation/AppNavigator';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

type UserType = 'citizen' | 'government';

interface LoginFormData {
  username: string;
  password: string;
}

const GovLinkLogin: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<UserType>('citizen');
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get placeholder text based on selected tab
  const getUsernamePlaceholder = (): string => {
    return selectedTab === 'citizen' 
      ? 'Username/NIC' 
      : 'Official ID Number';
  };

  // Handle input change
  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle tab change
  const handleTabChange = (tab: UserType) => {
    setSelectedTab(tab);
    setFormData({ username: '', password: '' });
  };

  // Handle login
  const handleLogin = async () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication - you can replace this with actual API call
      if (formData.username.toLowerCase() === 'admin' && formData.password === '123456') {
        // Debug navigation state
        console.log('Navigation state:', navigation.getState());
        console.log('Available routes:', navigation.getState().routes);
        
        // Simple navigation without reset
        navigation.navigate('Home');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      Alert.alert(
        'Login Failed', 
        'Invalid credentials. Please check your username and password.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password - Updated to navigate to ForgotPasswordScreen
  const handleForgotPassword = () => {
    if (isLoading) return; // Prevent navigation while loading
    navigation.navigate('ForgotPassword');
  };

  // Handle navigation to signup
  const handleNavigateToSignup = () => {
    if (isLoading) return; // Prevent navigation while loading
    navigation.navigate('Registration');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/favicon/favicon/Logo-GovLink.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome to GovLink</Text>
            <Text style={styles.welcomeSubtitle}>
              Access government services and interact with{'\n'}your community.
            </Text>
          </View>

          {/* Tab Selection */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'citizen' && styles.activeTab,
              ]}
              onPress={() => handleTabChange('citizen')}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'citizen' && styles.activeTabText,
                ]}
              >
                Citizen
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'government' && styles.activeTab,
              ]}
              onPress={() => handleTabChange('government')}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'government' && styles.activeTabText,
                ]}
              >
                Government Official
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder={getUsernamePlaceholder()}
              placeholderTextColor="#4D7399"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#4D7399"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          {/* Forgot Password - Updated with proper navigation */}
          <TouchableOpacity 
            style={styles.forgotContainer}
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text style={[
              styles.forgotText, 
              isLoading && styles.disabledText
            ]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.loginButtonText}>  Signing in...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <Text style={styles.dividerText}>Or</Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[styles.signUpButton, isLoading && styles.secondaryButtonDisabled]}
            onPress={handleNavigateToSignup}
            disabled={isLoading}
          >
            <Text style={[
              styles.signUpButtonText,
              isLoading && styles.disabledText
            ]}>
              Sign Up
            </Text>
          </TouchableOpacity>

          {/* Terms and Privacy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText}>Terms of Service</Text> and{'\n'}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'flex-start',
    top: 20,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0D141C',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#4D7399',
    textAlign: 'center',
    lineHeight: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8EDF2',
    borderRadius: 8,
    padding: 4,
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4D7399',
  },
  activeTabText: {
    color: '#0D141C',
    fontWeight: '600',
  },
  formContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#E8EDF2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0D141C',
    marginBottom: 16,
    minHeight: 56,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotText: {
    fontSize: 16,
    color: '#4D7399',
    fontWeight: '500',
    textDecorationLine: 'underline', // Added underline for better UX
  },
  loginButton: {
    backgroundColor: '#26303B',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 56,
  },
  buttonDisabled: {
    backgroundColor: '#4D7399',
    opacity: 0.6,
  },
  secondaryButtonDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dividerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerText: {
    fontSize: 16,
    color: '#4D7399',
    fontWeight: '500',
  },
  signUpButton: {
    backgroundColor: '#E8EDF2',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
    minHeight: 56,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#26303B',
  },
  disabledText: {
    color: '#9CA3AF',
    textDecorationLine: 'none',
  },
  termsContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  termsText: {
    fontSize: 14,
    color: '#4D7399',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: '#4D7399',
    fontWeight: '600',
  },
});

export default GovLinkLogin;

