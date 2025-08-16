import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

// Import the enhanced navigation types
import { RootStackParamList } from '../../Navigation/AppNavigator';
import TabNavigator from '../../Navigation/TabNavigator';

const { width } = Dimensions.get('window');

interface BookAppointmentDetailScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BookAppointmentDetail'>;
  route: RouteProp<RootStackParamList, 'BookAppointmentDetail'>;
}

interface Division {
  id: string;
  name: string;
  type: 'GS' | 'DS';
  area: string;
  officer: {
    name: string;
    phone: string;
  };
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
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

const BookAppointmentDetailScreen: React.FC<BookAppointmentDetailScreenProps> = ({ navigation, route }) => {
  const { type } = route.params;
  
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showDivisionModal, setShowDivisionModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    nic: '',
    phone: '',
    email: '',
    subject: '',
    description: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
  });

  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Sample data
  const divisions: Division[] = [
    {
      id: '1',
      name: 'Vavuniya South',
      type: 'GS',
      area: 'Vavuniya District',
      officer: {
        name: 'Mr. K.M. Perera',
        phone: '+94 77 123 4567',
      }
    },
    {
      id: '2',
      name: 'Vavuniya North',
      type: 'GS',
      area: 'Vavuniya District',
      officer: {
        name: 'Mrs. S.R. Fernando',
        phone: '+94 77 234 5678',
      }
    },
    {
      id: '3',
      name: 'Vavuniya',
      type: 'DS',
      area: 'Vavuniya District',
      officer: {
        name: 'Mr. R.P. Silva',
        phone: '+94 77 345 6789',
      }
    },
  ];

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00', available: true },
    { id: '2', time: '09:30', available: true },
    { id: '3', time: '10:00', available: false },
    { id: '4', time: '10:30', available: true },
    { id: '5', time: '11:00', available: true },
    { id: '6', time: '14:00', available: true },
    { id: '7', time: '14:30', available: false },
    { id: '8', time: '15:00', available: true },
    { id: '9', time: '15:30', available: true },
    { id: '10', time: '16:00', available: true },
  ];

  const getDaysInMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      if (date >= today) {
        days.push({
          date: i,
          day: date.toLocaleDateString('en', { weekday: 'short' }),
          fullDate: date.toISOString().split('T')[0]
        });
      }
    }
    return days.slice(0, 14); // Show next 14 days
  };

  const getAppointmentTypeTitle = () => {
    switch (type) {
      case 'complaint':
        return 'File a Complaint';
      case 'service':
        return 'Request a Service';
      case 'inquiry':
        return 'General Inquiry';
      default:
        return 'Book Appointment';
    }
  };

  const handleSubmit = () => {
    if (!selectedDivision || !selectedDate || !selectedTime || !formData.fullName || !formData.phone || !formData.subject) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Appointment Request Submitted',
      `Your ${getAppointmentTypeTitle().toLowerCase()} has been submitted successfully. You will receive a confirmation within 24 hours.\n\nReference ID: APT${Date.now()}`,
      [{ text: 'OK', onPress: () => navigation.navigate('AppointmentsHome') }]
    );
  };

  const renderDivisionItem = ({ item }: { item: Division }) => (
    <TouchableOpacity
      style={[
        styles.divisionItem,
        selectedDivision?.id === item.id && styles.selectedDivisionItem
      ]}
      onPress={() => {
        setSelectedDivision(item);
        setShowDivisionModal(false);
      }}
      activeOpacity={0.7}
    >
      <Text style={styles.divisionName}>{item.name}</Text>
      <Text style={styles.divisionType}>{item.type} Division</Text>
      <Text style={styles.divisionArea}>{item.area}</Text>
      <Text style={styles.officerName}>{item.officer.name}</Text>
      <Text style={styles.officerPhone}>{item.officer.phone}</Text>
    </TouchableOpacity>
  );

  const renderTimeSlot = ({ item }: { item: TimeSlot }) => (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        !item.available && styles.timeSlotDisabled,
        selectedTime === item.time && styles.selectedTimeSlot
      ]}
      onPress={() => {
        if (item.available) {
          setSelectedTime(item.time);
          setShowTimeModal(false);
        }
      }}
      disabled={!item.available}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.timeSlotText,
        !item.available && styles.timeSlotTextDisabled,
        selectedTime === item.time && styles.selectedTimeSlotText
      ]}>
        {item.time}
      </Text>
      {!item.available && (
        <Text style={styles.unavailableText}>Booked</Text>
      )}
    </TouchableOpacity>
  );

  const slideTransform = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

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
          <Text style={styles.headerTitle}>{getAppointmentTypeTitle()}</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View 
            style={[
              styles.content,
              { transform: [{ translateY: slideTransform }] }
            ]}
          >
            {/* Division Selection */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Select Division</Text>
              <TouchableOpacity
                style={styles.selectionButton}
                onPress={() => setShowDivisionModal(true)}
                activeOpacity={0.8}
              >
                <View style={styles.selectionContent}>
                  <LocationIcon size={20} color="#64748B" />
                  <Text style={styles.selectionText}>
                    {selectedDivision ? selectedDivision.name : 'Choose your division'}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Date Selection */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Select Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScrollView}>
                <View style={styles.dateContainer}>
                  {getDaysInMonth().map((day) => (
                    <TouchableOpacity
                      key={day.fullDate}
                      style={[
                        styles.dateButton,
                        selectedDate === day.fullDate && styles.selectedDateButton
                      ]}
                      onPress={() => setSelectedDate(day.fullDate)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.dayText,
                        selectedDate === day.fullDate && styles.selectedDayText
                      ]}>
                        {day.day}
                      </Text>
                      <Text style={[
                        styles.dateText,
                        selectedDate === day.fullDate && styles.selectedDateText
                      ]}>
                        {day.date}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Time Selection */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Select Time</Text>
              <TouchableOpacity
                style={styles.selectionButton}
                onPress={() => setShowTimeModal(true)}
                activeOpacity={0.8}
              >
                <View style={styles.selectionContent}>
                  <ClockIcon size={20} color="#64748B" />
                  <Text style={styles.selectionText}>
                    {selectedTime ? selectedTime : 'Choose appointment time'}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Personal Information */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>NIC Number *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your NIC number"
                    value={formData.nic}
                    onChangeText={(text) => setFormData({ ...formData, nic: text })}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="+94 77 123 4567"
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    keyboardType="phone-pad"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {/* Appointment Details */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Subject *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={`Brief subject of your ${type}`}
                    value={formData.subject}
                    onChangeText={(text) => setFormData({ ...formData, subject: text })}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Provide detailed description..."
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Urgency Level</Text>
                  <View style={styles.urgencyContainer}>
                    {[
                      { key: 'low', label: 'Low', color: '#10B981' },
                      { key: 'medium', label: 'Medium', color: '#F59E0B' },
                      { key: 'high', label: 'High', color: '#EF4444' }
                    ].map((urgency) => (
                      <TouchableOpacity
                        key={urgency.key}
                        style={[
                          styles.urgencyButton,
                          formData.urgency === urgency.key && styles.urgencyButtonActive,
                          { borderColor: urgency.color }
                        ]}
                        onPress={() => setFormData({ ...formData, urgency: urgency.key as any })}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.urgencyIndicator,
                          { backgroundColor: urgency.color }
                        ]} />
                        <Text style={[
                          styles.urgencyText,
                          formData.urgency === urgency.key && styles.urgencyTextActive
                        ]}>
                          {urgency.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.submitContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </TouchableOpacity>
              <Text style={styles.submitNote}>
                * You will receive a confirmation within 24 hours
              </Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Division Selection Modal */}
        <Modal
          visible={showDivisionModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowDivisionModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowDivisionModal(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Division</Text>
              <View style={styles.modalHeaderRight} />
            </View>
            <FlatList
              data={divisions}
              renderItem={renderDivisionItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.divisionsList}
              showsVerticalScrollIndicator={false}
            />
          </SafeAreaView>
        </Modal>

        {/* Time Selection Modal */}
        <Modal
          visible={showTimeModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowTimeModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowTimeModal(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Time</Text>
              <View style={styles.modalHeaderRight} />
            </View>
            
            <ScrollView style={styles.timeModalContent}>
              <Text style={styles.timeModalSubtitle}>Available time slots for {selectedDate}</Text>
              
              <FlatList
                data={timeSlots}
                renderItem={renderTimeSlot}
                keyExtractor={(item) => item.id}
                numColumns={3}
                scrollEnabled={false}
                contentContainerStyle={styles.timeSlotGrid}
              />
            </ScrollView>
          </SafeAreaView>
        </Modal>

        
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
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectionText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  dateScrollView: {
    marginHorizontal: -20,
  },
  dateContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  dateButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 60,
  },
  selectedDateButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dayText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  formContainer: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  urgencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  urgencyButtonActive: {
    backgroundColor: '#F8FAFC',
  },
  urgencyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  urgencyTextActive: {
    color: '#0F172A',
  },
  submitContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  submitNote: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalHeaderRight: {
    width: 60,
  },
  divisionsList: {
    padding: 20,
    gap: 16,
  },
  divisionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  selectedDivisionItem: {
    borderColor: '#007AFF',
    backgroundColor: '#EBF8FF',
  },
  divisionName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  divisionType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  divisionArea: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  officerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  officerPhone: {
    fontSize: 14,
    color: '#64748B',
  },
  timeModalContent: {
    flex: 1,
    padding: 20,
  },
  timeModalSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
  },
  timeSlotGrid: {
    gap: 12,
  },
  timeSlot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginHorizontal: 4,
    minHeight: 60,
    justifyContent: 'center',
  },
  timeSlotDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
  },
  selectedTimeSlot: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  timeSlotTextDisabled: {
    color: '#9CA3AF',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
  },
  unavailableText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 4,
  },
});

export default BookAppointmentDetailScreen;