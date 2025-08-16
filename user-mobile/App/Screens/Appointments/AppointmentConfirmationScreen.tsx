import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Alert,
  Share,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

// Import the enhanced navigation types
import { RootStackParamList } from '../../Navigation/AppNavigator';

interface AppointmentConfirmationScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AppointmentConfirmation'>;
  route: RouteProp<RootStackParamList, 'AppointmentConfirmation'>;
}

// Icons
const CheckCircleIcon = ({ color = '#10B981', size = 80 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
      fillOpacity="0.1"
    />
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

const ClockIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6L12 12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LocationIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10C21 17 12 23 12 23S3 17 3 10C3 6.13401 6.13401 3 12 3C17.866 3 21 6.13401 21 10Z"
      stroke={color}
      strokeWidth="2"
    />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

const PersonIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
  </Svg>
);

const PhoneIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59344 1.99522 8.06309 2.16708 8.43299 2.48353C8.80288 2.79999 9.04867 3.23945 9.10999 3.72C9.22399 4.68007 9.47577 5.62273 9.85999 6.52C9.98117 6.83081 10.0194 7.1669 9.96566 7.49398C9.91194 7.82106 9.76963 8.12784 9.55999 8.38L8.08999 9.85C9.51355 12.4135 11.5865 14.4864 14.15 15.91L15.62 14.44C15.8722 14.2304 16.1789 14.0881 16.506 14.0343C16.8331 13.9806 17.1692 14.0188 17.48 14.14C18.3773 14.5242 19.3199 14.776 20.28 14.89C20.7658 14.9518 21.2094 15.2023 21.5265 15.5776C21.8437 15.9529 22.0122 16.4297 21.9999 16.92H22Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EmailIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M22 6L12 13L2 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DocumentIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 9H9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ShareIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M16 6L12 2L8 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 2V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrackIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 11L12 14L22 4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AppointmentConfirmationScreen: React.FC<AppointmentConfirmationScreenProps> = ({ navigation, route }) => {
  const { appointmentData } = route.params;
  
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getAppointmentTypeTitle = () => {
    switch (appointmentData.type) {
      case 'complaint':
        return 'Complaint';
      case 'service':
        return 'Service Request';
      case 'inquiry':
        return 'General Inquiry';
      default:
        return 'Appointment';
    }
  };

  const getUrgencyColor = () => {
    switch (appointmentData.urgency) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#64748B';
    }
  };

  const getUrgencyLabel = () => {
    switch (appointmentData.urgency) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Standard';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShareAppointment = async () => {
    try {
      const shareMessage = `
🗓️ Appointment Confirmed

Type: ${getAppointmentTypeTitle()}
Tracking: #${appointmentData.trackingNumber}
Date: ${formatDate(appointmentData.date)}
Time: ${appointmentData.time}
Division: ${appointmentData.division}
Subject: ${appointmentData.subject}

Contact: ${appointmentData.fullName}
Phone: ${appointmentData.phone}
${appointmentData.email ? `Email: ${appointmentData.email}` : ''}

Priority: ${getUrgencyLabel()}
      `.trim();

      await Share.share({
        message: shareMessage,
        title: 'Appointment Confirmation',
      });
    } catch (error) {
      console.error('Error sharing appointment:', error);
    }
  };

  const handleTrackAppointment = () => {
    navigation.navigate('AppointmentTracking', {
      appointmentId: appointmentData.trackingNumber,
    });
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnimation,
                transform: [
                  { translateY: slideAnimation },
                  { scale: scaleAnimation },
                ],
              },
            ]}
          >
            {/* Success Icon */}
            <View style={styles.iconContainer}>
              <CheckCircleIcon size={100} color="#10B981" />
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{getAppointmentTypeTitle()}</Text>
              <Text style={styles.subtitle}>Appointment Confirmed</Text>
              <Text style={styles.description}>
                Your appointment request has been successfully submitted. You can track the 
                progress using the tracking number below.
              </Text>
            </View>

            {/* Tracking Number Card */}
            <View style={styles.trackingCard}>
              <Text style={styles.trackingLabel}>Tracking Number</Text>
              <Text style={styles.trackingNumber}>#{appointmentData.trackingNumber}</Text>
              <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor() }]}>
                <Text style={styles.urgencyText}>{getUrgencyLabel()}</Text>
              </View>
            </View>

            {/* Appointment Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Appointment Details</Text>
              
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <DocumentIcon size={20} color="#64748B" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={styles.detailValue}>{getAppointmentTypeTitle()}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <LocationIcon size={20} color="#64748B" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Division</Text>
                  <Text style={styles.detailValue}>{appointmentData.division}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <CalendarIcon size={20} color="#64748B" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{formatDate(appointmentData.date)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <ClockIcon size={20} color="#64748B" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailValue}>{appointmentData.time}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <DocumentIcon size={20} color="#64748B" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Subject</Text>
                  <Text style={styles.detailValue}>{appointmentData.subject}</Text>
                </View>
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <PersonIcon size={20} color="#64748B" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Full Name</Text>
                  <Text style={styles.detailValue}>{appointmentData.fullName}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <PhoneIcon size={20} color="#64748B" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Phone Number</Text>
                  <Text style={styles.detailValue}>{appointmentData.phone}</Text>
                </View>
              </View>

              {appointmentData.email && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <EmailIcon size={20} color="#64748B" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>{appointmentData.email}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Important Notice */}
            <View style={styles.noticeContainer}>
              <Text style={styles.noticeTitle}>Important Notice</Text>
              <Text style={styles.noticeText}>
                • Please arrive 15 minutes before your appointment time{'\n'}
                • Bring a valid ID and any relevant documents{'\n'}
                • You will receive SMS updates about your appointment status{'\n'}
                • Contact the division directly for any urgent changes
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.trackButton}
                onPress={handleTrackAppointment}
                activeOpacity={0.8}
              >
                <TrackIcon size={20} color="#FFFFFF" />
                <Text style={styles.trackButtonText}>Track Appointment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShareAppointment}
                activeOpacity={0.8}
              >
                <ShareIcon size={20} color="#FFFFFF" />
                <Text style={styles.shareButtonText}>Share Details</Text>
              </TouchableOpacity>
            </View>

            {/* Back to Home Button */}
            <TouchableOpacity
              style={styles.homeButton}
              onPress={handleBackToHome}
              activeOpacity={0.8}
            >
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </Animated.View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  trackingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trackingLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
  },
  trackingNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    letterSpacing: 1,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  urgencyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    paddingTop: 2,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    lineHeight: 22,
  },
  noticeContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  trackButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  homeButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppointmentConfirmationScreen;