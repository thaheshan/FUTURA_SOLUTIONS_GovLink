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

type NICReissueApplicationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NICReissueApplication'>;
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

const ChevronDownIcon = ({ color = '#64748B', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const NICReissueApplicationScreen: React.FC<NICReissueApplicationScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    // Navigate to Payment screen with proper parameters
    navigation.navigate('Payment', {
      serviceType: 'reissue',
      applicationData: formData,
      amount: 1000 // Adjust the amount as needed
    });
  };

  const canSubmit = Object.values(formData).some(value => value.trim() !== '');

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
          <Text style={styles.headerTitle}>NIC Re-Issue Application</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Identity Confirmation Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Identity Confirmation</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={formData.dateOfBirth}
                onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>NIC Number (if known)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your NIC number"
                placeholderTextColor="#9CA3AF"
                value={formData.nicNumber}
                onChangeText={(value) => handleInputChange('nicNumber', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Father's Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter father's full name"
                placeholderTextColor="#9CA3AF"
                value={formData.fathersName}
                onChangeText={(value) => handleInputChange('fathersName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mother's Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter mother's full name"
                placeholderTextColor="#9CA3AF"
                value={formData.mothersName}
                onChangeText={(value) => handleInputChange('mothersName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Previous Address</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Enter your previous address"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                value={formData.previousAddress}
                onChangeText={(value) => handleInputChange('previousAddress', value)}
              />
            </View>
          </View>

          {/* Incident Details Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Incident Details (if applicable)</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Police Report Number (for stolen NICs)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter police report number"
                placeholderTextColor="#9CA3AF"
                value={formData.policeReportNumber}
                onChangeText={(value) => handleInputChange('policeReportNumber', value)}
              />
            </View>
          </View>

          {/* Changes Since Last NIC Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Changes Since Last NIC</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Address</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Enter your current address"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                value={formData.currentAddress}
                onChangeText={(value) => handleInputChange('currentAddress', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Marital Status</Text>
              <TouchableOpacity style={styles.selectInput} activeOpacity={0.7}>
                <Text style={[styles.selectText, !formData.maritalStatus && styles.placeholder]}>
                  {formData.maritalStatus || 'Select marital status'}
                </Text>
                <ChevronDownIcon color="#64748B" size={16} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name Change (if applicable)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter new name if changed"
                placeholderTextColor="#9CA3AF"
                value={formData.nameChange}
                onChangeText={(value) => handleInputChange('nameChange', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contact Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your contact number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={formData.contactNumber}
                onChangeText={(value) => handleInputChange('contactNumber', value)}
              />
            </View>
          </View>

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
                Continue to Payment
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