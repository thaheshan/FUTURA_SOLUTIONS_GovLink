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

type FeedScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Feed'>;
};

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  comments?: number;
  category: string;
}

interface FilterCategory {
  id: string;
  name: string;
  isActive: boolean;
}

const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
  const [selectedDistrict, setSelectedDistrict] = useState('Select District');
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([
    { id: '1', name: 'All Ministries', isActive: true },
    { id: '2', name: 'Agriculture', isActive: false },
    { id: '3', name: 'Healthcare', isActive: false },
  ]);

  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'New Agricultural Subsidy Program',
      description: 'Watch the video to learn more about the new subsidy program for farmers.',
      date: '2024-01-20',
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=200&fit=crop',
      category: 'Agriculture'
    },
    {
      id: '2',
      title: 'Infrastructure Development in Northern Province',
      description: 'See the progress of the new road construction project in the Northern Province.',
      date: '2024-01-18',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=200&fit=crop',
      comments: 8,
      category: 'Infrastructure'
    },
    {
      id: '3',
      title: 'Healthcare Access Improvement Initiative',
      description: 'Participate in the poll to suggest improvements for healthcare access.',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop',
      comments: 25,
      category: 'Healthcare'
    },
  ];

  const handleFilterPress = (categoryId: string) => {
    setFilterCategories(prev =>
      prev.map(cat => ({
        ...cat,
        isActive: cat.id === categoryId ? !cat.isActive : false
      }))
    );
  };

  const renderNewsItem = (item: NewsItem) => (
    <TouchableOpacity key={item.id} style={styles.newsCard}>
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDescription}>{item.description}</Text>
        <View style={styles.newsFooter}>
          <Text style={styles.newsDate}>{item.date}</Text>
          {item.comments && (
            <View style={styles.commentsContainer}>
              <Text style={styles.commentsIcon}>💬</Text>
              <Text style={styles.commentsCount}>{item.comments}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Government Updates</Text>
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
              <Text style={styles.districtText}>{selectedDistrict}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Categories */}
          <View style={styles.filterContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContainer}
            >
              {filterCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterButton,
                    category.isActive && styles.activeFilterButton
                  ]}
                  onPress={() => handleFilterPress(category.id)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    category.isActive && styles.activeFilterButtonText
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search updates"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* News Feed */}
          <View style={styles.newsContainer}>
            {newsItems.map(renderNewsItem)}
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Bottom Tab Navigator */}
        <TabNavigator activeTab="Feed" />
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
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF2',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D141C',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  districtContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  districtSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8EDF2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  districtText: {
    flex: 1,
    fontSize: 16,
    color: '#4D7399',
    fontWeight: '500',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#4D7399',
  },
  filterContainer: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterScrollContainer: {
    paddingHorizontal: 16,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8EDF2',
  },
  activeFilterButton: {
    backgroundColor: '#26303B',
    borderColor: '#26303B',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#4D7399',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EDF2',
    borderRadius: 8,
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
  newsContainer: {
    paddingHorizontal: 16,
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E8EDF2',
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D141C',
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: '#4D7399',
    lineHeight: 20,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  commentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  commentsCount: {
    fontSize: 12,
    color: '#4D7399',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default FeedScreen;