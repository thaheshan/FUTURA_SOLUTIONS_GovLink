import React from 'react';
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
import Svg, { Path, Circle } from 'react-native-svg';

import { RootStackParamList } from '../../../Navigation/AppNavigator';
import TabNavigator from '../../../Navigation/TabNavigator';

type NICReissueConfirmationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ConfirmationReissue'>;
};

const CheckCircleIcon = ({ color = '#10B981', size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path 
      d="M9 12L11 14L15 10" 
      stroke="#FFFFFF" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
  
);

const NICReissueConfirmationScreen: React.FC<NICReissueConfirmationScreenProps> = ({ navigation }) => {
  const applicationDetails = {
    trackingNumber: '#NIC20240715-RE001',
    applicationType: 'NIC Re-issue',
    reason: 'Lost/Damaged',
    documentsSubmitted: 'Police Report, Affidavit, Birth Certificate Copy',
    applicationFee: 'Rs. 1,000.00',
    estimatedProcessingTime: '7-10 business days',
    nextSteps: 'Your re-issue application will be processed after document verification. You will receive updates via SMS and email. Please bring original documents when collecting your new NIC.'
  };

  const handleDone = () => {
    navigation.navigate('Home');
  };

  const handleTrackStatus = () => {
    navigation.navigate('ComingSoon');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Success Icon */}
          <View style={styles.successContainer}>
            <CheckCircleIcon color="#10B981" size={80} />
            <Text style={styles.successTitle}>NIC Re-issue Application Submitted</Text>
            <Text style={styles.successDescription}>
              Your National Identity Card re-issue application has been successfully submitted. You can track the progress using the tracking number below.
            </Text>
          </View>

          {/* Tracking Number */}
          <View style={styles.trackingContainer}>
            <View style={styles.trackingCard}>
              <Text style={styles.trackingLabel}>Tracking Number</Text>
              <Text style={styles.trackingNumber}>{applicationDetails.trackingNumber}</Text>
            </View>
          </View>

          {/* Application Summary */}
          <View style={styles.sectionContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Application Type</Text>
                <Text style={styles.summaryValue}>{applicationDetails.applicationType}</Text>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Reason for Re-issue</Text>
                <Text style={styles.summaryValue}>{applicationDetails.reason}</Text>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Documents Submitted</Text>
                <Text style={styles.summaryValue}>{applicationDetails.documentsSubmitted}</Text>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Application Fee</Text>
                <Text style={styles.summaryValue}>{applicationDetails.applicationFee}</Text>
              </View>
            </View>
          </View>

          {/* Processing Information */}
          <View style={styles.sectionContainer}>
            <View style={styles.processingCard}>
              <Text style={styles.processingTitle}>Estimated Processing Time: {applicationDetails.estimatedProcessingTime}</Text>
              <Text style={styles.processingDescription}>
                {applicationDetails.nextSteps}
              </Text>
            </View>
          </View>

          {/* Important Note */}
          <View style={styles.sectionContainer}>
            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>Important Reminder</Text>
              <Text style={styles.noteDescription}>
                Your old NIC (if available) will be collected when you receive your new card. Please ensure all provided information is accurate as corrections may require additional processing time.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.trackButton}
              onPress={handleTrackStatus}
              activeOpacity={0.8}
            >
              <Text style={styles.trackButtonText}>Track Status</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={handleDone}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Done</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  trackingContainer: {
    marginBottom: 32,
  },
  trackingCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  trackingLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
  },
  trackingNumber: {
    fontSize: 20,
    color: '#0F172A',
    fontWeight: '700',
    letterSpacing: 1,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  processingCard: {
    backgroundColor: '#EBF4FF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  processingTitle: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '700',
    marginBottom: 12,
  },
  processingDescription: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  noteTitle: {
    fontSize: 16,
    color: '#92400E',
    fontWeight: '700',
    marginBottom: 8,
  },
  noteDescription: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },
  trackButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4D7399',
  },
  trackButtonText: {
    color: '#4D7399',
    fontSize: 16,
    fontWeight: '700',
  },
  doneButton: {
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
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default NICReissueConfirmationScreen;