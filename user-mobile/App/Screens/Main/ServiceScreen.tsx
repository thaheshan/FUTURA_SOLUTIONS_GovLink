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
import { RootStackParamList } from '../../Navigation/AppNavigator';
import TabNavigator from '../../Navigation/TabNavigator';

type ServicesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Services'>;
};

interface Division {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  backgroundColor: string;
  iconColor: string;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ navigation }) => {
  const divisions: Division[] = [
    {
      id: '1',
      title: 'Administration Division',
      subtitle: 'Tap to explore services',
      icon: '🏢',
      backgroundColor: '#4D7399',
      iconColor: '#FFFFFF',
    },
    {
      id: '2',
      title: 'Registrar Division',
      subtitle: 'Tap to explore services',
      icon: '📄',
      backgroundColor: '#4ECDC4',
      iconColor: '#FFFFFF',
    },
    {
      id: '3',
      title: 'Land Division',
      subtitle: 'Tap to explore services',
      icon: '🗺️',
      backgroundColor: '#45B7D1',
      iconColor: '#FFFFFF',
    },
    {
      id: '4',
      title: 'Samurdhi/Welfare Division',
      subtitle: 'Tap to explore services',
      icon: '👥',
      backgroundColor: '#F7DC6F',
      iconColor: '#2C3E50',
    },
    {
      id: '5',
      title: 'Social Services Division',
      subtitle: 'Tap to explore services',
      icon: '🤝',
      backgroundColor: '#85C1E9',
      iconColor: '#FFFFFF',
    },
    {
      id: '6',
      title: 'Planning & Development Division',
      subtitle: 'Tap to explore services',
      icon: '📊',
      backgroundColor: '#82E0AA',
      iconColor: '#2C3E50',
    },
    {
      id: '7',
      title: 'Accounts & Finance Division',
      subtitle: 'Tap to explore services',
      icon: '💰',
      backgroundColor: '#F8C471',
      iconColor: '#2C3E50',
    },
    {
      id: '8',
      title: 'Field Services Division',
      subtitle: 'Tap to explore services',
      icon: '🚛',
      backgroundColor: '#AED6F1',
      iconColor: '#2C3E50',
    },
    {
      id: '9',
      title: 'Disaster Relief & Preparedness (DRP)',
      subtitle: 'Tap to explore services',
      icon: '☀️',
      backgroundColor: '#26303B',
      iconColor: '#F39C12',
    },
    {
      id: '10',
      title: 'Coordinating Units',
      subtitle: 'Tap to explore services',
      icon: '👤',
      backgroundColor: '#34495E',
      iconColor: '#FFFFFF',
    },
  ];

  const handleDivisionPress = (division: Division) => {
    console.log('Division pressed:', division.title);
    // Handle navigation to specific division services
  };

  const renderDivisionCard = (division: Division) => (
    <TouchableOpacity
      key={division.id}
      style={styles.divisionCard}
      onPress={() => handleDivisionPress(division)}
    >
      <View style={[styles.iconContainer, { backgroundColor: division.backgroundColor }]}>
        <Text style={[styles.divisionIcon, { color: division.iconColor }]}>
          {division.icon}
        </Text>
      </View>
      <View style={styles.divisionContent}>
        <Text style={styles.divisionTitle}>{division.title}</Text>
        <Text style={styles.divisionSubtitle}>{division.subtitle}</Text>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrowIcon}>→</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Services</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Section Title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Divisions</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Divisions List */}
          <View style={styles.divisionsContainer}>
            {divisions.map(renderDivisionCard)}
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
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
    backgroundColor: '#F7FAFC',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF2',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backIcon: {
    fontSize: 20,
    color: '#0D141C',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D141C',
  },
  headerSpacer: {
    width: 36,
  },
  sectionTitleContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF2',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D141C',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  divisionsContainer: {
    paddingTop: 8,
  },
  divisionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  divisionIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  divisionContent: {
    flex: 1,
  },
  divisionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D141C',
    marginBottom: 4,
  },
  divisionSubtitle: {
    fontSize: 14,
    color: '#4D7399',
  },
  arrowContainer: {
    padding: 8,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#4D7399',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ServicesScreen;