import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle } from 'react-native-svg';

// Import the enhanced navigation types
import { RootStackParamList } from '../../Navigation/AppNavigator';
import TabNavigator from '../../Navigation/TabNavigator';

interface AllAppointmentsScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AllAppointments'>;
}

interface Appointment {
  id: string;
  title: string;
  type: 'complaint' | 'service' | 'inquiry';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  time: string;
  date: string;
  location?: string;
  referenceNumber?: string;
}

// Icons
const ArrowLeftIcon = ({ color = '#0F172A', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon = ({ color = '#9CA3AF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const AllAppointmentsScreen: React.FC<AllAppointmentsScreenProps> = ({ navigation }) => {
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Meeting with Dr. Emily Carter',
      type: 'service',
      status: 'Scheduled',
      time: '10:00 AM',
      date: '2024-08-20',
      location: 'City Health Center',
      referenceNumber: 'APT20240820001',
    },
    {
      id: '2',
      title: 'Dental Checkup',
      type: 'service',
      status: 'Completed',
      time: '2:00 PM',
      date: '2024-08-15',
      location: 'Dental Clinic',
      referenceNumber: 'APT20240815002',
    },
    {
      id: '3',
      title: 'Consultation with Mr. David Lee',
      type: 'inquiry',
      status: 'Cancelled',
      time: '4:30 PM',
      date: '2024-08-18',
      location: 'Government Office',
      referenceNumber: 'APT20240818003',
    },
    {
      id: '4',
      title: 'Therapy Session',
      type: 'service',
      status: 'Scheduled',
      time: '11:30 AM',
      date: '2024-08-22',
      location: 'Wellness Center',
      referenceNumber: 'APT20240822004',
    },
    {
      id: '5',
      title: 'Eye Exam',
      type: 'service',
      status: 'Completed',
      time: '3:00 PM',
      date: '2024-08-10',
      location: 'Vision Care Center',
      referenceNumber: 'APT20240810005',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return { backgroundColor: '#EBF8FF', color: '#1E40AF' };
      case 'Completed':
        return { backgroundColor: '#F0FDF4', color: '#166534' };
      case 'Cancelled':
        return { backgroundColor: '#FEF2F2', color: '#DC2626' };
      default:
        return { backgroundColor: '#F1F5F9', color: '#64748B' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAppointmentPress = (appointment: Appointment) => {
    navigation.navigate('AppointmentTracking', { appointmentId: appointment.id });
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    const statusStyle = getStatusColor(item.status);
    
    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => handleAppointmentPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentIcon}>
            <CalendarIcon color="#64748B" size={20} />
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentTitle}>{item.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {item.status}
              </Text>
            </View>
            <Text style={styles.appointmentTime}>{item.time}</Text>
          </View>
          <ChevronRightIcon color="#9CA3AF" size={20} />
        </View>
      </TouchableOpacity>
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
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon color="#0F172A" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointments</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <FlatList
            data={appointments}
            renderItem={renderAppointmentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.appointmentsList}
          />
        </View>

    

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
  content: {
    flex: 1,
    paddingTop: 16,
  },
  appointmentsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
});

export default AllAppointmentsScreen;