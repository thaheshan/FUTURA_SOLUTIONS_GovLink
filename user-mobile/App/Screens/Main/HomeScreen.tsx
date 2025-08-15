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
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { RootStackParamList } from '../../Navigation/AppNavigator';
import TabNavigator from '../../Navigation/TabNavigator';

const { width, height } = Dimensions.get('window');

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

interface ServiceItem {
  id: string;
  title: string;
  iconImage: any;
  color: string;
  category: string;
  description: string;
  isPopular?: boolean;
  screen?: keyof RootStackParamList; // Add screen navigation property
}

interface District {
  id: string;
  name: string;
  province: string;
}

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  type: 'announcement' | 'service' | 'news';
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'update' | 'reminder' | 'alert';
}

// Enhanced Icon Components with gradients
const BellIcon = ({ color = '#374151', size = 24, hasNotification = false }) => (
  <View style={{ position: 'relative' }}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
    {hasNotification && (
      <View style={styles.notificationBadge}>
        <Text style={styles.notificationCount}>3</Text>
      </View>
    )}
  </View>
);

const SearchIcon = ({ color = '#6B7280', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon = ({ color = '#4D7399', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LocationIcon = ({ color = '#64748b', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10C21 17 12 23 12 23S3 17 3 10C3 6.13401 6.13401 3 12 3C17.866 3 21 6.13401 21 10Z"
      stroke={color}
      strokeWidth="2"
    />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

const FilterIcon = ({ color = '#6B7280', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const StarIcon = ({ color = '#FFD700', size = 12, filled = true }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedDistrict, setSelectedDistrict] = useState('Vavuniya');
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const bannerScrollRef = useRef<FlatList>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;

  // Enhanced service icons with better organization
  const serviceIcons = {
    birthCertificate: { uri: 'https://cdn-icons-png.flaticon.com/512/2942/2942813.png' },
    deathCertificate: { uri: 'https://cdn-icons-png.flaticon.com/512/2942/2942750.png' },
    marriageCertificate: { uri: 'https://cdn-icons-png.flaticon.com/512/1588/1588717.png' },
    educationCertificate: { uri: 'https://cdn-icons-png.flaticon.com/512/3595/3595030.png' },
    drivingLicense: { uri: 'https://cdn-icons-png.flaticon.com/512/3097/3097122.png' },
    passport: { uri: 'https://cdn-icons-png.flaticon.com/512/2534/2534204.png' },
    landRegistration: { uri: 'https://cdn-icons-png.flaticon.com/512/1048/1048372.png' },
    businessRegistration: { uri: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png' },
    policeReport: { uri: 'https://cdn-icons-png.flaticon.com/512/2942/2942688.png' },
    medicalReport: { uri: 'https://cdn-icons-png.flaticon.com/512/2785/2785482.png' },
    taxServices: { uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
    pensionServices: { uri: 'https://cdn-icons-png.flaticon.com/512/2942/2942304.png' },
    grama: { uri: 'https://cdn-icons-png.flaticon.com/512/2534/2534761.png' },
    income: { uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
    residency: { uri: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png' },
    character: { uri: 'https://cdn-icons-png.flaticon.com/512/2942/2942688.png' },
  };

  const actionIcons = {
    calendar: { uri: 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png' },
    map: { uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' },
    tracking: { uri: 'https://cdn-icons-png.flaticon.com/512/2645/2645897.png' },
    chat: { uri: 'https://cdn-icons-png.flaticon.com/512/2534/2534761.png' },
  };

  // Initialize slide animation
  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Auto-scroll banner with improved timing
  useEffect(() => {
    const interval = setInterval(() => {
      if (bannerScrollRef.current && bannerData.length > 0) {
        const nextIndex = (currentBannerIndex + 1) % bannerData.length;
        bannerScrollRef.current.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentBannerIndex(nextIndex);
      }
    }, 5000); // Increased to 5 seconds for better UX

    return () => clearInterval(interval);
  }, [currentBannerIndex]);

  // Animate dropdown
  useEffect(() => {
    Animated.spring(dropdownAnimation, {
      toValue: showDistrictDropdown ? 1 : 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [showDistrictDropdown]);

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

  const bannerData: BannerItem[] = [
    {
      id: '1',
      title: 'ප්‍රාදේශීය ලේකම් කාර්යාලය',
      subtitle: 'වවුනියා දකුණ - Digital Services Available',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
      type: 'announcement'
    },
    {
      id: '2',
      title: 'New Online Portal Launch',
      subtitle: 'Apply for certificates digitally',
      imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
      type: 'service'
    },
    {
      id: '3',
      title: 'Emergency Services Update',
      subtitle: '24/7 Support Now Available',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop',
      type: 'news'
    },
    {
      id: '4',
      title: 'Digital Sri Lanka 2025',
      subtitle: 'Building Tomorrow Today',
      imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
      type: 'announcement'
    },
  ];

  const services: ServiceItem[] = [
    { 
      id: '1', 
      title: 'Birth Certificate', 
      iconImage: serviceIcons.birthCertificate, 
      color: '#3B82F6', 
      category: 'Certificates',
      description: 'Official birth registration',
      isPopular: true,
      screen: 'ComingSoon'
    },
    { 
      id: '2', 
      title: 'Death Certificate', 
      iconImage: serviceIcons.deathCertificate, 
      color: '#6B7280', 
      category: 'Certificates',
      description: 'Death registration services',
      screen: 'ComingSoon'
    },
    { 
      id: '3', 
      title: 'Marriage Certificate', 
      iconImage: serviceIcons.marriageCertificate, 
      color: '#EF4444', 
      category: 'Certificates',
      description: 'Marriage registration',
      isPopular: true,
      screen: 'ComingSoon'
    },
    { 
      id: '4', 
      title: 'Educational Certificates', 
      iconImage: serviceIcons.educationCertificate, 
      color: '#8B5CF6', 
      category: 'Education',
      description: 'Academic document verification',
      screen: 'ComingSoon'
    },
    { 
      id: '5', 
      title: 'Driving License', 
      iconImage: serviceIcons.drivingLicense, 
      color: '#10B981', 
      category: 'Transportation',
      description: 'License applications & renewals',
      screen: 'ComingSoon'
    },
    { 
      id: '6', 
      title: 'Passport Services', 
      iconImage: serviceIcons.passport, 
      color: '#F59E0B', 
      category: 'Travel',
      description: 'Travel document processing',
      screen: 'ComingSoon'
    },
    { 
      id: '7', 
      title: 'Land Registration', 
      iconImage: serviceIcons.landRegistration, 
      color: '#84CC16', 
      category: 'Property',
      description: 'Property documentation',
      screen: 'ComingSoon'
    },
    { 
      id: '8', 
      title: 'Business Registration', 
      iconImage: serviceIcons.businessRegistration, 
      color: '#06B6D4', 
      category: 'Business',
      description: 'Company incorporation',
      screen: 'ComingSoon'
    },
    { 
      id: '9', 
      title: 'Grama Certificate', 
      iconImage: serviceIcons.grama, 
      color: '#DC2626', 
      category: 'Local Services',
      description: 'Local authority certification',
      isPopular: true,
      screen: 'ComingSoon'
    },
    { 
      id: '10', 
      title: 'Income Certificate', 
      iconImage: serviceIcons.income, 
      color: '#EC4899', 
      category: 'Finance',
      description: 'Income verification',
      screen: 'ComingSoon'
    },
    { 
      id: '11', 
      title: 'Character Certificate', 
      iconImage: serviceIcons.character, 
      color: '#8B5CF6', 
      category: 'Legal',
      description: 'Police character clearance',
      screen: 'ComingSoon'
    },
    { 
      id: '12', 
      title: 'Residency Certificate', 
      iconImage: serviceIcons.residency, 
      color: '#059669', 
      category: 'Legal',
      description: 'Proof of residence',
      screen: 'ComingSoon'
    },
  ];

  const categories = ['All', 'Certificates', 'Legal', 'Education', 'Transportation', 'Business', 'Finance', 'Local Services'];

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setShowDistrictDropdown(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleServicePress = (service: ServiceItem) => {
    if (service.screen) {
      navigation.navigate('BookAppointment');
    }
  };

  const handleBookAppointment = () => {
    navigation.navigate('BookAppointment');
  };

  const handleAIAssistant = () => {
    navigation.navigate('Assistant');
  };

  const handleTrackStatus = () => {
    navigation.navigate('ComingSoon');
  };

  const handleFindOffice = () => {
    navigation.navigate('ComingSoon');
  };

  const handleContact = () => {
    navigation.navigate('ComingSoon');
  };

  const handleViewAllServices = () => {
    navigation.navigate('Services');
  };

  const groupedDistricts = districts.reduce((acc, district) => {
    if (!acc[district.province]) {
      acc[district.province] = [];
    }
    acc[district.province].push(district);
    return acc;
  }, {} as Record<string, District[]>);

  const renderBannerItem = ({ item }: { item: BannerItem }) => (
    <TouchableOpacity style={styles.bannerItem} activeOpacity={0.9}>
      <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <View style={[styles.bannerTypeIndicator, { backgroundColor: getBannerTypeColor(item.type) }]}>
          <Text style={styles.bannerTypeText}>{item.type.toUpperCase()}</Text>
        </View>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const getBannerTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return '#3B82F6';
      case 'service': return '#10B981';
      case 'news': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const renderServiceItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity 
      style={styles.serviceCard} 
      activeOpacity={0.7}
      onPress={() => handleServicePress(item)}
    >
      {item.isPopular && (
        <View style={styles.popularBadge}>
          <StarIcon size={12} color="#FFD700" filled />
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}
      <View style={[styles.serviceIconContainer, { backgroundColor: item.color }]}>
        <View style={styles.serviceIconBackground}>
          <Image source={item.iconImage} style={styles.serviceIconImage} />
        </View>
      </View>
      <Text style={styles.serviceTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.serviceDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.serviceCategoryContainer}>
        <Text style={styles.serviceCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.categoryScrollView}
      contentContainerStyle={styles.categoryContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory(category)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.categoryText,
            selectedCategory === category && styles.categoryTextActive
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const dropdownHeight = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 350],
  });

  const dropdownOpacity = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const slideTransform = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Enhanced Status Bar */}
        <View style={styles.statusBar}>
          <Text style={styles.timeText}>9:41</Text>
          <View style={styles.statusIcons}>
            <View style={styles.signalBars}>
              {[4, 6, 8, 10].map((height, index) => (
                <View key={index} style={[styles.signalBar, { height }]} />
              ))}
            </View>
            <View style={styles.wifiIcon}>
              <Text>📶</Text>
            </View>
            <View style={styles.batteryContainer}>
              <View style={styles.batteryLevel} />
            </View>
          </View>
        </View>

        {/* Enhanced Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.profileContainer} activeOpacity={0.8}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face' }}
                style={styles.profileImage}
              />
              <View style={styles.onlineIndicator} />
            </TouchableOpacity>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName}>Akaash!</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <BellIcon color="#374151" size={24} hasNotification={true} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Enhanced District Selector */}
          <Animated.View 
            style={[
              styles.districtContainer,
              { transform: [{ translateY: slideTransform }] }
            ]}
          >
            <TouchableOpacity
              style={[styles.districtSelector, showDistrictDropdown && styles.districtSelectorActive]}
              onPress={() => setShowDistrictDropdown(!showDistrictDropdown)}
              activeOpacity={0.8}
            >
              <View style={styles.districtSelectorLeft}>
                <LocationIcon color="#64748b" size={16} />
                <Text style={styles.districtText}>{selectedDistrict}</Text>
              </View>
              <Animated.View style={{
                transform: [{ rotate: showDistrictDropdown ? '180deg' : '0deg' }]
              }}>
                <ChevronDownIcon color="#4D7399" size={20} />
              </Animated.View>
            </TouchableOpacity>
            
            {showDistrictDropdown && (
              <Animated.View 
                style={[
                  styles.dropdown,
                  {
                    height: dropdownHeight,
                    opacity: dropdownOpacity,
                  }
                ]}
              >
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {Object.entries(groupedDistricts).map(([province, provinceDistricts]) => (
                    <View key={province}>
                      <Text style={styles.provinceHeader}>{province}</Text>
                      {provinceDistricts.map((district) => (
                        <TouchableOpacity
                          key={district.id}
                          style={[
                            styles.dropdownItem,
                            selectedDistrict === district.name && styles.selectedDropdownItem
                          ]}
                          onPress={() => handleDistrictSelect(district.name)}
                          activeOpacity={0.7}
                        >
                          <Text style={[
                            styles.dropdownItemText,
                            selectedDistrict === district.name && styles.selectedDropdownItemText
                          ]}>{district.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              </Animated.View>
            )}
          </Animated.View>

          {/* Enhanced Auto-scrolling Banner */}
          <Animated.View 
            style={[
              styles.bannerContainer,
              { transform: [{ translateY: slideTransform }] }
            ]}
          >
            <FlatList
              ref={bannerScrollRef}
              data={bannerData}
              renderItem={renderBannerItem}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentBannerIndex(newIndex);
              }}
              decelerationRate="fast"
              snapToInterval={width}
              snapToAlignment="start"
            />
            
            {/* Enhanced Banner Pagination */}
            <View style={styles.paginationContainer}>
              {bannerData.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    bannerScrollRef.current?.scrollToIndex({ index, animated: true });
                    setCurrentBannerIndex(index);
                  }}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={[
                      styles.paginationDot,
                      currentBannerIndex === index && styles.paginationDotActive
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Enhanced Services Section */}
          <Animated.View 
            style={[
              styles.sectionContainer,
              { transform: [{ translateY: slideTransform }] }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Government Services</Text>
              <TouchableOpacity 
                style={styles.viewAllButton} 
                activeOpacity={0.7}
                onPress={handleViewAllServices}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {/* Enhanced Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <SearchIcon color="#6B7280" size={20} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search government services..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => setSearchQuery('')}
                    style={styles.clearSearchButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.clearSearchText}>✕</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
                  <FilterIcon color="#6B7280" size={20} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Category Filter */}
            {renderCategoryFilter()}

            {/* Enhanced Services Grid */}
            {filteredServices.length > 0 ? (
              <FlatList
                data={filteredServices}
                renderItem={renderServiceItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.servicesContainer}
                decelerationRate="fast"
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No services found matching "{searchQuery}"</Text>
                <TouchableOpacity 
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearFiltersText}>Clear Filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>

          {/* Enhanced Quick Actions Section */}
          <Animated.View 
            style={[
              styles.sectionContainer,
              { transform: [{ translateY: slideTransform }] }
            ]}
          >
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            {/* Main Appointment Card */}
            <TouchableOpacity 
              style={styles.appointmentCard} 
              activeOpacity={0.8}
              onPress={handleBookAppointment}
            >
              <View style={styles.appointmentContent}>
                <View style={styles.appointmentIconContainer}>
                  <Image source={actionIcons.calendar} style={styles.appointmentIcon} />
                </View>
                <View style={styles.appointmentTextContainer}>
                  <Text style={styles.appointmentMainTitle}>Book An</Text>
                  <Text style={styles.appointmentMainTitle}>Appointment</Text>
                  <Text style={styles.appointmentSubtitle}>Schedule your visit to government offices easily</Text>
                  <TouchableOpacity 
                    style={styles.appointmentButton} 
                    activeOpacity={0.8}
                    onPress={handleBookAppointment}
                  >
                    <Text style={styles.appointmentButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            {/* Quick Action Grid */}
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity 
                style={styles.quickActionItem} 
                activeOpacity={0.8}
                onPress={handleAIAssistant}
              >
                <View style={styles.quickActionIcon}>
                  <Image source={actionIcons.chat} style={styles.quickActionIconImage} />
                </View>
                <Text style={styles.quickActionText}>AI Assistant</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionItem} 
                activeOpacity={0.8}
                onPress={handleTrackStatus}
              >
                <View style={styles.quickActionIcon}>
                  <Image source={actionIcons.tracking} style={styles.quickActionIconImage} />
                </View>
                <Text style={styles.quickActionText}>Track Status</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionItem} 
                activeOpacity={0.8}
                onPress={handleFindOffice}
              >
                <View style={styles.quickActionIcon}>
                  <Image source={actionIcons.map} style={styles.quickActionIconImage} />
                </View>
                <Text style={styles.quickActionText}>Find Office</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionItem} 
                activeOpacity={0.8}
                onPress={handleContact}
              >
                <View style={styles.quickActionIcon}>
                  <Text style={styles.quickActionEmoji}>📞</Text>
                </View>
                <Text style={styles.quickActionText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Enhanced Action Cards */}
          <Animated.View 
            style={[
              styles.actionCardsContainer,
              { transform: [{ translateY: slideTransform }] }
            ]}
          >
            {/* Track Issues Card */}
            <TouchableOpacity 
              style={styles.trackIssuesCard} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ComingSoon')}
            >
              <View style={styles.actionCardContent}>
                <View style={styles.actionCardHeader}>
                  <View style={styles.actionCardIconContainer}>
                    <Image source={actionIcons.map} style={styles.actionCardIcon} />
                  </View>
                  <Text style={styles.actionCardTitle}>Track Issues in Your Area</Text>
                </View>
                <Text style={styles.actionCardSubtitle}>Monitor local infrastructure and service issues in real-time with our interactive map</Text>
                <View style={styles.actionCardStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>24</Text>
                    <Text style={styles.statLabel}>Active Issues</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>156</Text>
                    <Text style={styles.statLabel}>Resolved</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('ComingSoon')}
                >
                  <Text style={styles.actionButtonText}>Explore Map</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Track Requests Card */}
            <TouchableOpacity 
              style={styles.trackRequestCard} 
              activeOpacity={0.8}
              onPress={handleTrackStatus}
            >
              <View style={styles.trackRequestContent}>
                <View style={styles.trackRequestLeft}>
                  <View style={styles.trackRequestIconContainer}>
                    <Image source={actionIcons.tracking} style={styles.trackRequestIcon} />
                  </View>
                  <View style={styles.trackRequestTextContainer}>
                    <Text style={styles.trackRequestTitle}>Track Your</Text>
                    <Text style={styles.trackRequestTitle}>Requests</Text>
                    <Text style={styles.trackRequestSubtitle}>Monitor application status and get real-time updates</Text>
                    <View style={styles.trackRequestBadge}>
                      <Text style={styles.trackRequestBadgeText}>3 Pending</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.trackRequestButton} 
                  activeOpacity={0.8}
                  onPress={handleTrackStatus}
                >
                  <Text style={styles.trackRequestButtonText}>Track Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Recent Activity Card */}
            <View style={styles.recentActivityCard}>
              <View style={styles.recentActivityHeader}>
                <Text style={styles.recentActivityTitle}>Recent Activity</Text>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('ComingSoon')}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Text style={styles.activityEmoji}>✅</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>Birth Certificate approved</Text>
                    <Text style={styles.activityTime}>2 hours ago</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Text style={styles.activityEmoji}>⏳</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>Grama Certificate under review</Text>
                    <Text style={styles.activityTime}>1 day ago</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Text style={styles.activityEmoji}>📅</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>Appointment scheduled</Text>
                    <Text style={styles.activityTime}>3 days ago</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Emergency Contact Section */}
          <Animated.View 
            style={[
              styles.emergencySection,
              { transform: [{ translateY: slideTransform }] }
            ]}
          >
            <View style={styles.emergencyHeader}>
              <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
            </View>
            <View style={styles.emergencyGrid}>
              <TouchableOpacity 
                style={styles.emergencyItem} 
                activeOpacity={0.8}
                onPress={handleContact}
              >
                <View style={styles.emergencyIcon}>
                  <Text style={styles.emergencyEmoji}>🚨</Text>
                </View>
                <Text style={styles.emergencyText}>Police</Text>
                <Text style={styles.emergencyNumber}>119</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.emergencyItem} 
                activeOpacity={0.8}
                onPress={handleContact}
              >
                <View style={styles.emergencyIcon}>
                  <Text style={styles.emergencyEmoji}>🚑</Text>
                </View>
                <Text style={styles.emergencyText}>Ambulance</Text>
                <Text style={styles.emergencyNumber}>110</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.emergencyItem} 
                activeOpacity={0.8}
                onPress={handleContact}
              >
                <View style={styles.emergencyIcon}>
                  <Text style={styles.emergencyEmoji}>🚒</Text>
                </View>
                <Text style={styles.emergencyText}>Fire</Text>
                <Text style={styles.emergencyNumber}>111</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Enhanced Bottom Tab Navigator */}
        <TabNavigator activeTab="Home" />
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
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  signalBar: {
    width: 3,
    backgroundColor: '#000000',
    borderRadius: 1,
  },
  wifiIcon: {
    marginLeft: 4,
  },
  batteryContainer: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 2,
    marginLeft: 4,
  },
  batteryLevel: {
    flex: 1,
    backgroundColor: '#000000',
    margin: 1,
    borderRadius: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    marginRight: 15,
    position: 'relative',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#4D7399',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  welcomeContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  userName: {
    fontSize: 22,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: 2,
  },
  notificationButton: {
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  districtContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    position: 'relative',
    zIndex: 10,
  },
  districtSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  districtSelectorActive: {
    borderColor: '#4D7399',
    shadowOpacity: 0.1,
  },
  districtSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  districtText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 20,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 350,
  },
  provinceHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4D7399',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dropdownItem: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  selectedDropdownItem: {
    backgroundColor: '#EBF4FF',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
  },
  selectedDropdownItemText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  bannerContainer: {
    marginBottom: 32,
    position: 'relative',
  },
  bannerItem: {
    width: width,
    paddingHorizontal: 20,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  bannerTypeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  bannerTypeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '500',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#4D7399',
    width: 24,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4D7399',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 12,
  },
  clearSearchButton: {
    padding: 4,
    marginRight: 8,
  },
  clearSearchText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  filterButton: {
    padding: 4,
  },
  categoryScrollView: {
    marginBottom: 20,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryButtonActive: {
    backgroundColor: '#4D7399',
    borderColor: '#4D7399',
  },
  categoryText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  servicesContainer: {
    paddingHorizontal: 20,
  },
  serviceCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 1,
  },
  popularText: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '700',
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  serviceIconBackground: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIconImage: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
  },
  serviceTitle: {
    fontSize: 14,
    color: '#0F172A',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 6,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
  },
  serviceCategoryContainer: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serviceCategory: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
  },
  noResultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: '#4D7399',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFiltersText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  appointmentCard: {
    marginHorizontal: 20,
    backgroundColor: '#EBF4FF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 28,
    minHeight: 140,
  },
  appointmentIconContainer: {
    marginRight: 24,
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentIcon: {
    width: 32,
    height: 32,
    tintColor: '#0d9488',
  },
  appointmentTextContainer: {
    flex: 1,
  },
  appointmentMainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  appointmentSubtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 22,
  },
  appointmentButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    alignSelf: 'flex-start',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  appointmentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIconImage: {
    width: 24,
    height: 24,
    tintColor: '#4D7399',
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  actionCardsContainer: {
    paddingHorizontal: 20,
  },
  trackIssuesCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  actionCardContent: {
    padding: 28,
    minHeight: 200,
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionCardIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionCardIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },
  actionCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 26,
  },
  actionCardSubtitle: {
    fontSize: 15,
    color: '#94A3B8',
    marginBottom: 20,
    lineHeight: 22,
  },
  actionCardStats: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '700',
  },
  trackRequestCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  trackRequestContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 28,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  trackRequestLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trackRequestIconContainer: {
    marginRight: 20,
    width: 56,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackRequestIcon: {
    width: 28,
    height: 28,
    tintColor: '#0d9488',
  },
  trackRequestTextContainer: {
    flex: 1,
  },
  trackRequestTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  trackRequestSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 20,
  },
  trackRequestBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  trackRequestBadgeText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  trackRequestButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  trackRequestButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  recentActivityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  recentActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4D7399',
    fontWeight: '600',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '400',
  },
  emergencySection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  emergencyHeader: {
    marginBottom: 20,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  emergencyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  emergencyItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FEF2F2',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyEmoji: {
    fontSize: 24,
  },
  emergencyText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  emergencyNumber: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default HomeScreen;