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
import { RouteProp } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

import { RootStackParamList } from '../../Navigation/AppNavigator';

type ApplicationTrackingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ApplicationTracking'>;
  route: RouteProp<RootStackParamList, 'ApplicationTracking'>;
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

const CheckCircleIcon = ({ color = '#10B981', size = 20 }) => (
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

const ApplicationTrackingScreen: React.FC<ApplicationTrackingScreenProps> = ({ navigation, route }) => {
  const { trackingNumber, applicationType, applicationDate, status } = route.params || {};

  // Generate tracking steps based on application type
  const getTrackingSteps = () => {
    const baseSteps = [
      {
        id: '1',
        title: 'Submitted',
        date: 'July 15, 2024',
        completed: true,
        description: 'Application submitted successfully'
      },
      {
        id: '2',
        title: 'Verified',
        date: 'July 20, 2024',
        completed: true,
        description: 'Documents verified and approved'
      },
      {
        id: '3',
        title: 'Issued',
        date: 'July 25, 2024',
        completed: true,
        description: 'NIC has been issued'
      },
      {
        id: '4',
        title: 'Delivered',
        date: 'July 30, 2024',
        completed: true,
        description: 'NIC delivered to applicant'
      }
    ];

    // Adjust completion based on current status
    if (status === 'Received') {
      return baseSteps.map((step, index) => ({
        ...step,
        completed: index === 0,
        date: index === 0 ? applicationDate : step.date
      }));
    } else if (status === 'Under Review') {
      return baseSteps.map((step, index) => ({
        ...step,
        completed: index <= 1,
        date: index === 0 ? applicationDate : step.date
      }));
    }

    return baseSteps;
  };

  const trackingSteps = getTrackingSteps();

  const handleBack = () => {
    navigation.goBack();
  };

  const getEstimatedDate = () => {
    const date = new Date(applicationDate || '2024-07-15');
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
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
          <Text style={styles.headerTitle}>Application Tracking</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Application Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.applicationTitle}>NIC Service Application</Text>
            
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Text style={styles.detailLabel}>Application Type</Text>
                </View>
                <View style={styles.detailRight}>
                  <Text style={styles.detailLabel}>Reference Number</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Text style={styles.detailValue}>
                    {applicationType || 'National Identity Card'}
                  </Text>
                </View>
                <View style={styles.detailRight}>
                  <Text style={styles.detailValue}>
                    {trackingNumber || 'NIC20240715-00123'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailSpacer} />
              
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Text style={styles.detailLabel}>Estimated Completion</Text>
                </View>
                <View style={styles.detailRight}>
                  <Text style={styles.detailValue}>{getEstimatedDate()}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tracking Timeline */}
          <View style={styles.timelineContainer}>
            {trackingSteps.map((step, index) => (
              <View key={step.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineIconContainer}>
                    {step.completed ? (
                      <CheckCircleIcon color="#10B981" size={20} />
                    ) : (
                      <View style={styles.pendingIcon} />
                    )}
                  </View>
                  {index < trackingSteps.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      { backgroundColor: step.completed ? '#10B981' : '#E2E8F0' }
                    ]} />
                  )}
                </View>
                
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.timelineTitle,
                    { color: step.completed ? '#0F172A' : '#64748B' }
                  ]}>
                    {step.title}
                  </Text>
                  <Text style={styles.timelineDate}>{step.date}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
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
    paddingHorizontal: 20,
  },
  detailsContainer: {
    marginBottom: 32,
  },
  applicationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLeft: {
    flex: 1,
  },
  detailRight: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  detailSpacer: {
    height: 16,
  },
  timelineContainer: {
    paddingLeft: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 20,
  },
  timelineIconContainer: {
    marginBottom: 8,
  },
  pendingIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 40,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 14,
    color: '#64748B',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default ApplicationTrackingScreen;