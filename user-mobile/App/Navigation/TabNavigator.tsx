import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TabNavigatorProps {
  activeTab?: string;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({ 
  activeTab 
}) => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  
  // Get current route name, prioritize activeTab prop over route detection
  const currentTab = activeTab || route.name;

  const handleTabPress = (tabName: string) => {
    // Only navigate if we're not already on that screen
    if (currentTab !== tabName) {
      switch (tabName) {
        case 'Home':
          navigation.navigate('Home');
          break;
        case 'Services':
          navigation.navigate('Services');
          break;
        case 'Assistant':
          // navigation.navigate('Assistant'); // Uncomment when Assistant screen is added
          console.log('Assistant navigation - Screen not implemented yet');
          break;
        case 'Feed':
          navigation.navigate('Feed');
          break;
        case 'Profile':
          navigation.navigate('Profile');
          break;
        default:
          break;
      }
    }
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.bottomNavItem}
        onPress={() => handleTabPress('Home')}
      >
        <Text style={[
          styles.bottomNavIcon,
          currentTab === 'Home' && styles.activeNavIcon
        ]}>🏠</Text>
        <Text style={[
          styles.bottomNavText,
          currentTab === 'Home' && styles.activeNavText
        ]}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.bottomNavItem}
        onPress={() => handleTabPress('Services')}
      >
        <Text style={[
          styles.bottomNavIcon,
          currentTab === 'Services' && styles.activeNavIcon
        ]}>🔍</Text>
        <Text style={[
          styles.bottomNavText,
          currentTab === 'Services' && styles.activeNavText
        ]}>Services</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.bottomNavItem, styles.centerNavItem]}
        onPress={() => handleTabPress('Assistant')}
      >
        <View style={[
          styles.centerNavButton,
          currentTab === 'Assistant' && styles.activeCenterNavButton
        ]}>
          <Text style={styles.centerNavIcon}>🤖</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.bottomNavItem}
        onPress={() => handleTabPress('Feed')}
      >
        <Text style={[
          styles.bottomNavIcon,
          currentTab === 'Feed' && styles.activeNavIcon
        ]}>📰</Text>
        <Text style={[
          styles.bottomNavText,
          currentTab === 'Feed' && styles.activeNavText
        ]}>Feed</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.bottomNavItem}
        onPress={() => handleTabPress('Profile')}
      >
        <Text style={[
          styles.bottomNavIcon,
          currentTab === 'Profile' && styles.activeNavIcon
        ]}>👤</Text>
        <Text style={[
          styles.bottomNavText,
          currentTab === 'Profile' && styles.activeNavText
        ]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#26303B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bottomNavItem: {
    alignItems: 'center',
    flex: 1,
  },
  bottomNavIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bottomNavText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activeNavIcon: {
    color: '#4D7399',
  },
  activeNavText: {
    color: '#4D7399',
  },
  centerNavItem: {
    position: 'relative',
    top: -15,
  },
  centerNavButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4D7399',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#26303B',
  },
  activeCenterNavButton: {
    backgroundColor: '#5A87B8',
  },
  centerNavIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});

export default TabNavigator;