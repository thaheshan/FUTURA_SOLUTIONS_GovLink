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
import Svg, { Path, Rect } from 'react-native-svg';

import { RootStackParamList } from '../../Navigation/AppNavigator';
import TabNavigator from '../../Navigation/TabNavigator';

type TrackRequestsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TrackRequests'>;
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

const DocumentIcon = ({ color = '#64748B', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect 
      x="3" 
      y="3" 
      width="18" 
      height="18" 
      rx="2" 
      ry="2" 
      stroke={color} 
      strokeWidth="2" 
      fill="none"
    />
    <Path 
      d="M8 12H16M8 16H12" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
  </Svg>
);

const TrackRequestsScreen: React.FC<TrackRequestsScreenProps> = ({ navigation }) => {
  const applications = [
    {
      id: '1',
      title: 'New NIC',
      type: 'New Application',
      applicationDate: '2024-07-20',
      status: 'Received',
      statusColor: '#10B981',
      backgroundColor: '#F0FDF4',
      trackingNumber: 'NIC20240720-NEW001'
    },
    {
      id: '2',
      title: 'Re-issue NIC',
      type: 'Re-issue Application',
      applicationDate: '2024-06-15',
      status: 'Under Review',
      statusColor: '#F59E0B',
      backgroundColor: '#FFFBEB',
      trackingNumber: 'NIC20240615-REI001'
    },
    {
      id: '3',
      title: 'NIC Correction',
      type: 'Correction Application',
      applicationDate: '2024-05-02',
      status: 'Completed',
      statusColor: '#06B6D4',
      backgroundColor: '#F0F9FF',
      trackingNumber: 'NIC20240502-COR001'
    },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleApplicationPress = (application: any) => {
    navigation.navigate('ApplicationTracking', { 
      trackingNumber: application.trackingNumber,
      applicationType: application.type,
      applicationDate: application.applicationDate,
      status: application.status
    });
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
          <Text style={styles.headerTitle}>Track Requests</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>My Applications</Text>
            
            <View style={styles.applicationsContainer}>
              {applications.map((application) => (
                <TouchableOpacity
                  key={application.id}
                  style={styles.applicationCard}
                  onPress={() => handleApplicationPress(application)}
                  activeOpacity={0.8}
                >
                  <View style={styles.applicationContent}>
                    <View style={styles.iconContainer}>
                      <DocumentIcon color="#64748B" size={24} />
                    </View>
                    
                    <View style={styles.applicationInfo}>
                      <Text style={styles.applicationTitle}>{application.title}</Text>
                      <Text style={styles.applicationDate}>
                        Application Date: {application.applicationDate}
                      </Text>
                    </View>
                    
                    <View style={[
                      styles.statusContainer, 
                      { backgroundColor: application.backgroundColor }
                    ]}>
                      <Text style={[
                        styles.statusText, 
                        { color: application.statusColor }
                      ]}>
                        {application.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
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
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 24,
  },
  applicationsContainer: {
    gap: 16,
  },
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  applicationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  applicationInfo: {
    flex: 1,
  },
  applicationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  applicationDate: {
    fontSize: 14,
    color: '#64748B',
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default TrackRequestsScreen;