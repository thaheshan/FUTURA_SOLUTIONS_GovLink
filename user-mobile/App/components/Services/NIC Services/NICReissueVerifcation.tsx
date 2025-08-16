import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';

import { RootStackParamList } from '../../../Navigation/AppNavigator';
import TabNavigator from '../../../Navigation/TabNavigator';

type NICSecurityVerificationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NICSecurityVerification'>;
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

const NICSecurityVerificationScreen: React.FC<NICSecurityVerificationScreenProps> = ({ navigation }) => {
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  const verificationMethods = [
    {
      id: 'photo',
      title: 'Current photograph matching',
      description: 'Upload a recent photograph for identity verification'
    },
    {
      id: 'fingerprint',
      title: 'Fingerprint verification',
      description: 'Biometric verification using fingerprint scan'
    },
    {
      id: 'reference',
      title: 'Reference person contact',
      description: 'Contact details of a reference person who can verify your identity'
    },
    {
      id: 'address',
      title: 'Address verification visit (if needed)',
      description: 'Physical verification of your current address'
    },
    {
      id: 'fraud',
      title: 'Fraud prevention checks',
      description: 'Additional security checks to prevent identity fraud'
    },
  ];

  const handleMethodToggle = (methodId: string) => {
    setSelectedMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    // Navigate to Payment screen with proper parameters
    navigation.navigate('Payment', {
      serviceType: 'reissue',
      applicationData: {
        selectedVerificationMethods: selectedMethods,
        verificationMethodsData: verificationMethods.filter(method => 
          selectedMethods.includes(method.id)
        ),
        verificationTimestamp: new Date().toISOString()
      },
      amount: 2000 // Adjust the amount as needed for security verification
    });
  };

  const canSubmit = selectedMethods.length > 0;

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
          <Text style={styles.headerTitle}>Enhanced Security Verification</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.descriptionText}>
              To ensure the security of your National Identity Card (NIC) re-issue, we require enhanced verification. Please select the methods you can complete:
            </Text>

            <View style={styles.methodsContainer}>
              {verificationMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    selectedMethods.includes(method.id) && styles.methodCardSelected
                  ]}
                  onPress={() => handleMethodToggle(method.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.methodContent}>
                    <View style={styles.methodLeft}>
                      <View style={[
                        styles.checkbox,
                        selectedMethods.includes(method.id) && styles.checkboxSelected
                      ]}>
                        {selectedMethods.includes(method.id) && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                      <View style={styles.methodInfo}>
                        <Text style={[
                          styles.methodTitle,
                          selectedMethods.includes(method.id) && styles.methodTitleSelected
                        ]}>
                          {method.title}
                        </Text>
                        <Text style={[
                          styles.methodDescription,
                          selectedMethods.includes(method.id) && styles.methodDescriptionSelected
                        ]}>
                          {method.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {selectedMethods.length > 0 && (
              <View style={styles.selectionSummary}>
                <Text style={styles.selectionSummaryTitle}>
                  Selected Verification Methods ({selectedMethods.length})
                </Text>
                <Text style={styles.selectionSummaryText}>
                  You have selected {selectedMethods.length} verification method{selectedMethods.length > 1 ? 's' : ''}. 
                  These will be used to verify your identity during the NIC re-issue process.
                </Text>
              </View>
            )}
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
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
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
  descriptionText: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 24,
  },
  methodsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  methodCardSelected: {
    borderColor: '#4D7399',
    backgroundColor: '#EBF4FF',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
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
    marginTop: 2,
  },
  checkboxSelected: {
    backgroundColor: '#4D7399',
    borderColor: '#4D7399',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  methodTitleSelected: {
    color: '#4D7399',
  },
  methodDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  methodDescriptionSelected: {
    color: '#1E40AF',
  },
  selectionSummary: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  selectionSummaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 8,
  },
  selectionSummaryText: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
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
    height: 100,
  },
});

export default NICSecurityVerificationScreen;

