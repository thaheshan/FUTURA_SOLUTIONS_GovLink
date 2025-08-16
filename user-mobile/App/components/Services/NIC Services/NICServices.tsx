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

type NICServicesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NICServices'>;
};

// Define the valid screen names for NIC services
type NICServiceScreen = 'NICNewApplication' | 'NICReissueOverview' | 'NICCorrectionsSelect';

interface ServiceItem {
  id: string;
  title: string;
  fees: string;
  processingTime: string;
  description: string;
  screen: NICServiceScreen;
}

const ArrowRightIcon = ({ color = '#4D7399', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M9 18L15 12L9 6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

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

const NICServicesScreen: React.FC<NICServicesScreenProps> = ({ navigation }) => {
  const services: ServiceItem[] = [
    {
      id: '1',
      title: 'New Application',
      fees: '$50',
      processingTime: '10-15 business days',
      description: 'Apply for a new National Identity Card',
      screen: 'NICNewApplication'
    },
    {
      id: '2',
      title: 'Re-issue',
      fees: '$25',
      processingTime: '5-7 business days',
      description: 'Re-issue your lost, damaged, or stolen NIC',
      screen: 'NICReissueOverview'
    },
    {
      id: '3',
      title: 'Corrections',
      fees: '$15',
      processingTime: '3-5 business days',
      description: 'Correct information on your existing NIC',
      screen: 'NICCorrectionsSelect'
    },
  ];

  const handleServicePress = (screen: NICServiceScreen) => {
    navigation.navigate(screen);
  };

  const handleBack = () => {
    navigation.goBack();
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
          <Text style={styles.headerTitle}>NIC Services</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Available Services</Text>
            
            <View style={styles.servicesContainer}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceCard}
                  onPress={() => handleServicePress(service.screen)}
                  activeOpacity={0.8}
                >
                  <View style={styles.serviceContent}>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceTitle}>{service.title}</Text>
                      <Text style={styles.serviceDescription}>{service.description}</Text>
                      <View style={styles.serviceDetails}>
                        <Text style={styles.detailLabel}>
                          Fees: <Text style={styles.detailValue}>{service.fees}</Text>
                        </Text>
                        <Text style={styles.detailLabel}>
                          Processing Time: <Text style={styles.detailValue}>{service.processingTime}</Text>
                        </Text>
                      </View>
                    </View>
                    <View style={styles.serviceArrow}>
                      <ArrowRightIcon color="#4D7399" size={24} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Information Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Important Information</Text>
              <Text style={styles.infoText}>
                • All applications require valid supporting documents{'\n'}
                • Processing times may vary during peak periods{'\n'}
                • Additional fees may apply for expedited services{'\n'}
                • Ensure all information is accurate before submission
              </Text>
            </View>
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
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 24,
  },
  servicesContainer: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  serviceDetails: {
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    color: '#0F172A',
    fontWeight: '600',
  },
  serviceArrow: {
    padding: 8,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default NICServicesScreen;

