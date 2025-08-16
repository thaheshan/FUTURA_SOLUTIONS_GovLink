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

type NICReissueSelectReasonScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NICReissueSelectReason'>;
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

const NICReissueSelectReasonScreen: React.FC<NICReissueSelectReasonScreenProps> = ({ navigation }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');

  const reasons = [
    { id: 'lost', label: 'Lost NIC', description: 'Your NIC has been lost or misplaced' },
    { id: 'damaged', label: 'Damaged NIC', description: 'Your NIC is damaged, torn, or illegible' },
    { id: 'stolen', label: 'Stolen NIC', description: 'Your NIC has been stolen' },
    { id: 'worn', label: 'Worn out/Unreadable', description: 'Your NIC is worn out and no longer readable' },
    { id: 'technical', label: 'Technical issues', description: 'Issues with chip or magnetic strip' },
  ];

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (selectedReason) {
      // Navigate to NICReissueApplication with the selected reason
      navigation.navigate('NICReissueApplication', {
        reason: selectedReason,
        verificationData: {
          selectedReason: selectedReason,
          reasonLabel: reasons.find(r => r.id === selectedReason)?.label || '',
          timestamp: new Date().toISOString()
        }
      });
    }
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
          <Text style={styles.headerTitle}>NIC Re-issue</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Reason for Re-issue</Text>
            
            <View style={styles.reasonsContainer}>
              {reasons.map((reason) => (
                <TouchableOpacity
                  key={reason.id}
                  style={[
                    styles.reasonCard,
                    selectedReason === reason.id && styles.reasonCardSelected
                  ]}
                  onPress={() => handleReasonSelect(reason.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.reasonContent}>
                    <View style={styles.reasonLeft}>
                      <Text style={[
                        styles.reasonTitle,
                        selectedReason === reason.id && styles.reasonTitleSelected
                      ]}>
                        {reason.label}
                      </Text>
                      <Text style={[
                        styles.reasonDescription,
                        selectedReason === reason.id && styles.reasonDescriptionSelected
                      ]}>
                        {reason.description}
                      </Text>
                    </View>
                    <View style={styles.radioContainer}>
                      <View style={[
                        styles.radioButton,
                        selectedReason === reason.id && styles.radioButtonSelected
                      ]}>
                        {selectedReason === reason.id && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Next Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.nextButton,
                !selectedReason && styles.nextButtonDisabled
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={!selectedReason}
            >
              <Text style={[
                styles.nextButtonText,
                !selectedReason && styles.nextButtonTextDisabled
              ]}>
                Next
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
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 24,
  },
  reasonsContainer: {
    gap: 16,
  },
  reasonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reasonCardSelected: {
    borderColor: '#4D7399',
    backgroundColor: '#EBF4FF',
  },
  reasonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reasonLeft: {
    flex: 1,
    marginRight: 16,
  },
  reasonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  reasonTitleSelected: {
    color: '#4D7399',
  },
  reasonDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  reasonDescriptionSelected: {
    color: '#1E40AF',
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#4D7399',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4D7399',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  nextButton: {
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
  nextButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButtonTextDisabled: {
    color: '#94A3B8',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default NICReissueSelectReasonScreen;