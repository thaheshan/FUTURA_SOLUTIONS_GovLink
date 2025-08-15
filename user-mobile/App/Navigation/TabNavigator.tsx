import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle } from 'react-native-svg';
import { RootStackParamListLegacy } from '../Types/Navigation';

import centerIconImage from '../../assets/Images/AI- ASSISTANT 2.png';

type NavigationProp = NativeStackNavigationProp<RootStackParamListLegacy>;

interface TabNavigatorProps {
  activeTab?: string;
}

// Custom Icon Components
const HomeIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SearchIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="11"
      cy="11"
      r="8"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M21 21L16.65 16.65"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const FeedIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 11C4 11 5 10 8 10S12 11 12 11 13 10 16 10 20 11 20 11V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V11Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 11V4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 3V11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M8 7H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const ProfileIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const TabNavigator: React.FC<TabNavigatorProps> = ({ 
  activeTab
}) => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  
  const currentTab = activeTab || route.name;

  const handleTabPress = (tabName: string) => {
    if (currentTab !== tabName) {
      switch (tabName) {
        case 'Home':
          navigation.navigate('Home');
          break;
        case 'Services':
          navigation.navigate('Services');
          break;
        case 'Assistant':
          navigation.navigate('Assistant');
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

  const renderIcon = (tabName: string, isActive: boolean) => {
    // Active state uses the brand color, inactive uses white
    const iconColor = isActive ? '#9BDADC' : '#FFFFFF';
    const iconSize = isActive ? 22 : 20; // Slightly larger when active

    switch (tabName) {
      case 'Home':
        return <HomeIcon color={iconColor} size={iconSize} />;
      case 'Services':
        return <SearchIcon color={iconColor} size={iconSize} />;
      case 'Feed':
        return <FeedIcon color={iconColor} size={iconSize} />;
      case 'Profile':
        return <ProfileIcon color={iconColor} size={iconSize} />;
      default:
        return null;
    }
  };

  const tabs = [
    { name: 'Home', label: 'Home' },
    { name: 'Services', label: 'Services' },
    { name: 'Assistant', label: 'Assistant', isCenter: true },
    { name: 'Feed', label: 'Feed' },
    { name: 'Profile', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.name;
          const isCenter = tab.isCenter;
          
          if (isCenter) {
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.centerNavItem}
                onPress={() => handleTabPress(tab.name)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.centerNavButton,
                  isActive && styles.activeCenterNavButton
                ]}>
                  <View style={[
                    styles.centerIconContainer,
                    isActive && styles.activeCenterIconContainer
                  ]}>
                    <Image 
                      source={centerIconImage}
                      style={[
                        styles.centerNavImage,
                        isActive && styles.activeCenterNavImage
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }
          
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.bottomNavItem}
              onPress={() => handleTabPress(tab.name)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconContainer,
                isActive && styles.activeIconContainer
              ]}>
                {renderIcon(tab.name, isActive)}
              </View>
              <Text style={[
                styles.bottomNavText,
                isActive && styles.activeNavText
              ]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#26303B',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    borderRadius: 12,
  },
  bottomNavItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent', // No background color
  },
  activeIconContainer: {
    backgroundColor: 'transparent', // Removed background color for active state
    // Optional: Add a subtle scale effect for active state
    transform: [{ scale: 1.1 }],
  },
  bottomNavText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeNavText: {
    color: '#9BDADC',
    fontWeight: '900',
  },
  centerNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    top: -8,
  },
  centerNavButton: {
    width: 94,
    height: 94,
    borderRadius: 72,
    bottom: 20,
    backgroundColor: '#A7D5D7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  activeCenterNavButton: {
    backgroundColor: '#9BDADC',
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.05 }],
  },
  centerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 72,
    backgroundColor: '#26303B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCenterIconContainer: {
    backgroundColor: '#1F2937', // Slightly darker when active
  },
  centerNavImage: {
    width: 36,
    height: 36,
    tintColor: '#FFFFFF',
  },
  activeCenterNavImage: {
    tintColor: '#9BDADC', // Brand color when active
    width: 38, // Slightly larger when active
    height: 38,
  },
});

export default TabNavigator;

