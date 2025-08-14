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
  Switch,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigation/AppNavigator';
import TabNavigator from '../../Navigation/TabNavigator';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

interface MenuItem {
  id: string;
  title: string;
  hasSwitch?: boolean;
  hasArrow?: boolean;
  value?: string;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const settingsItems: MenuItem[] = [
    { id: '1', title: 'Language', value: 'English', hasArrow: true },
    { id: '2', title: 'Notifications', hasSwitch: true },
    { id: '3', title: 'Help Center', hasArrow: true },
    { id: '4', title: 'About', hasArrow: true },
  ];

  const documentsItems: MenuItem[] = [
    { id: '5', title: 'National ID', hasArrow: true },
    { id: '6', title: 'Driver\'s License', hasArrow: true },
    { id: '7', title: 'Passport', hasArrow: true },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity key={item.id} style={styles.menuItem}>
      <Text style={styles.menuItemText}>{item.title}</Text>
      <View style={styles.menuItemRight}>
        {item.value && (
          <Text style={styles.menuItemValue}>{item.value}</Text>
        )}
        {item.hasSwitch && (
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E8EDF2', true: '#4D7399' }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
            style={styles.switch}
          />
        )}
        {item.hasArrow && (
          <Text style={styles.arrowIcon}>→</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#26303B" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: 'https://via.placeholder.com/120x120/4D7399/FFFFFF?text=AP' }}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Arun Perera</Text>
              <Text style={styles.profileEmail}>arun.perera@email.com</Text>
              <Text style={styles.profileLocation}>Colombo</Text>
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.menuContainer}>
              {settingsItems.map(renderMenuItem)}
            </View>
          </View>

          {/* Documents Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Documents</Text>
            <View style={styles.menuContainer}>
              {documentsItems.map(renderMenuItem)}
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Bottom Tab Navigator */}
        <TabNavigator activeTab="Profile" />
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
    backgroundColor: '#26303B',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileSection: {
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8EDF2',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0D141C',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#4D7399',
    marginBottom: 2,
  },
  profileLocation: {
    fontSize: 16,
    color: '#0D141C',
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0D141C',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  menuItemText: {
    fontSize: 16,
    color: '#0D141C',
    fontWeight: '500',
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 16,
    color: '#4D7399',
    marginRight: 8,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
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

export default ProfileScreen;