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
  Modal,
  FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { RootStackParamList } from '../../../Navigation/AppNavigator';

type NICNewApplicationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NICNewApplication'>;
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

const NICNewApplicationScreen: React.FC<NICNewApplicationScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    nationalId: '',
    phoneNumber: '',
    emailAddress: '',
    streetAddress: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    maritalStatus: '',
    dependents: '',
    educationLevel: '',
    profession: '',
  });

  const [checkboxes, setCheckboxes] = useState({
    ageConfirm: false,
    birthCertificate: false,
    addressAccurate: false,
    parentalConsent: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentDropdown, setCurrentDropdown] = useState<string>('');

  // Dropdown options
  const dropdownOptions = {
    gender: ['Male', 'Female', 'Other'],
    maritalStatus: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'],
    educationLevel: [
      'No formal education',
      'Primary education',
      'Secondary education',
      'GCE O/L',
      'GCE A/L',
      'Diploma',
      'Bachelor\'s degree',
      'Master\'s degree',
      'Doctorate',
      'Other'
    ],
    stateProvince: [
      'Western Province',
      'Central Province',
      'Southern Province',
      'Northern Province',
      'Eastern Province',
      'North Western Province',
      'North Central Province',
      'Uva Province',
      'Sabaragamuwa Province'
    ]
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (
    field: 'ageConfirm' | 'birthCertificate' | 'addressAccurate' | 'parentalConsent'
  ) => {
    setCheckboxes(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const openDropdown = (dropdownType: string) => {
    setCurrentDropdown(dropdownType);
    setModalVisible(true);
  };

  const selectOption = (value: string) => {
    handleInputChange(currentDropdown, value);
    setModalVisible(false);
    setCurrentDropdown('');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    // Navigate to Payment screen with new application data
    navigation.navigate('Payment', {
      serviceType: 'new',
      applicationData: formData,
      amount: 500
    });
  };

  const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '');
  const allCheckboxesChecked = Object.values(checkboxes).every(value => value);
  const canProceed = allFieldsFilled && allCheckboxesChecked;

  const renderDropdownModal = () => {
    const options = dropdownOptions[currentDropdown as keyof typeof dropdownOptions] || [];
    
    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {currentDropdown.charAt(0).toUpperCase() + currentDropdown.slice(1)}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => selectOption(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    );
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
          >
            <BackArrowIcon color="#0F172A" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New NIC Application</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Personal Information Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
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
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                value={formData.dateOfBirth}
                onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <TouchableOpacity 
                style={styles.selectInput} 
                activeOpacity={0.7}
                onPress={() => openDropdown('gender')}
              >
                <Text style={[styles.selectText, !formData.gender && styles.placeholder]}>
                  {formData.gender || 'Select gender'}
                </Text>
                <ChevronDownIcon color="#64748B" size={16} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>National ID Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your ID number (if available)"
                placeholderTextColor="#9CA3AF"
                value={formData.nationalId}
                onChangeText={(value) => handleInputChange('nationalId', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                value={formData.emailAddress}
                onChangeText={(value) => handleInputChange('emailAddress', value)}
              />
            </View>
          </View>

          {/* Address Details Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Address Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Street Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your street address"
                placeholderTextColor="#9CA3AF"
                value={formData.streetAddress}
                onChangeText={(value) => handleInputChange('streetAddress', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your city"
                placeholderTextColor="#9CA3AF"
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Province</Text>
              <TouchableOpacity 
                style={styles.selectInput} 
                activeOpacity={0.7}
                onPress={() => openDropdown('stateProvince')}
              >
                <Text style={[styles.selectText, !formData.stateProvince && styles.placeholder]}>
                  {formData.stateProvince || 'Select province'}
                </Text>
                <ChevronDownIcon color="#64748B" size={16} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Postal Code</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your postal code"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData.postalCode}
                onChangeText={(value) => handleInputChange('postalCode', value)}
              />
            </View>
          </View>

          {/* Family Information Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Family Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Marital Status</Text>
              <TouchableOpacity 
                style={styles.selectInput} 
                activeOpacity={0.7}
                onPress={() => openDropdown('maritalStatus')}
              >
                <Text style={[styles.selectText, !formData.maritalStatus && styles.placeholder]}>
                  {formData.maritalStatus || 'Select marital status'}
                </Text>
                <ChevronDownIcon color="#64748B" size={16} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Number of Dependents</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter number of dependents"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData.dependents}
                onChangeText={(value) => handleInputChange('dependents', value)}
              />
            </View>
          </View>

          {/* Educational/Professional Background Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Educational/Professional Background</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Highest Education Level</Text>
              <TouchableOpacity 
                style={styles.selectInput} 
                activeOpacity={0.7}
                onPress={() => openDropdown('educationLevel')}
              >
                <Text style={[styles.selectText, !formData.educationLevel && styles.placeholder]}>
                  {formData.educationLevel || 'Select education level'}
                </Text>
                <ChevronDownIcon color="#64748B" size={16} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Profession</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your profession"
                placeholderTextColor="#9CA3AF"
                value={formData.profession}
                onChangeText={(value) => handleInputChange('profession', value)}
              />
            </View>
          </View>

          {/* Confirmation Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Confirm Your Information</Text>
            
            <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => handleCheckboxChange('ageConfirm')}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, checkboxes.ageConfirm && styles.checkboxChecked]}>
                  {checkboxes.ageConfirm && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>I am 16 years or older.</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => handleCheckboxChange('birthCertificate')}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, checkboxes.birthCertificate && styles.checkboxChecked]}>
                  {checkboxes.birthCertificate && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>I have a valid birth certificate.</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => handleCheckboxChange('addressAccurate')}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, checkboxes.addressAccurate && styles.checkboxChecked]}>
                  {checkboxes.addressAccurate && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>My current address is accurate.</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => handleCheckboxChange('parentalConsent')}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, checkboxes.parentalConsent && styles.checkboxChecked]}>
                  {checkboxes.parentalConsent && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>I have parental consent (if under 18).</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.submitButton, !canProceed && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={!canProceed}
            >
              <Text style={[styles.submitButtonText, !canProceed && styles.submitButtonTextDisabled]}>
                Proceed to Payment
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Dropdown Modal */}
        {renderDropdownModal()}
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
  checkboxContainer: {
    gap: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4D7399',
    borderColor: '#4D7399',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxText: {
    fontSize: 16,
    color: '#0F172A',
    flex: 1,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '85%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#64748B',
    fontWeight: '300',
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  optionText: {
    fontSize: 16,
    color: '#0F172A',
  },
});

export default NICNewApplicationScreen;

