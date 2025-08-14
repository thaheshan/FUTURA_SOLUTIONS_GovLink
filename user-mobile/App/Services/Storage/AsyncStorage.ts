import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../../Store/Slices/UserSlice';
import { SearchFilters, TrackingFilters } from '../../Store/Slices/ServiceSlice';

// Define all possible storage keys
export type StorageKey = 
  | 'userPreferences'
  | 'rememberedEmail'
  | 'recentSearches'
  | 'selectedDistrict'
  | 'searchFilters'
  | 'trackingFilters'
  | 'appTheme'
  | 'lastSyncTime'
  | 'notificationsEnabled'
  | string; // Allow custom keys

/**
 * Stores data in AsyncStorage
 * @param key Storage key
 * @param value Data to store (objects will be stringified)
 */
export const storeData = async (key: StorageKey, value: any): Promise<void> => {
  try {
    const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, valueToStore);
  } catch (error) {
    console.error(`AsyncStorage store error for key ${key}:`, error);
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error);
    throw new Error(`Failed to store data: ${errorMessage}`);
  }
};

/**
 * Retrieves data from AsyncStorage
 * @param key Storage key
 * @returns Parsed data or null if not found
 */
export const getData = async <T>(key: StorageKey): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  } catch (error) {
    console.error(`AsyncStorage get error for key ${key}:`, error);
    return null;
  }
};

/**
 * Removes data from AsyncStorage
 * @param key Storage key to remove
 */
export const removeData = async (key: StorageKey): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`AsyncStorage remove error for key ${key}:`, error);
  }
};

/**
 * Clears all app-specific data from AsyncStorage
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('AsyncStorage clear error:', error);
  }
};

// Specific helper functions for common use cases

export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  return getData<UserPreferences>('userPreferences');
};

export const setUserPreferences = async (preferences: UserPreferences): Promise<void> => {
  await storeData('userPreferences', preferences);
};

export const getSearchFilters = async (): Promise<SearchFilters | null> => {
  return getData<SearchFilters>('searchFilters');
};

export const setSearchFilters = async (filters: SearchFilters): Promise<void> => {
  await storeData('searchFilters', filters);
};

export const getTrackingFilters = async (): Promise<TrackingFilters | null> => {
  return getData<TrackingFilters>('trackingFilters');
};

export const setTrackingFilters = async (filters: TrackingFilters): Promise<void> => {
  await storeData('trackingFilters', filters);
};

export const getRememberedEmail = async (): Promise<string | null> => {
  return getData<string>('rememberedEmail');
};

export const setRememberedEmail = async (email: string): Promise<void> => {
  await storeData('rememberedEmail', email);
};

export const clearRememberedEmail = async (): Promise<void> => {
  await removeData('rememberedEmail');
};