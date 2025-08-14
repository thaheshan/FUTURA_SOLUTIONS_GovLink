// Screens/Auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigation/AppNavigator';

type ForgotPasswordStep = 'identifier' | 'verification' | 'newPassword';

type ForgotPasswordProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
};

interface ForgotPasswordFormData {
  identifier: string; // Can be email or mobile number
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>('identifier');
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    identifier: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [identifierType, setIdentifierType] = useState<'email' | 'mobile'>('email');
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleInputChange = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get step titles
  const getStepTitle = (): string => {
    switch (currentStep) {
      case 'identifier':
        return 'Reset Password';
      case 'verification':
        return 'Verify Code';
      case 'newPassword':
        return 'Create New Password';
      default:
        return 'Reset Password';
    }
  };

  // Get progress dots
  const getProgressDots = () => {
    const steps = ['identifier', 'verification', 'newPassword'];
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View
            key={step}
            style={[
              styles.progressDot,
              index <= currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  // Detect identifier type (email or mobile)
  const detectIdentifierType = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sriLankaMobileRegex = /^(\+94|0)?[0-9]{9}$/;
    
    if (emailRegex.test(text) || text.includes('@')) {
      setIdentifierType('email');
    } else if (sriLankaMobileRegex.test(text.replace(/\s/g, '')) || text.startsWith('+94') || /^\d+$/.test(text)) {
      setIdentifierType('mobile');
    }
  };

  // Validate identifier
  const validateIdentifier = (identifier: string): boolean => {
    if (identifierType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(identifier);
    } else {
      const sriLankaMobileRegex = /^(\+94|0)?[0-9]{9}$/;
      return sriLankaMobileRegex.test(identifier.replace(/\s/g, ''));
    }
  };

  // Validate password
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  // Handle send verification code
  const handleSendCode = async () => {
    if (!formData.identifier.trim()) {
      Alert.alert('Error', 'Please enter your email or mobile number');
      return;
    }

    if (!validateIdentifier(formData.identifier)) {
      Alert.alert(
        'Invalid Format',
        `Please enter a valid ${identifierType === 'email' ? 'email address' : 'mobile number'}`
      );
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call to send verification code
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Verification Code Sent',
        `A 6-digit verification code has been sent to your ${identifierType === 'email' ? 'email' : 'mobile number'}.`,
        [
          {
            text: 'OK',
            onPress: () => setCurrentStep('verification')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verify code
  const handleVerifyCode = async () => {
    if (!formData.verificationCode.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }
    
    if (formData.verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock verification - you can replace this with actual API call
      if (formData.verificationCode === '123456') {
        setCurrentStep('newPassword');
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    if (!formData.newPassword.trim() || !formData.confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in both password fields');
      return;
    }
    
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      Alert.alert('Invalid Password', passwordError);
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Your password has been reset successfully! You can now log in with your new password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep === 'identifier') {
      navigation.goBack();
    } else if (currentStep === 'verification') {
      setCurrentStep('identifier');
    } else if (currentStep === 'newPassword') {
      setCurrentStep('verification');
    }
  };

  // Handle navigation to login
  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  // Render identifier step
  const renderIdentifierStep = () => (
    <>
      <Text style={styles.subtitle}>
        Enter your email or mobile number to receive a verification code
      </Text>
      
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email or mobile number"
          placeholderTextColor="#4D7399"
          value={formData.identifier}
          onChangeText={(text) => {
            handleInputChange('identifier', text);
            detectIdentifierType(text);
          }}
          keyboardType={identifierType === 'email' ? 'email-address' : 'phone-pad'}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />
      </View>
      
      <Text style={styles.exampleText}>
        Example: example@email.com or +94771234567
      </Text>
      
      <TouchableOpacity 
        style={[styles.primaryButton, isLoading && styles.buttonDisabled]} 
        onPress={handleSendCode}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>  Sending...</Text>
          </View>
        ) : (
          <Text style={styles.primaryButtonText}>Send Verification Code</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.backToLoginContainer}>
        <Text style={styles.backToLoginText}>Remember your password? </Text>
        <TouchableOpacity 
          onPress={handleNavigateToLogin} 
          disabled={isLoading}
        >
          <Text style={[styles.linkText, isLoading && styles.disabledText]}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // Render verification step
  const renderVerificationStep = () => (
    <>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to your {identifierType === 'email' ? 'email' : 'mobile number'}
      </Text>
      
      <View style={styles.identifierDisplay}>
        <Text style={styles.identifierText}>{formData.identifier}</Text>
      </View>
      
      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder="Enter 6-digit code"
          placeholderTextColor="#4D7399"
          value={formData.verificationCode}
          onChangeText={(text) => 
            handleInputChange('verificationCode', text.replace(/\D/g, '').slice(0, 6))
          }
          keyboardType="numeric"
          maxLength={6}
          textAlign="center"
          editable={!isLoading}
        />
      </View>
      
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <TouchableOpacity 
          onPress={handleSendCode} 
          disabled={isLoading}
        >
          <Text style={[styles.linkText, isLoading && styles.disabledText]}>
            Resend Code
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.backButton, isLoading && styles.backButtonDisabled]} 
          onPress={handleBack}
          disabled={isLoading}
        >
          <Text style={[styles.backButtonText, isLoading && styles.disabledText]}>
            Back
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.nextButton, isLoading && styles.buttonDisabled]} 
          onPress={handleVerifyCode}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.nextButtonText}>  Verifying...</Text>
            </View>
          ) : (
            <Text style={styles.nextButtonText}>Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  // Render new password step
  const renderNewPasswordStep = () => (
    <>
      <Text style={styles.subtitle}>
        Enter your new password below
      </Text>
      
      <View style={styles.formContainer}>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your new password"
            placeholderTextColor="#4D7399"
            value={formData.newPassword}
            onChangeText={(text) => handleInputChange('newPassword', text)}
            secureTextEntry={!isPasswordVisible}
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            disabled={isLoading}
          >
            <Ionicons 
              name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color={isLoading ? "#9CA3AF" : "#4D7399"} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Re-enter your new password"
            placeholderTextColor="#4D7399"
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            secureTextEntry={!isConfirmPasswordVisible}
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
            disabled={isLoading}
          >
            <Ionicons 
              name={isConfirmPasswordVisible ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color={isLoading ? "#9CA3AF" : "#4D7399"} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.passwordHint}>
        Password must be at least 8 characters with uppercase, lowercase, and number
      </Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.backButton, isLoading && styles.backButtonDisabled]} 
          onPress={handleBack}
          disabled={isLoading}
        >
          <Text style={[styles.backButtonText, isLoading && styles.disabledText]}>
            Back
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.nextButton, isLoading && styles.buttonDisabled]} 
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.nextButtonText}>  Resetting...</Text>
            </View>
          ) : (
            <Text style={styles.nextButtonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

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
          {/* Header with back button */}
          <TouchableOpacity 
            style={styles.backArrow} 
            onPress={handleBack} 
            disabled={isLoading}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isLoading ? "#9CA3AF" : "#0D141C"} 
            />
          </TouchableOpacity>

          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/favicon/favicon/Logo-GovLink.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Title and Progress */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{getStepTitle()}</Text>
            {getProgressDots()}
          </View>

          {/* Content based on current step */}
          {currentStep === 'identifier' && renderIdentifierStep()}
          {currentStep === 'verification' && renderVerificationStep()}
          {currentStep === 'newPassword' && renderNewPasswordStep()}

          {/* Terms and Privacy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLinkText}>Terms of Service</Text> and{'\n'}
              <Text style={styles.termsLinkText}>Privacy Policy</Text>.
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
  backArrow: {
    paddingTop: 20,
    paddingBottom: 10,
    alignSelf: 'flex-start',
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0D141C',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4D7399',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#26303B',
  },
  inactiveDot: {
    backgroundColor: '#E8EDF2',
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
  codeInput: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 4,
    textAlign: 'center',
  },
  identifierDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  identifierText: {
    fontSize: 14,
    color: '#0D141C',
    fontWeight: '500',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  exampleText: {
    fontSize: 14,
    color: '#4D7399',
    marginBottom: 24,
  },
  passwordHint: {
    fontSize: 14,
    color: '#4D7399',
    marginBottom: 24,
    lineHeight: 20,
  },
  passwordContainer: {
    backgroundColor: '#E8EDF2',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 56,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0D141C',
  },
  eyeIcon: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  primaryButton: {
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  nextButton: {
    backgroundColor: '#26303B',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flex: 1,
    alignItems: 'center',
    minHeight: 56,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    backgroundColor: '#E8EDF2',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    minWidth: 100,
    minHeight: 56,
  },
  backButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#26303B',
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backToLoginText: {
    fontSize: 14,
    color: '#4D7399',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    color: '#4D7399',
  },
  linkText: {
    color: '#4D7399',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  disabledText: {
    color: '#9CA3AF',
    textDecorationLine: 'none',
  },
  termsContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  termsText: {
    fontSize: 14,
    color: '#4D7399',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLinkText: {
    color: '#4D7399',
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;

