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
  Modal,
  FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigation/AppNavigator';
import TabNavigator from '../../Navigation/TabNavigator';

type FeedScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Feed'>;
};

interface District {
  id: string;
  name: string;
  province: string;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  likes: number;
  dislikes: number;
  comments: number;
  category: string;
  isLiked: boolean;
  isDisliked: boolean;
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

  const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([
    { id: '1', name: 'All Ministries', isActive: true },
    { id: '2', name: 'Agriculture', isActive: false },
    { id: '3', name: 'Health', isActive: false },
    { id: '4', name: 'Education', isActive: false },
    { id: '5', name: 'Finance', isActive: false },
    { id: '6', name: 'Defense', isActive: false },
    { id: '7', name: 'Transport', isActive: false },
    { id: '8', name: 'Tourism', isActive: false },
    { id: '9', name: 'Energy', isActive: false },
    { id: '10', name: 'Environment', isActive: false },
    { id: '11', name: 'Justice', isActive: false },
    { id: '12', name: 'Trade', isActive: false },
    { id: '13', name: 'Urban Development', isActive: false },
    { id: '14', name: 'Labour', isActive: false },
    { id: '15', name: 'Foreign Affairs', isActive: false },
    { id: '16', name: 'Technology', isActive: false },
    { id: '17', name: 'Sports', isActive: false },
    { id: '18', name: 'Fisheries', isActive: false },
    { id: '19', name: 'Social Services', isActive: false },
    { id: '20', name: 'Housing', isActive: false },
  ]);

  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'New Agricultural Subsidy Program Launched',
      description: 'The Ministry of Agriculture announces a comprehensive subsidy program to support farmers across all districts with enhanced financial assistance.',
      date: '2024-01-20',
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=200&fit=crop',
      likes: 245,
      dislikes: 12,
      comments: 38,
      category: 'Agriculture',
      isLiked: false,
      isDisliked: false,
    },
    {
      id: '2',
      title: 'Infrastructure Development in Northern Province',
      description: 'Major road construction and bridge development projects are underway to improve connectivity in the Northern Province districts.',
      date: '2024-01-18',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=200&fit=crop',
      likes: 189,
      dislikes: 8,
      comments: 25,
      category: 'Urban Development',
      isLiked: false,
      isDisliked: false,
    },
    {
      id: '3',
      title: 'Healthcare Access Improvement Initiative',
      description: 'New mobile health units deployed across rural districts to provide better healthcare access to remote communities.',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop',
      likes: 312,
      dislikes: 5,
      comments: 67,
      category: 'Health',
      isLiked: false,
      isDisliked: false,
    },
    {
      id: '4',
      title: 'Digital Education Platform Launch',
      description: 'Ministry of Education introduces comprehensive online learning platform for students across all provinces.',
      date: '2024-01-12',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop',
      likes: 156,
      dislikes: 3,
      comments: 42,
      category: 'Education',
      isLiked: false,
      isDisliked: false,
    },
    {
      id: '5',
      title: 'Renewable Energy Projects Expansion',
      description: 'Solar and wind energy projects to be established in multiple districts to achieve sustainable energy goals.',
      date: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=200&fit=crop',
      likes: 278,
      dislikes: 15,
      comments: 53,
      category: 'Energy',
      isLiked: false,
      isDisliked: false,
    },
  ]);

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district.name);
    setShowDistrictDropdown(false);
  };

  const handleFilterPress = (categoryId: string) => {
    setFilterCategories(prev =>
      prev.map(cat => ({
        ...cat,
        isActive: cat.id === categoryId ? !cat.isActive : cat.id === '1' ? false : cat.isActive
      }))
    );
  };

  const handleLike = (itemId: string) => {
    setNewsItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          if (item.isLiked) {
            return { ...item, isLiked: false, likes: item.likes - 1 };
          } else {
            return {
              ...item,
              isLiked: true,
              isDisliked: false,
              likes: item.likes + 1,
              dislikes: item.isDisliked ? item.dislikes - 1 : item.dislikes
            };
          }
        }
        return item;
      })
    );
  };

  const handleDislike = (itemId: string) => {
    setNewsItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          if (item.isDisliked) {
            return { ...item, isDisliked: false, dislikes: item.dislikes - 1 };
          } else {
            return {
              ...item,
              isDisliked: true,
              isLiked: false,
              dislikes: item.dislikes + 1,
              likes: item.isLiked ? item.likes - 1 : item.likes
            };
          }
        }
        return item;
      })
    );
  };

  const renderDistrictItem = ({ item }: { item: District }) => (
    <TouchableOpacity
      style={styles.districtItem}
      onPress={() => handleDistrictSelect(item)}
    >
      <View>
        <Text style={styles.districtName}>{item.name}</Text>
        <Text style={styles.provinceName}>{item.province}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderNewsItem = (item: NewsItem) => (
    <TouchableOpacity key={item.id} style={styles.newsCard}>
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDescription}>{item.description}</Text>
        <View style={styles.newsFooter}>
          <Text style={styles.newsDate}>{new Date(item.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}</Text>
          <Text style={styles.categoryTag}>{item.category}</Text>
        </View>
        
        {/* Interaction Bar */}
        <View style={styles.interactionBar}>
          <TouchableOpacity 
            style={styles.interactionButton}
            onPress={() => handleLike(item.id)}
          >
            <Text style={[styles.interactionIcon, item.isLiked && styles.activeIcon]}>👍</Text>
            <Text style={[styles.interactionText, item.isLiked && styles.activeText]}>{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.interactionButton}
            onPress={() => handleDislike(item.id)}
          >
            <Text style={[styles.interactionIcon, item.isDisliked && styles.activeIcon]}>👎</Text>
            <Text style={[styles.interactionText, item.isDisliked && styles.activeText]}>{item.dislikes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.interactionButton}>
            <Text style={styles.interactionIcon}>💬</Text>
            <Text style={styles.interactionText}>{item.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.interactionButton}>
            <Text style={styles.interactionIcon}>📤</Text>
            <Text style={styles.interactionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredNews = newsItems.filter(item => {
    const activeCategories = filterCategories.filter(cat => cat.isActive);
    const isAllMinistries = activeCategories.some(cat => cat.name === 'All Ministries');
    
    if (isAllMinistries) return true;
    
    return activeCategories.some(cat => 
      item.category.toLowerCase().includes(cat.name.toLowerCase())
    );
  }).filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
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
              onPress={() => setShowDistrictDropdown(true)}
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
                placeholder="Search updates, policies, announcements..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* News Feed */}
          <View style={styles.newsContainer}>
            <Text style={styles.sectionTitle}>Latest Updates ({filteredNews.length})</Text>
            {filteredNews.map(renderNewsItem)}
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* District Dropdown Modal */}
        <Modal
          visible={showDistrictDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDistrictDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select District</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowDistrictDropdown(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={districts}
                renderItem={renderDistrictItem}
                keyExtractor={(item) => item.id}
                style={styles.districtList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>

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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activeFilterButton: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',

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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0D141C',
  },
  newsContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D141C',
    marginBottom: 16,
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    lineHeight: 24,
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
    marginBottom: 12,
  },
  newsDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  categoryTag: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  interactionIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  interactionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeIcon: {
    opacity: 1,
  },
  activeText: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF2',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D141C',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
  },
  districtList: {
    flex: 1,
  },
  districtItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  districtName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0D141C',
  },
  provinceName: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default FeedScreen;



