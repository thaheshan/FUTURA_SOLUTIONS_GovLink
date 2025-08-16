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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigation/AppNavigator';
import TabNavigator from '../../Navigation/TabNavigator';

type ServicesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Services'>;
};

interface Division {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  bannerImage: string;
  bgColor: string;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const divisions: Division[] = [
    {
      id: "administration",
      name: "Administration Division",
      subtitle: "Tap to explore services",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop",
      bgColor: "#F1F5F9", // slate-100
    },
    {
      id: "registrar",
      name: "Registrar Division",
      subtitle: "Tap to explore services",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=100&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=200&fit=crop",
      bgColor: "#CCFBF1", // teal-100
    },
    {
      id: "land",
      name: "Land Division",
      subtitle: "Tap to explore services",
      image: "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=100&h=100&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=200&fit=crop",
      bgColor: "#DCFCE7", // green-100
    },
    {
      id: "welfare",
      name: "Samurdhi/Welfare Division",
      subtitle: "Tap to explore services",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=100&h=100&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=200&fit=crop",
      bgColor: "#FEF3C7", // yellow-100
    },
    {
      id: "social",
      name: "Social Services Division",
      subtitle: "Tap to explore services",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop",
      bgColor: "#F3F4F6", // gray-100
    },
    {
      id: "planning",
      name: "Planning & Development Division",
      subtitle: "Tap to explore services",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop",
      bgColor: "#DBEAFE", // blue-100
    },
    {
      id: "accounts",
      name: "Accounts & Finance Division",
      subtitle: "Tap to explore services",
      image: "https://images.unsplash.com/photo-1554224154-26032fced8bd?w=100&h=100&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop",
      bgColor: "#FED7AA", // orange-100
    },
    {
      id: "field",
      name: "Field Services Division",
      subtitle: "Tap to explore services",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&h=100&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=200&fit=crop",
      bgColor: "#F3F4F6", // gray-100
    },
    {
      id: "disaster",
      name: "Disaster Relief & Preparedness (DRP)",
      subtitle: "Tap to explore services",
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=100&h=100&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop",
      bgColor: "#334155", // slate-700
    },
    {
      id: "coordinating",
      name: "Coordinating Units",
      subtitle: "Tap to explore services",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=100&h=100&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=200&fit=crop",
      bgColor: "#334155", // slate-700
    },
  ];

  const filteredDivisions = divisions.filter((division) =>
    division.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDivisionPress = (divisionId: string) => {
    // Navigate to specific division detail screen
    console.log(`Navigate to division: ${divisionId}`);
    
    // Check if it's the registrar division and navigate to NIC Services
    if (divisionId === 'registrar') {
      navigation.navigate('NICServices');
    } else {
      // For other divisions, you can navigate to a coming soon screen or division detail
      navigation.navigate('ComingSoon');
      // Uncomment below line when you have division detail screens
      // navigation.navigate('DivisionDetail', { divisionId });
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderDivisionCard = (division: Division) => (
    <TouchableOpacity
      key={division.id}
      style={styles.divisionCard}
      onPress={() => handleDivisionPress(division.id)}
      activeOpacity={0.8}
    >
      {/* Banner Image Background */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: division.bannerImage }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        
        {/* Icon Container - Centered */}
        <View style={styles.iconContainer}>
          <View 
            style={[
              styles.iconWrapper, 
              { backgroundColor: division.bgColor },
              division.bgColor === "#334155" && styles.darkIconWrapper
            ]}
          >
            <Image
              source={{ uri: division.image }}
              style={styles.divisionIcon}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* Content Container */}
      <View style={styles.cardContent}>
        <Text style={styles.divisionName}>{division.name}</Text>
        <Text style={styles.divisionSubtitle}>{division.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Services</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search services"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Divisions Title */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Divisions</Text>
          </View>

          {/* Divisions List */}
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.divisionsContainer}>
              {filteredDivisions.length > 0 ? (
                filteredDivisions.map(renderDivisionCard)
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    No services found matching your search.
                  </Text>
                </View>
              )}
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // gray-200
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    fontSize: 20,
    color: '#4B5563', // gray-600
    fontWeight: '500',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827', // gray-900
  },
  headerSpacer: {
    width: 28,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingLeft: 12,
    paddingRight: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    color: '#9CA3AF', // gray-400
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827', // gray-900
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  divisionsContainer: {
    gap: 16,
  },
  divisionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    marginBottom: 16,
  },
  bannerContainer: {
    position: 'relative',
    height: 192, // h-48 equivalent
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 80, // w-20
    height: 80, // h-20
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12, // p-3
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    // backdrop-blur-sm bg-opacity-90 effect
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  darkIconWrapper: {
    backgroundColor: 'rgba(51, 65, 85, 0.9)', // slate-700 with opacity
  },
  divisionIcon: {
    width: 48, // w-12
    height: 48, // h-12
  },
  cardContent: {
    padding: 16,
  },
  divisionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827', // gray-900
    lineHeight: 22, // leading-tight
    marginBottom: 4,
  },
  divisionSubtitle: {
    fontSize: 14,
    color: '#6B7280', // gray-500
    lineHeight: 20,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 32, // py-8
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280', // gray-500
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ServicesScreen;