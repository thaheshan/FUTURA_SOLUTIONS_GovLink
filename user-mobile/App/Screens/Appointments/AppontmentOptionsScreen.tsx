import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';

// Import the enhanced navigation types
import { RootStackParamList } from '../../Navigation/AppNavigator';
import TabNavigator from '../../Navigation/TabNavigator';

interface BookAppointmentOptionsScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BookAppointmentOptions'>;
}

// Back Arrow Icon Component
const ArrowLeftIcon = ({ color = '#0F172A', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BookAppointmentOptionsScreen: React.FC<BookAppointmentOptionsScreenProps> = ({ navigation }) => {
  const appointmentTypes = [
    {
      id: 'complaint',
      title: 'File a Complaint',
      description: 'Report an issue or concern about a service or experience.',
      backgroundColor: '#FEF2F2',
      textColor: '#DC2626',
    },
    {
      id: 'service',
      title: 'Request a Service',
      description: 'Schedule a specific service, such as maintenance or repair.',
      backgroundColor: '#FEF3C7',
      textColor: '#D97706',
    },
    {
      id: 'inquiry',
      title: 'General Inquiry',
      description: 'Ask questions or seek information about services or policies.',
      backgroundColor: '#F0FDF4',
      textColor: '#059669',
    },
  ];

  const handleOptionSelect = (type: 'complaint' | 'service' | 'inquiry') => {
    navigation.navigate('BookAppointmentDetail', { type });
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
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>What type of appointment would you like to book?</Text>
          
          <View style={styles.optionsContainer}>
            {appointmentTypes.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={() => handleOptionSelect(option.id as any)}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionCategory}>{option.id === 'complaint' ? 'File Complaint' : option.id === 'service' ? 'Request Service' : 'General Inquiry'}</Text>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                  <View style={[styles.optionImageContainer, { backgroundColor: option.backgroundColor }]}>
                    <View style={styles.imagePlaceholder}>
                      <Text style={[styles.imageEmoji, { color: option.textColor }]}>
                        {option.id === 'complaint' ? '📝' : option.id === 'service' ? '🔧' : '❓'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  optionCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  optionImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEmoji: {
    fontSize: 32,
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
  navItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  navTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default BookAppointmentOptionsScreen;