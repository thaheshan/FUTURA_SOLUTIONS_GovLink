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

type NICReissueOverviewScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NICReissueOverview'>;
};

interface IconProps {
  color?: string;
  size?: number;
}

const BackArrowIcon: React.FC<IconProps> = ({ color = '#0F172A', size = 24 }) => (
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

const ClockIcon: React.FC<IconProps> = ({ color = '#4D7399', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path 
      d="M12 6V12L16 14" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const DollarIcon: React.FC<IconProps> = ({ color = '#4D7399', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 1V23" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path 
      d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const DocumentIcon: React.FC<IconProps> = ({ color = '#4D7399', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path 
      d="M14 2V8H20" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const InfoIcon: React.FC<IconProps> = ({ color = '#4D7399', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path 
      d="M12 16V12" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <Path 
      d="M12 8H12.01" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

interface Reason {
  id: string;
  label: string;
}

interface Document {
  id: string;
  label: string;
}

const NICReissueOverviewScreen: React.FC<NICReissueOverviewScreenProps> = ({ navigation }) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const reasons: Reason[] = [
    { id: 'lost', label: 'Lost or stolen NIC' },
    { id: 'damaged', label: 'Damaged or illegible NIC' },
    { id: 'changes', label: 'Changes in personal information (e.g., name, address)' },
  ];

  const documents: Document[] = [
    { id: '1', label: 'Application form (available at the Land Division office)' },
    { id: '2', label: 'Original birth certificate' },
    { id: '3', label: 'Police report (for lost or stolen NIC)' },
    { id: '4', label: 'Supporting documents for changes in personal information (e.g., marriage certificate)' },
  ];

  const handleReasonToggle = (reasonId: string): void => {
    setSelectedReasons(prev => 
      prev.includes(reasonId) 
        ? prev.filter(id => id !== reasonId)
        : [...prev, reasonId]
    );
  };

  const handleBack = (): void => {
    navigation.goBack();
  };

  const handleContinue = (): void => {
    navigation.navigate('NICReissueOverview');
  };

  const canContinue = selectedReasons.length > 0;

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
            accessible={true}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <BackArrowIcon color="#0F172A" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NIC Re-Issue</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Overview Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <InfoIcon color="#4D7399" size={24} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoText}>
                  The National Identity Card (NIC) is a crucial document for all citizens. Re-issuance may be necessary due to loss, damage, or changes in personal information.
                </Text>
              </View>
            </View>
          </View>

          {/* Reasons for Re-Issue Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Reasons for Re-Issue</Text>
            <Text style={styles.sectionSubtitle}>Select the reason(s) that apply to your situation</Text>
            
            <View style={styles.reasonsContainer}>
              {reasons.map((reason) => (
                <TouchableOpacity
                  key={reason.id}
                  style={[
                    styles.reasonItem,
                    selectedReasons.includes(reason.id) && styles.reasonItemSelected
                  ]}
                  onPress={() => handleReasonToggle(reason.id)}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityLabel={`${reason.label} ${selectedReasons.includes(reason.id) ? 'selected' : 'not selected'}`}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selectedReasons.includes(reason.id) }}
                >
                  <View style={[
                    styles.checkbox, 
                    selectedReasons.includes(reason.id) && styles.checkboxChecked
                  ]}>
                    {selectedReasons.includes(reason.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={[
                    styles.reasonText,
                    selectedReasons.includes(reason.id) && styles.reasonTextSelected
                  ]}>
                    {reason.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Required Documents Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Required Documents</Text>
            <View style={styles.documentsCard}>
              <View style={styles.documentsHeader}>
                <DocumentIcon color="#4D7399" size={24} />
                <Text style={styles.documentsHeaderText}>Documents you'll need to bring</Text>
              </View>
              
              <View style={styles.documentsContainer}>
                {documents.map((document) => (
                  <View key={document.id} style={styles.documentItem}>
                    <View style={styles.documentBullet} />
                    <Text style={styles.documentText}>{document.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Processing Information Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Processing Information</Text>
            
            {/* Processing Time */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <ClockIcon color="#4D7399" size={24} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Processing Time</Text>
                <Text style={styles.infoText}>
                  Standard processing time is approximately 2-3 weeks. Expedited services may be available for an additional fee.
                </Text>
              </View>
            </View>

            {/* Fees */}
            <View style={styles.feesCard}>
              <View style={styles.feesHeader}>
                <DollarIcon color="#4D7399" size={24} />
                <Text style={styles.feesHeaderText}>Service Fees</Text>
              </View>
              
              <View style={styles.feesContainer}>
                <View style={styles.feeItem}>
                  <Text style={styles.feeLabel}>Re-issuance fee</Text>
                  <Text style={styles.feeAmount}>Rs. 500</Text>
                </View>
                <View style={styles.feeDivider} />
                <View style={styles.feeItem}>
                  <Text style={styles.feeLabel}>Expedited service fee (optional)</Text>
                  <Text style={styles.feeAmount}>Rs. 1,000</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.continueButton,
                !canContinue && styles.continueButtonDisabled
              ]}
              onPress={handleContinue}
              activeOpacity={0.8}
              disabled={!canContinue}
              accessible={true}
              accessibilityLabel={canContinue ? "Start Application" : "Please select a reason to continue"}
              accessibilityRole="button"
            >
              <Text style={[
                styles.continueButtonText,
                !canContinue && styles.continueButtonTextDisabled
              ]}>
                Start Application
              </Text>
            </TouchableOpacity>
            
            {!canContinue && (
              <Text style={styles.buttonHelpText}>
                Please select at least one reason for re-issuance to continue
              </Text>
            )}
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
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#EBF4FF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  reasonsContainer: {
    gap: 12,
  },
  reasonItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reasonItemSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#4D7399',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
  reasonText: {
    fontSize: 16,
    color: '#0F172A',
    flex: 1,
    lineHeight: 22,
  },
  reasonTextSelected: {
    color: '#1E40AF',
    fontWeight: '500',
  },
  documentsCard: {
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
  documentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  documentsHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  documentsContainer: {
    gap: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  documentBullet: {
    width: 6,
    height: 6,
    backgroundColor: '#4D7399',
    borderRadius: 3,
    marginTop: 8,
    flexShrink: 0,
  },
  documentText: {
    fontSize: 15,
    color: '#64748B',
    flex: 1,
    lineHeight: 22,
  },
  feesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  feesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  feesHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  feesContainer: {
    gap: 16,
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  feeLabel: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  feeAmount: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '700',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  continueButton: {
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
  continueButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  continueButtonTextDisabled: {
    color: '#94A3B8',
  },
  buttonHelpText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default NICReissueOverviewScreen;