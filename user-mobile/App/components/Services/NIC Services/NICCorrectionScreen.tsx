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

type NICCorrectionsSelectScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NICCorrectionsSelect'>;

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

const DocumentIcon = ({ color = '#4D7399', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const ClockIcon = ({ color = '#64748B', size = 20 }) => (
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

const DollarIcon = ({ color = '#64748B', size = 20 }) => (
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

const NICCorrectionsSelectScreen: React.FC<NICCorrectionsSelectScreenProps> = ({ navigation }) => {
  const correctionTypes = [
    {
      id: 'name',
      title: 'Name',
      documents: 'Birth certificate, Gazette notification',
      description: 'Correct spelling or change name on your NIC'
    },
    {
      id: 'marital',
      title: 'Marital Status',
      documents: 'Marriage certificate, Divorce decree',
      description: 'Update marital status information'
    },
    {
      id: 'dob',
      title: 'Date of Birth',
      documents: 'Birth certificate, Affidavit',
      description: 'Correct date of birth on your NIC'
    },
    {
      id: 'pob',
      title: 'Place of Birth',
      documents: 'Birth certificate, Grama Niladhari certificate',
      description: 'Update place of birth information'
    },
    {
      id: 'gender',
      title: 'Gender',
      documents: 'Birth certificate, Affidavit',
      description: 'Correct gender information on your NIC'
    },
    {
      id: 'occupation',
      title: 'Occupation',
      documents: 'Birth certificate, Affidavit',
      description: 'Update occupation information'
    },
    {
      id: 'address',
      title: 'Address',
      documents: 'Birth certificate, Affidavit',
      description: 'Update current address on your NIC'
    },
  ];

  const handleCorrectionSelect = (correctionId: string) => {
    navigation.navigate('NICCorrectionsSelect');
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
          <Text style={styles.headerTitle}>NIC Correction</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Correction Types Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Correction Types & Requirements</Text>
            
            <View style={styles.correctionsContainer}>
              {correctionTypes.map((correction) => (
                <TouchableOpacity
                  key={correction.id}
                  style={styles.correctionCard}
                  onPress={() => handleCorrectionSelect(correction.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.correctionContent}>
                    <View style={styles.correctionIconContainer}>
                      <DocumentIcon color="#4D7399" size={20} />
                    </View>
                    <View style={styles.correctionInfo}>
                      <Text style={styles.correctionTitle}>{correction.title}</Text>
                      <Text style={styles.correctionDescription}>{correction.description}</Text>
                      <Text style={styles.correctionDocuments}>{correction.documents}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Fees & Processing Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Fees & Processing</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <DollarIcon color="#64748B" size={20} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Fee: LKR 500</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <ClockIcon color="#64748B" size={20} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Processing Time: 2-4 weeks</Text>
                </View>
              </View>
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },
  correctionsContainer: {
    gap: 12,
  },
  correctionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  correctionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  correctionIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctionInfo: {
    flex: 1,
  },
  correctionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  correctionDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 6,
    lineHeight: 20,
  },
  correctionDocuments: {
    fontSize: 13,
    color: '#4D7399',
    fontWeight: '500',
  },
  infoCard: {
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
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default NICCorrectionsSelectScreen;