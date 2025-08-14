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
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigation/AppNavigator';

type RegistrationStep = 'details' | 'contact' | 'address' | 'password' | 'nic';

type RegistrationFlowProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Registration'>;
};

const RegistrationFlow: React.FC<RegistrationFlowProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('details');
  const [formData, setFormData] = useState({
    fullName: '',
    nicNumber: '',
    mobileNumber: '+94',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getProgressDots = () => {
    const steps = ['details', 'contact', 'address', 'password', 'nic'];
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

  const handleNext = () => {
    const stepOrder: RegistrationStep[] = ['details', 'contact', 'address', 'password', 'nic'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: RegistrationStep[] = ['details', 'contact', 'address', 'password', 'nic'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    } else {
      navigation.goBack();
    }
  };

  const handleFinishRegistration = () => {
    // Navigate to OTP verification with mobile number
    navigation.navigate('OTPVerification', { 
      mobileNumber: formData.mobileNumber,
      fromScreen: 'registration'
    });
  };

  const renderDetailsStep = () => (
    <>
      <Text style={styles.title}>Register</Text>
      {getProgressDots()}
      <Text style={styles.stepTitle}>Enter your details</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name (as per NIC)"
        placeholderTextColor="#4D7399"
        value={formData.fullName}
        onChangeText={(text) => updateFormData('fullName', text)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="National Identity Card (NIC) Number"
        placeholderTextColor="#4D7399"
        value={formData.nicNumber}
        onChangeText={(text) => updateFormData('nicNumber', text)}
      />
      
      <Text style={styles.exampleText}>Example: 198512345678 or 85123456V</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderContactStep = () => (
    <>
      <Text style={styles.title}>Contact Information</Text>
      {getProgressDots()}
      
      <Text style={styles.fieldLabel}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder="+94"
        placeholderTextColor="#4D7399"
        value={formData.mobileNumber}
        onChangeText={(text) => updateFormData('mobileNumber', text)}
        keyboardType="phone-pad"
      />
      
      <Text style={styles.fieldLabel}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#4D7399"
        value={formData.email}
        onChangeText={(text) => updateFormData('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderAddressStep = () => (
    <>
      <Text style={styles.title}>Address Details</Text>
      {getProgressDots()}
      
      <Text style={styles.fieldLabel}>Residential Address Line 1</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your address"
        placeholderTextColor="#4D7399"
        value={formData.addressLine1}
        onChangeText={(text) => updateFormData('addressLine1', text)}
      />
      
      <Text style={styles.fieldLabel}>Residential Address Line 2 (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your address"
        placeholderTextColor="#4D7399"
        value={formData.addressLine2}
        onChangeText={(text) => updateFormData('addressLine2', text)}
      />
      
      <Text style={styles.fieldLabel}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your city"
        placeholderTextColor="#4D7399"
        value={formData.city}
        onChangeText={(text) => updateFormData('city', text)}
      />
      
      <Text style={styles.fieldLabel}>District</Text>
      <TouchableOpacity style={styles.dropdown}>
        <Text style={[styles.dropdownText, !formData.district && styles.placeholderText]}>
          {formData.district || 'Select'}
        </Text>
        <Ionicons name="chevron-up" size={20} color="#4D7399" />
        <Ionicons name="chevron-down" size={20} color="#4D7399" style={styles.chevronDown} />
      </TouchableOpacity>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <Text style={styles.title}>Create Account</Text>
      {getProgressDots()}
      
      <Text style={styles.fieldLabel}>Create Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your password"
          placeholderTextColor="#4D7399"
          value={formData.password}
          onChangeText={(text) => updateFormData('password', text)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.eyeIcon}>
          <Ionicons name="eye-outline" size={20} color="#4D7399" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.fieldLabel}>Confirm Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Re-enter your password"
          placeholderTextColor="#4D7399"
          value={formData.confirmPassword}
          onChangeText={(text) => updateFormData('confirmPassword', text)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.eyeIcon}>
          <Ionicons name="eye-outline" size={20} color="#4D7399" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => updateFormData('agreeTerms', !formData.agreeTerms)}
        >
          {formData.agreeTerms && <Ionicons name="checkmark" size={16} color="#0D141C" />}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>
          I agree to the Terms and Conditions{'\n'}
          <Text style={styles.linkText}>Read Terms and Conditions</Text>
        </Text>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Complete Registration</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderNICStep = () => (
    <>
      <Text style={styles.title}>Register</Text>
      {getProgressDots()}
      <Text style={styles.stepTitle}>Include Your Proof of NIC</Text>
      
      <View style={styles.nicContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/300x180/E8EDF2/4D7399?text=NIC+Image' }}
          style={styles.nicImage}
        />
      </View>
      
      <View style={styles.nicButtonContainer}>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton}>
          <Text style={styles.captureButtonText}>CAPTURE</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.finishButton} onPress={handleFinishRegistration}>
        <Text style={styles.finishButtonText}>Finish</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backArrow} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#0D141C" />
        </TouchableOpacity>
        
        <View style={styles.content}>
          {currentStep === 'details' && renderDetailsStep()}
          {currentStep === 'contact' && renderContactStep()}
          {currentStep === 'address' && renderAddressStep()}
          {currentStep === 'password' && renderPasswordStep()}
          {currentStep === 'nic' && renderNICStep()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backArrow: {
    padding: 24,
    paddingBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0D141C',
    textAlign: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0D141C',
    marginBottom: 30,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#0D141C',
  },
  inactiveDot: {
    backgroundColor: '#E8EDF2',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0D141C',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#E8EDF2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0D141C',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#4D7399',
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#E8EDF2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#0D141C',
    flex: 1,
  },
  placeholderText: {
    color: '#4D7399',
  },
  chevronDown: {
    marginLeft: -20,
  },
  passwordContainer: {
    backgroundColor: '#E8EDF2',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 40,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4D7399',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxText: {
    fontSize: 14,
    color: '#0D141C',
    flex: 1,
    lineHeight: 20,
  },
  linkText: {
    color: '#4D7399',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginTop: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    gap: 16,
  },
  nextButton: {
    backgroundColor: '#0D141C',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flex: 1,
    alignItems: 'center',
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
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 80,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D141C',
  },
  nicContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  nicImage: {
    width: 300,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#E8EDF2',
  },
  nicButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  retryButton: {
    backgroundColor: '#E8EDF2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    minWidth: 80,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D141C',
  },
  captureButton: {
    backgroundColor: '#0D141C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    flex: 1,
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  finishButton: {
    backgroundColor: '#0D141C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default RegistrationFlow;