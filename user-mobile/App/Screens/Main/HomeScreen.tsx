import React, { useState } from 'react';
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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigation/AppNavigator';
import TabNavigator from '../../Navigation/TabNavigator';

const { width } = Dimensions.get('window');

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  color: string;
}

interface District {
  id: string;
  name: string;
  province: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedDistrict, setSelectedDistrict] = useState('Vavuniya');
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const districts: District[] = [
    // Western Province
    { id: '1', name: 'Colombo', province: 'Western Province' },
    { id: '2', name: 'Gampaha', province: 'Western Province' },
    { id: '3', name: 'Kalutara', province: 'Western Province' },
    
    // Central Province
    { id: '4', name: 'Kandy', province: 'Central Province' },
    { id: '5', name: 'Matale', province: 'Central Province' },
    { id: '6', name: 'Nuwara Eliya', province: 'Central Province' },
    
    // Southern Province
    { id: '7', name: 'Galle', province: 'Southern Province' },
    { id: '8', name: 'Hambantota', province: 'Southern Province' },
    { id: '9', name: 'Matara', province: 'Southern Province' },
    
    // Northern Province
    { id: '10', name: 'Jaffna', province: 'Northern Province' },
    { id: '11', name: 'Kilinochchi', province: 'Northern Province' },
    { id: '12', name: 'Mannar', province: 'Northern Province' },
    { id: '13', name: 'Mullaitivu', province: 'Northern Province' },
    { id: '14', name: 'Vavuniya', province: 'Northern Province' },
    
    // Eastern Province
    { id: '15', name: 'Trincomalee', province: 'Eastern Province' },
    { id: '16', name: 'Batticaloa', province: 'Eastern Province' },
    { id: '17', name: 'Ampara', province: 'Eastern Province' },
    
    // North Western Province
    { id: '18', name: 'Kurunegala', province: 'North Western Province' },
    { id: '19', name: 'Puttalam', province: 'North Western Province' },
    
    // North Central Province
    { id: '20', name: 'Anuradhapura', province: 'North Central Province' },
    { id: '21', name: 'Polonnaruwa', province: 'North Central Province' },
    
    // Uva Province
    { id: '22', name: 'Badulla', province: 'Uva Province' },
    { id: '23', name: 'Moneragala', province: 'Uva Province' },
    
    // Sabaragamuwa Province
    { id: '24', name: 'Ratnapura', province: 'Sabaragamuwa Province' },
    { id: '25', name: 'Kegalle', province: 'Sabaragamuwa Province' },
  ];

  const services: ServiceItem[] = [
    { id: '1', title: 'Educational certificates', icon: '🎓', color: '#4D7399' },
    { id: '2', title: 'Birth Certificates', icon: '👶', color: '#F59E0B' },
    { id: '3', title: 'Marriage Certificates', icon: '💍', color: '#EF4444' },
    { id: '4', title: 'Death Certificates', icon: '🕊️', color: '#6B7280' },
  ];

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setShowDistrictDropdown(false);
  };

  const groupedDistricts = districts.reduce((acc, district) => {
    if (!acc[district.province]) {
      acc[district.province] = [];
    }
    acc[district.province].push(district);
    return acc;
  }, {} as Record<string, District[]>);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.profileContainer}>
              <Image
                source={{ uri: 'https://via.placeholder.com/40x40/4D7399/FFFFFF?text=A' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.userName}>Akaash!</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* District Selector */}
          <View style={styles.districtContainer}>
            <TouchableOpacity
              style={styles.districtSelector}
              onPress={() => setShowDistrictDropdown(!showDistrictDropdown)}
            >
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.districtText}>{selectedDistrict}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            
            {showDistrictDropdown && (
              <View style={styles.dropdown}>
                <ScrollView style={styles.dropdownScroll}>
                  {Object.entries(groupedDistricts).map(([province, provinceDistricts]) => (
                    <View key={province}>
                      <Text style={styles.provinceHeader}>{province}</Text>
                      {provinceDistricts.map((district) => (
                        <TouchableOpacity
                          key={district.id}
                          style={styles.dropdownItem}
                          onPress={() => handleDistrictSelect(district.name)}
                        >
                          <Text style={styles.dropdownItemText}>{district.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Banner Image */}
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/350x150/4D7399/FFFFFF?text=Government+Services+Banner' }}
              style={styles.bannerImage}
            />
          </View>

          {/* Services Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Services</Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search Services"
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Services Grid */}
            <View style={styles.servicesGrid}>
              {services.map((service) => (
                <TouchableOpacity key={service.id} style={styles.serviceCard}>
                  <View style={[styles.serviceIconContainer, { backgroundColor: service.color }]}>
                    <Text style={styles.serviceIcon}>{service.icon}</Text>
                  </View>
                  <Text style={styles.serviceTitle} numberOfLines={2}>
                    {service.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Appointments Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Appointments</Text>
            <TouchableOpacity style={styles.appointmentCard}>
              <View style={styles.appointmentContent}>
                <View style={styles.appointmentIcon}>
                  <Text style={styles.appointmentIconText}>📅</Text>
                </View>
                <View style={styles.appointmentText}>
                  <Text style={styles.appointmentTitle}>Book An</Text>
                  <Text style={styles.appointmentTitle}>Appointment</Text>
                  <TouchableOpacity style={styles.appointmentButton}>
                    <Text style={styles.appointmentButtonText}>Click Here</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Action Cards */}
          <View style={styles.actionCardsContainer}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionCardContent}>
                <Text style={styles.actionCardTitle}>Track Issues in Your Area</Text>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Click Here</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.trackRequestCard}>
              <View style={styles.trackRequestContent}>
                <View style={styles.trackRequestIcon}>
                  <Text style={styles.trackRequestIconText}>📱</Text>
                </View>
                <TouchableOpacity style={styles.trackRequestButton}>
                  <Text style={styles.trackRequestButtonText}>Track Requests</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Bottom Tab Navigator */}
        <TabNavigator activeTab="Home" />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcomeContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#4D7399',
    fontWeight: '400',
  },
  userName: {
    fontSize: 18,
    color: '#0D141C',
    fontWeight: '600',
  },
  notificationButton: {
    padding: 8,
  },
  notificationIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  districtContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    position: 'relative',
    zIndex: 10,
  },
  districtSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  districtText: {
    flex: 1,
    fontSize: 16,
    color: '#0D141C',
    fontWeight: '500',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#4D7399',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
  },
  dropdownScroll: {
    maxHeight: 300,
  },
  provinceHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D141C',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F7FAFC',
  },
  dropdownItem: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF2',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#0D141C',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0D141C',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EDF2',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#4D7399',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0D141C',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  serviceTitle: {
    fontSize: 14,
    color: '#0D141C',
    textAlign: 'center',
    fontWeight: '500',
  },
  appointmentCard: {
    marginHorizontal: 16,
    backgroundColor: '#E8EDF2',
    borderRadius: 12,
    overflow: 'hidden',
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  appointmentIcon: {
    marginRight: 16,
  },
  appointmentIconText: {
    fontSize: 40,
  },
  appointmentText: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D141C',
    marginBottom: 2,
  },
  appointmentButton: {
    backgroundColor: '#26303B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  appointmentButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionCardsContainer: {
    paddingHorizontal: 16,
  },
  actionCard: {
    backgroundColor: '#26303B',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  actionCardContent: {
    padding: 16,
    alignItems: 'center',
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#E8EDF2',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  actionButtonText: {
    color: '#26303B',
    fontSize: 14,
    fontWeight: '600',
  },
  trackRequestCard: {
    backgroundColor: '#E8EDF2',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  trackRequestContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  trackRequestIcon: {
    flex: 1,
  },
  trackRequestIconText: {
    fontSize: 40,
  },
  trackRequestButton: {
    backgroundColor: '#26303B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  trackRequestButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;