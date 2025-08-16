import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';

import { RootStackParamList } from '../../../Navigation/AppNavigator';
import TabNavigator from '../../../Navigation/TabNavigator';

type NICReissueVerificationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NICReissueVerification'>;
};

const BackArrowIcon = ({ color = '#0F172A', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M15 18L9 12L15 6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const CheckIcon = ({ color = '#10B981', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M20 6L9 17L4 12" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const NICReissueVerificationScreen: React.FC<NICReissueVerificationScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    currentNICNumber: '',
    phoneNumber: '',
    otp: '',
    address: '',
    mothersMaidenName: '',
    placeOfBirth: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-verify OTP when 6 digits are entered (simulation)
    if (field === 'otp' && value.length === 6) {
      setOtpVerified(true);
    }
  };

  const handleSendOTP = () => {
    if (formData.phoneNumber.trim()) {
      setOtpSent(true);
      // Simulate OTP sending
    }
  };

  const handleUploadPhoto = () => {
    setPhotoUploaded(true);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    // Navigate to NICReissueApplication with proper parameters
    navigation.navigate('NICReissueApplication', {
      reason: 'verified', // or get from previous screen
      verificationData: {
        currentNICNumber: formData.currentNICNumber,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        mothersMaidenName: formData.mothersMaidenName,
        placeOfBirth: formData.placeOfBirth,
        otpVerified: otpVerified,
        photoUploaded: photoUploaded,
        verificationTimestamp: new Date().toISOString()
      }
    });
  };

  const canSendOTP = formData.phoneNumber.trim() !== '';
  const requiredFieldsFilled = formData.currentNICNumber.trim() !== '' && 
                               formData.address.trim() !== '' && 
                               formData.mothersMaidenName.trim() !== '' && 
                               formData.placeOfBirth.trim() !== '';
  const canSubmit = requiredFieldsFilled && otpVerified;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <BackArrowIcon color="#0F172A" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NIC Re-issue</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Basic Information Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Current NIC Number (if known)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your current NIC number"
              placeholderTextColor="#9CA3AF"
              value={formData.currentNICNumber}
              onChangeText={(value) => handleInputChange('currentNICNumber', value)}
            />
          </View>

          {/* Phone Verification Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Phone Number</Text>
            <View style={styles.phoneContainer}>
              <TextInput
                style={[styles.textInput, styles.phoneInput]}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
              />
              <TouchableOpacity 
                style={[
                  styles.otpButton,
                  !canSendOTP && styles.otpButtonDisabled,
                  otpSent && styles.otpButtonSent
                ]}
                onPress={handleSendOTP}
                activeOpacity={0.8}
                disabled={!canSendOTP || otpSent}
              >
                <Text style={[
                  styles.otpButtonText,
                  !canSendOTP && styles.otpButtonTextDisabled,
                  otpSent && styles.otpButtonTextSent
                ]}>
                  {otpSent ? 'Sent' : 'Send OTP'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* OTP Section */}
          {otpSent && (
            <View style={styles.sectionContainer}>
              <View style={styles.otpHeader}>
                <Text style={styles.sectionTitle}>OTP</Text>
                {otpVerified && (
                  <View style={styles.verifiedBadge}>
                    <CheckIcon color="#10B981" size={16} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  otpVerified && styles.textInputVerified
                ]}
                placeholder="Enter OTP"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={6}
                value={formData.otp}
                onChangeText={(value) => handleInputChange('otp', value)}
              />
              <Text style={styles.otpHint}>
                Enter the 6-digit code sent to your phone number
              </Text>
            </View>
          )}

          {/* Address Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Address</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Enter your current address"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
            />
          </View>

          {/* Identity Verification Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Identity Verification</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mother's Maiden Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your mother's maiden name"
                placeholderTextColor="#9CA3AF"
                value={formData.mothersMaidenName}
                onChangeText={(value) => handleInputChange('mothersMaidenName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Place of Birth</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your place of birth"
                placeholderTextColor="#9CA3AF"
                value={formData.placeOfBirth}
                onChangeText={(value) => handleInputChange('placeOfBirth', value)}
              />
            </View>
          </View>

          {/* Photo Verification Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Photo Verification (Optional)</Text>
            <Text style={styles.sectionDescription}>
              For faster processing, upload a recent photo of yourself.
            </Text>
            <TouchableOpacity 
              style={[
                styles.uploadButton,
                photoUploaded && styles.uploadButtonUploaded
              ]} 
              activeOpacity={0.8}
              onPress={handleUploadPhoto}
            >
              {photoUploaded && (
                <CheckIcon color="#10B981" size={20} />
              )}
              <Text style={[
                styles.uploadButtonText,
                photoUploaded && styles.uploadButtonTextUploaded
              ]}>
                {photoUploaded ? 'Photo Uploaded' : 'Upload Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verification Status */}
          {(otpVerified || photoUploaded) && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Verification Status</Text>
              <View style={styles.statusList}>
                <View style={styles.statusItem}>
                  <CheckIcon color="#10B981" size={16} />
                  <Text style={styles.statusText}>Phone number verified</Text>
                </View>
                {photoUploaded && (
                  <View style={styles.statusItem}>
                    <CheckIcon color="#10B981" size={16} />
                    <Text style={styles.statusText}>Photo uploaded</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={!canSubmit}
            >
              <Text style={[
                styles.submitButtonText,
                !canSubmit && styles.submitButtonTextDisabled
              ]}>
                Continue to Application
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Bottom Tab Navigator */}
        <TabNavigator activeTab="Services" />

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  textInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInputVerified: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  phoneInput: {
    flex: 1,
  },
  otpButton: {
    backgroundColor: '#4D7399',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  otpButtonSent: {
    backgroundColor: '#10B981',
  },
  otpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  otpButtonTextDisabled: {
    color: '#94A3B8',
  },
  otpButtonTextSent: {
    color: '#FFFFFF',
  },
  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  verifiedText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  otpHint: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  uploadButton: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonUploaded: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
    borderStyle: 'solid',
  },
  uploadButtonText: {
    color: '#4D7399',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButtonTextUploaded: {
    color: '#10B981',
  },
  statusContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  statusList: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#4D7399',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4D7399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButtonTextDisabled: {
    color: '#94A3B8',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default NICReissueVerificationScreen;

