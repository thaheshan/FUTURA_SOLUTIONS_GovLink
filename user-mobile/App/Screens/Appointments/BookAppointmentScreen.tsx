import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  Animated,
  Alert,
  Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { RootStackParamList } from '../../Navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

interface AppointmentScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BookAppointment'>;
}

interface Division {
  id: string;
  name: string;
  type: 'GS' | 'DS';
  area: string;
  population: number;
  officer: {
    name: string;
    phone: string;
    email: string;
    image: string;
  };
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  type: 'morning' | 'afternoon' | 'evening';
}

interface PublicAppointment {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'full' | 'closed';
}

// Enhanced Icon Components
const CalendarIcon = ({ color = '#4D7399', size = 24 }) => (
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

const ClockIcon = ({ color = '#4D7399', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6L12 12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LocationIcon = ({ color = '#4D7399', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10C21 17 12 23 12 23S3 17 3 10C3 6.13401 6.13401 3 12 3C17.866 3 21 6.13401 21 10Z"
      stroke={color}
      strokeWidth="2"
    />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

const UserIcon = ({ color = '#4D7399', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
  </Svg>
);

const PhoneIcon = ({ color = '#4D7399', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49997 10.2412 2.44824 7.27099 2.12 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63421 2.65162C2.82086 2.44655 3.04816 2.28271 3.30207 2.17052C3.55599 2.05833 3.83056 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.11 3.72C9.23662 4.68007 9.47144 5.62273 9.81 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51355 12.4135 11.5865 14.4865 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowLeftIcon = ({ color = '#4D7399', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ color = '#10B981', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BookAppointmentScreen: React.FC<AppointmentScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<'request' | 'public'>('request');
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<'complaint' | 'service' | 'inquiry'>('complaint');
  const [showDivisionModal, setShowDivisionModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    nic: '',
    phone: '',
    email: '',
    address: '',
    subject: '',
    description: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
  });

  const slideAnimation = useRef(new Animated.Value(0)).current;
  const tabAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.timing(tabAnimation, {
      toValue: selectedTab === 'request' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedTab]);

  // Sample data
  const divisions: Division[] = [
    {
      id: '1',
      name: 'Vavuniya South',
      type: 'GS',
      area: 'Vavuniya District',
      population: 15420,
      officer: {
        name: 'Mr. K.M. Perera',
        phone: '+94 77 123 4567',
        email: 'grama.vavuniyasouth@gov.lk',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
      }
    },
    {
      id: '2',
      name: 'Vavuniya North',
      type: 'GS',
      area: 'Vavuniya District',
      population: 18750,
      officer: {
        name: 'Mrs. S.R. Fernando',
        phone: '+94 77 234 5678',
        email: 'grama.vavuniyanorth@gov.lk',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      }
    },
    {
      id: '3',
      name: 'Vavuniya',
      type: 'DS',
      area: 'Vavuniya District',
      population: 65890,
      officer: {
        name: 'Mr. R.P. Silva',
        phone: '+94 77 345 6789',
        email: 'ds.vavuniya@gov.lk',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
    },
    {
      id: '4',
      name: 'Nedunkerni',
      type: 'GS',
      area: 'Vavuniya District',
      population: 12340,
      officer: {
        name: 'Ms. T.A. Jayawardena',
        phone: '+94 77 456 7890',
        email: 'grama.nedunkerni@gov.lk',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      }
    }
  ];

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00', available: true, type: 'morning' },
    { id: '2', time: '09:30', available: true, type: 'morning' },
    { id: '3', time: '10:00', available: false, type: 'morning' },
    { id: '4', time: '10:30', available: true, type: 'morning' },
    { id: '5', time: '11:00', available: true, type: 'morning' },
    { id: '6', time: '14:00', available: true, type: 'afternoon' },
    { id: '7', time: '14:30', available: false, type: 'afternoon' },
    { id: '8', time: '15:00', available: true, type: 'afternoon' },
    { id: '9', time: '15:30', available: true, type: 'afternoon' },
    { id: '10', time: '16:00', available: true, type: 'afternoon' },
  ];

  const publicAppointments: PublicAppointment[] = [
    {
      id: '1',
      title: 'Community Development Meeting',
      description: 'Quarterly meeting to discuss local infrastructure projects and community welfare programs.',
      date: '2025-08-20',
      time: '10:00',
      location: 'Vavuniya Community Center',
      maxParticipants: 50,
      currentParticipants: 32,
      category: 'Community',
      priority: 'high',
      status: 'open'
    },
    {
      id: '2',
      title: 'Agricultural Support Program',
      description: 'Information session about new farming subsidies and technical assistance programs.',
      date: '2025-08-22',
      time: '14:00',
      location: 'DS Office - Vavuniya',
      maxParticipants: 30,
      currentParticipants: 18,
      category: 'Agriculture',
      priority: 'medium',
      status: 'open'
    },
    {
      id: '3',
      title: 'Youth Employment Workshop',
      description: 'Skills development and job placement assistance for youth aged 18-30.',
      date: '2025-08-25',
      time: '09:00',
      location: 'Vavuniya Youth Center',
      maxParticipants: 40,
      currentParticipants: 40,
      category: 'Employment',
      priority: 'high',
      status: 'full'
    },
    {
      id: '4',
      title: 'Senior Citizens Health Camp',
      description: 'Free health checkups and consultations for citizens above 60 years.',
      date: '2025-08-28',
      time: '08:00',
      location: 'District Hospital Grounds',
      maxParticipants: 100,
      currentParticipants: 67,
      category: 'Healthcare',
      priority: 'medium',
      status: 'open'
    }
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

  const handleSubmitRequest = () => {
    if (!selectedDivision || !selectedDate || !selectedTime || !formData.fullName || !formData.phone || !formData.subject) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Appointment Request Submitted',
      `Your appointment request has been submitted successfully. You will receive a confirmation within 24 hours.\n\nReference ID: APT${Date.now()}`,
      [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
    );
  };

  const handleJoinPublicAppointment = (appointment: PublicAppointment) => {
    if (appointment.status === 'full') {
      Alert.alert('Appointment Full', 'This appointment is already at maximum capacity.');
      return;
    }

    Alert.alert(
      'Join Public Appointment',
      `Do you want to register for "${appointment.title}"?\n\nDate: ${appointment.date}\nTime: ${appointment.time}\nLocation: ${appointment.location}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join', 
          onPress: () => {
            Alert.alert('Registration Successful', 'You have been registered for this public appointment. You will receive a confirmation SMS.');
          }
        }
      ]
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
      <View style={styles.divisionHeader}>
        <View style={styles.divisionInfo}>
          <Text style={styles.divisionName}>{item.name}</Text>
          <View style={styles.divisionTypeContainer}>
            <Text style={[
              styles.divisionType,
              { backgroundColor: item.type === 'GS' ? '#EBF4FF' : '#F0FDF4', color: item.type === 'GS' ? '#2563EB' : '#10B981' }
            ]}>
              {item.type} Division
            </Text>
          </View>
        </View>
        <Image source={{ uri: item.officer.image }} style={styles.officerImage} />
      </View>
      <Text style={styles.divisionArea}>{item.area}</Text>
      <Text style={styles.divisionPopulation}>Population: {item.population.toLocaleString()}</Text>
      <View style={styles.officerInfo}>
        <Text style={styles.officerName}>{item.officer.name}</Text>
        <Text style={styles.officerContact}>{item.officer.phone}</Text>
      </View>
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

  const renderPublicAppointment = ({ item }: { item: PublicAppointment }) => (
    <View style={styles.publicAppointmentCard}>
      <View style={styles.publicAppointmentHeader}>
        <View style={styles.publicAppointmentTitleContainer}>
          <Text style={styles.publicAppointmentTitle}>{item.title}</Text>
          <View style={[
            styles.priorityBadge,
            { backgroundColor: item.priority === 'high' ? '#FEF2F2' : item.priority === 'medium' ? '#FEF3C7' : '#F0FDF4' }
          ]}>
            <Text style={[
              styles.priorityText,
              { color: item.priority === 'high' ? '#DC2626' : item.priority === 'medium' ? '#D97706' : '#059669' }
            ]}>
              {item.priority.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'open' ? '#DCFCE7' : item.status === 'full' ? '#FEF2F2' : '#F1F5F9' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'open' ? '#166534' : item.status === 'full' ? '#DC2626' : '#64748B' }
          ]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <Text style={styles.publicAppointmentDescription}>{item.description}</Text>
      
      <View style={styles.publicAppointmentDetails}>
        <View style={styles.detailRow}>
          <CalendarIcon size={16} color="#64748B" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <ClockIcon size={16} color="#64748B" />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <LocationIcon size={16} color="#64748B" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
      </View>
      
      <View style={styles.participantsInfo}>
        <View style={styles.participantsBar}>
          <View 
            style={[
              styles.participantsProgress,
              { width: `${(item.currentParticipants / item.maxParticipants) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.participantsText}>
          {item.currentParticipants}/{item.maxParticipants} participants
        </Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.joinButton,
          item.status !== 'open' && styles.joinButtonDisabled
        ]}
        onPress={() => handleJoinPublicAppointment(item)}
        disabled={item.status !== 'open'}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.joinButtonText,
          item.status !== 'open' && styles.joinButtonTextDisabled
        ]}>
          {item.status === 'full' ? 'Full' : item.status === 'closed' ? 'Closed' : 'Join Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const slideTransform = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const tabTransform = tabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width / 2],
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
            <ArrowLeftIcon color="#374151" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Tab Navigation */}
        <Animated.View 
          style={[
            styles.tabContainer,
            { transform: [{ translateY: slideTransform }] }
          ]}
        >
          <View style={styles.tabBackground}>
            <Animated.View 
              style={[
                styles.tabIndicator,
                { transform: [{ translateX: tabTransform }] }
              ]} 
            />
          </View>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setSelectedTab('request')}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'request' && styles.tabTextActive
            ]}>
              Request Appointment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setSelectedTab('public')}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'public' && styles.tabTextActive
            ]}>
              Public Appointments
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {selectedTab === 'request' ? (
            <Animated.View 
              style={[
                styles.requestContainer,
                { transform: [{ translateY: slideTransform }] }
              ]}
            >
              {/* Appointment Type Selection */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Appointment Type</Text>
                <View style={styles.appointmentTypeContainer}>
                  {[
                    { key: 'complaint', label: 'File Complaint', icon: '⚠️' },
                    { key: 'service', label: 'Request Service', icon: '📋' },
                    { key: 'inquiry', label: 'General Inquiry', icon: '❓' }
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.key}
                      style={[
                        styles.appointmentTypeButton,
                        appointmentType === type.key && styles.appointmentTypeButtonActive
                      ]}
                      onPress={() => setAppointmentType(type.key as any)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.appointmentTypeIcon}>{type.icon}</Text>
                      <Text style={[
                        styles.appointmentTypeText,
                        appointmentType === type.key && styles.appointmentTypeTextActive
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

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

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Address</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your address"
                      value={formData.address}
                      onChangeText={(text) => setFormData({ ...formData, address: text })}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>

              {/* Appointment Details */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Appointment Details</Text>
                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Subject *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Brief subject of your appointment"
                      value={formData.subject}
                      onChangeText={(text) => setFormData({ ...formData, subject: text })}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      placeholder="Provide detailed description of your request..."
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
                  onPress={handleSubmitRequest}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitButtonText}>Submit Request</Text>
                </TouchableOpacity>
                <Text style={styles.submitNote}>
                  * You will receive a confirmation within 24 hours
                </Text>
              </View>
            </Animated.View>
          ) : (
            <Animated.View 
              style={[
                styles.publicContainer,
                { transform: [{ translateY: slideTransform }] }
              ]}
            >
              <Text style={styles.publicTitle}>Upcoming Public Appointments</Text>
              <Text style={styles.publicSubtitle}>
                Join community meetings and public sessions with government officials
              </Text>
              
              <FlatList
                data={publicAppointments}
                renderItem={renderPublicAppointment}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.publicAppointmentsList}
              />
            </Animated.View>
          )}
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
              
              <View style={styles.timeSlotsContainer}>
                <Text style={styles.timeSlotGroupTitle}>Morning</Text>
                <FlatList
                  data={timeSlots.filter(slot => slot.type === 'morning')}
                  renderItem={renderTimeSlot}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  scrollEnabled={false}
                  contentContainerStyle={styles.timeSlotGrid}
                />
                
                <Text style={styles.timeSlotGroupTitle}>Afternoon</Text>
                <FlatList
                  data={timeSlots.filter(slot => slot.type === 'afternoon')}
                  renderItem={renderTimeSlot}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  scrollEnabled={false}
                  contentContainerStyle={styles.timeSlotGrid}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerRight: {
    width: 40,
  },
  tabContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    position: 'relative',
  },
  tabBackground: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
  },
  tabIndicator: {
    width: (width - 48) / 2,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#4D7399',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  requestContainer: {
    flex: 1,
  },
  publicContainer: {
    flex: 1,
    paddingHorizontal: 20,
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
  appointmentTypeContainer: {
    gap: 12,
  },
  appointmentTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  appointmentTypeButtonActive: {
    borderColor: '#4D7399',
    backgroundColor: '#EBF4FF',
  },
  appointmentTypeIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  appointmentTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  appointmentTypeTextActive: {
    color: '#4D7399',
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
    backgroundColor: '#4D7399',
    borderColor: '#4D7399',
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
    backgroundColor: '#4D7399',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4D7399',
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
  publicTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 8,
  },
  publicSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    lineHeight: 24,
  },
  publicAppointmentsList: {
    gap: 20,
  },
  publicAppointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  publicAppointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  publicAppointmentTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  publicAppointmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    lineHeight: 24,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  publicAppointmentDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  publicAppointmentDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  participantsInfo: {
    marginBottom: 16,
  },
  participantsBar: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    marginBottom: 8,
  },
  participantsProgress: {
    height: '100%',
    backgroundColor: '#4D7399',
    borderRadius: 3,
  },
  participantsText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#4D7399',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  joinButtonTextDisabled: {
    color: '#9CA3AF',
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
    color: '#4D7399',
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
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  selectedDivisionItem: {
    borderColor: '#4D7399',
    backgroundColor: '#EBF4FF',
  },
  divisionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  divisionInfo: {
    flex: 1,
  },
  divisionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  divisionTypeContainer: {
    alignSelf: 'flex-start',
  },
  divisionType: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  officerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 16,
  },
  divisionArea: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  divisionPopulation: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 12,
  },
  officerInfo: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  officerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  officerContact: {
    fontSize: 14,
    color: '#4D7399',
    fontWeight: '500',
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
  timeSlotsContainer: {
    gap: 24,
  },
  timeSlotGroupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
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
    backgroundColor: '#4D7399',
    borderColor: '#4D7399',
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

export default BookAppointmentScreen;