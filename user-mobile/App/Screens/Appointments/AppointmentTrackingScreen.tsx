import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import TabNavigator from '../../Navigation/TabNavigator';

// Import the enhanced navigation types
import { RootStackParamList } from '../../Navigation/AppNavigator';

interface AppointmentTrackingScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AppointmentTracking'>;
  route: RouteProp<RootStackParamList, 'AppointmentTracking'>;
}

interface AppointmentDetails {
  id: string;
  title: string;
  type: 'complaint' | 'service' | 'inquiry';
  referenceNumber: string;
  estimatedCompletion: string;
  status: 'Booked' | 'Verified' | 'Issued' | 'Time Allocated' | 'Completed' | 'Cancelled';
  currentStep: number;
  steps: {
    id: number;
    title: string;
    date: string;
    completed: boolean;
  }[];
  description?: string;
  location?: string;
}

// Icons
const ArrowLeftIcon = ({ color = '#0F172A', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ color = '#10B981', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockIcon = ({ color = '#F59E0B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6L12 12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const AppointmentTrackingScreen: React.FC<AppointmentTrackingScreenProps> = ({ navigation, route }) => {
  const { appointmentId } = route.params;
  
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);

  useEffect(() => {
    // Simulate fetching appointment details based on ID
    const mockAppointmentDetails: AppointmentDetails = {
      id: appointmentId,
      title: 'NIC Service Application',
      type: 'service',
      referenceNumber: 'NIC20240715-00123',
      estimatedCompletion: 'August 15, 2024',
      status: 'Time Allocated',
      currentStep: 4,
      steps: [
        {
          id: 1,
          title: 'Booked',
          date: 'July 15, 2024',
          completed: true,
        },
        {
          id: 2,
          title: 'Verified',
          date: 'July 20, 2024',
          completed: true,
        },
        {
          id: 3,
          title: 'Issued',
          date: 'July 25, 2024',
          completed: true,
        },
        {
          id: 4,
          title: 'Time Allocated',
          date: 'July 30, 2024',
          completed: true,
        },
      ],
      description: 'National Identity Card service application',
      location: 'District Secretariat Office, Vavuniya',
    };
    
    setAppointmentDetails(mockAppointmentDetails);
  }, [appointmentId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#10B981';
      case 'Time Allocated':
      case 'Verified':
      case 'Issued':
        return '#F59E0B';
      case 'Cancelled':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  if (!appointmentDetails) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.loadingText}>Loading...</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon color="#0F172A" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Application Tracking</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Appointment Title */}
          <View style={styles.titleSection}>
            <Text style={styles.appointmentTitle}>{appointmentDetails.title}</Text>
          </View>

          {/* Appointment Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Application Type</Text>
              <Text style={styles.detailValue}>National Identity Card</Text>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference Number</Text>
              <Text style={styles.detailValue}>{appointmentDetails.referenceNumber}</Text>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estimated Completion</Text>
              <Text style={styles.detailValue}>{appointmentDetails.estimatedCompletion}</Text>
            </View>
          </View>

          {/* Progress Timeline */}
          <View style={styles.timelineSection}>
            {appointmentDetails.steps.map((step, index) => (
              <View key={step.id} style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[
                    styles.timelineIcon,
                    {
                      backgroundColor: step.completed ? '#10B981' : '#E5E7EB',
                      borderColor: step.completed ? '#10B981' : '#E5E7EB',
                    }
                  ]}>
                    {step.completed ? (
                      <CheckIcon color="#FFFFFF" size={12} />
                    ) : (
                      <View style={styles.timelineIconDot} />
                    )}
                  </View>
                  {index < appointmentDetails.steps.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      { backgroundColor: step.completed ? '#10B981' : '#E5E7EB' }
                    ]} />
                  )}
                </View>
                
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.timelineTitle,
                    { color: step.completed ? '#0F172A' : '#9CA3AF' }
                  ]}>
                    {step.title}
                  </Text>
                  <Text style={[
                    styles.timelineDate,
                    { color: step.completed ? '#64748B' : '#9CA3AF' }
                  ]}>
                    {step.date}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Additional Information */}
          {appointmentDetails.location && (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Location</Text>
              <Text style={styles.infoText}>{appointmentDetails.location}</Text>
            </View>
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Status</Text>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(appointmentDetails.status) }
              ]} />
              <Text style={styles.statusText}>{appointmentDetails.status}</Text>
            </View>
          </View>
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
    fontWeight: '700',
    color: '#0F172A',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748B',
    marginTop: 100,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  appointmentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  timelineSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineIconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  timelineLine: {
    width: 2,
    height: 32,
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },
});

export default AppointmentTrackingScreen;