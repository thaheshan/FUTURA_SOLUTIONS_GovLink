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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';

import { RootStackParamList } from '../../../Navigation/AppNavigator';
import TabNavigator from '../../../Navigation/TabNavigator';
import { servicesApi } from '../../../Services/API/ServiceAPI';

type NICReissueApplicationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NICReissueApplication'>;
};

interface NICFormData {
  fullName: string;
  dateOfBirth: string;
  nicNumber: string;
  fathersName: string;
  mothersName: string;
  previousAddress: string;
  policeReportNumber: string;
  currentAddress: string;
  maritalStatus: string;
  nameChange: string;
  contactNumber: string;
}

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

const ChevronDownIcon = ({ color = '#64748B', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const NICReissueApplicationScreen: React.FC<NICReissueApplicationScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<NICFormData>({
    fullName: '',
    dateOfBirth: '',
    nicNumber: '',
    fathersName: '',
    mothersName: '',
    previousAddress: '',
    policeReportNumber: '',
    currentAddress: '',
    maritalStatus: '',
    nameChange: '',
    contactNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [showMaritalStatusDropdown, setShowMaritalStatusDropdown] = useState(false);

  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

  const handleInputChange = (field: keyof NICFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const validateForm = (): boolean => {
    const requiredFields = ['fullName', 'dateOfBirth', 'fathersName', 'mothersName', 'currentAddress', 'contactNumber'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof NICFormData].trim()) {
        Alert.alert('Validation Error', `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate date format (basic check)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.dateOfBirth)) {
      Alert.alert('Validation Error', 'Please enter date of birth in YYYY-MM-DD format');
      return false;
    }

    // Validate contact number (basic check)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.contactNumber.replace(/\s/g, ''))) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit contact number');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Submit application to API
      const result = await servicesApi.submitNICApplication({
        ...formData,
        applicationType: 'reissue',
        documents: []
      });

      Alert.alert(
        'Application Submitted Successfully!',
        `Your reference number is: ${result.referenceNumber}\n\nPlease save this reference number for tracking your application.`,
        [
          {
            text: 'Track Application',
            onPress: () => {
              navigation.navigate('ApplicationTracking', { 
                trackingNumber: result.referenceNumber 
              });
            }
          },
          {
            text: 'Continue to Payment',
            onPress: () => {
              navigation.navigate('Payment', {
                serviceType: 'reissue',
                applicationData: formData,
                referenceNumber: result.referenceNumber,
                amount: 1000
              });
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('NIC Application submission error:', error);
      
      Alert.alert(
        'Submission Failed',
        error.message || 'Failed to submit application. Please check your internet connection and try again.',
        [
          {
            text: 'Retry',
            onPress: handleSubmit
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = Object.values(formData).some(value => value.trim() !== '') && !loading;

  const handleMaritalStatusSelect = (status: string) => {
    handleInputChange('maritalStatus', status);
    setShowMaritalStatusDropdown(false);
  };

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
            disabled={loading}
          >
            <BackArrowIcon color="#0F172A" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NIC Re-Issue Application</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4D7399" />
            <Text style={styles.loadingText}>Submitting Application...</Text>
          </View>
        )}

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={!loading}
        >
          {/* Identity Confirmation Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Identity Confirmation</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={[styles.textInput, loading && styles.disabledInput]}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth *</Text>
              <TextInput
                style={[styles.textInput, loading && styles.disabledInput]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={formData.dateOfBirth}
                onChangeText={(value) => handleInputChange('dateOfBirth', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>NIC Number (if known)</Text>
              <TextInput
                style={[styles.textInput, loading && styles.disabledInput]}
                placeholder="Enter your NIC number"
                placeholderTextColor="#9CA3AF"
                value={formData.nicNumber}
                onChangeText={(value) => handleInputChange('nicNumber', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Father's Full Name *</Text>
              <TextInput
                style={[styles.textInput, loading && styles.disabledInput]}
                placeholder="Enter father's full name"
                placeholderTextColor="#9CA3AF"
                value={formData.fathersName}
                onChangeText={(value) => handleInputChange('fathersName', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mother's Full Name *</Text>
              <TextInput
                style={[styles.textInput, loading && styles.disabledInput]}
                placeholder="Enter mother's full name"
                placeholderTextColor="#9CA3AF"
                value={formData.mothersName}
                onChangeText={(value) => handleInputChange('mothersName', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Previous Address</Text>
              <TextInput
                style={[styles.textInput, styles.textArea, loading && styles.disabledInput]}
                placeholder="Enter your previous address"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                value={formData.previousAddress}
                onChangeText={(value) => handleInputChange('previousAddress', value)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Incident Details Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Incident Details (if applicable)</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Police Report Number (for stolen NICs)</Text>
              <TextInput
                style={[styles.textInput, loading && styles.disabledInput]}
                placeholder="Enter police report number"
                placeholderTextColor="#9CA3AF"
                value={formData.policeReportNumber}
                onChangeText={(value) => handleInputChange('policeReportNumber', value)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Changes Since Last NIC Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Changes Since Last NIC</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Address *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea, loading && styles.disabledInput]}
                placeholder="Enter your current address"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                value={formData.currentAddress}
                onChangeText={(value) => handleInputChange('currentAddress', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Marital Status</Text>
              <TouchableOpacity 
                style={[styles.selectInput, loading && styles.disabledInput]} 
                activeOpacity={0.7}
                onPress={() => !loading && setShowMaritalStatusDropdown(!showMaritalStatusDropdown)}
                disabled={loading}
              >
                <Text style={[styles.selectText, !formData.maritalStatus && styles.placeholder]}>
                  {formData.maritalStatus || 'Select marital status'}
                </Text>
                <ChevronDownIcon color="#64748B" size={16} />
              </TouchableOpacity>
              
              {showMaritalStatusDropdown && (
                <View style={styles.dropdown}>
                  {maritalStatusOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => handleMaritalStatusSelect(option)}
                    >
                      <Text style={styles.dropdownItemText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name Change (if applicable)</Text>
              <TextInput
                style={[styles.textInput, loading && styles.disabledInput]}
                placeholder="Enter new name if changed"
                placeholderTextColor="#9CA3AF"
                value={formData.nameChange}
                onChangeText={(value) => handleInputChange('nameChange', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contact Number *</Text>
              <TextInput
                style={[styles.textInput, loading && styles.disabledInput]}
                placeholder="Enter your contact number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={formData.contactNumber}
                onChangeText={(value) => handleInputChange('contactNumber', value)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!canSubmit || loading) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={!canSubmit || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={[
                  styles.submitButtonText,
                  (!canSubmit || loading) && styles.submitButtonTextDisabled
                ]}>
                  Submit Application
                </Text>
              )}
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#F8FAFC',
    color: '#94A3B8',
  },
  selectInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectText: {
    fontSize: 16,
    color: '#0F172A',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#0F172A',
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

export default NICReissueApplicationScreen;