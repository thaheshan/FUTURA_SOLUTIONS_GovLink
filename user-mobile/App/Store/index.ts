// src/store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import slices
import authSlice from './Slices/AuthSlice';
import userSlice from './Slices/UserSlice';
import servicesSlice from './Slices/ServiceSlice';
import trackingSlice from './Slices/TrackingSlice';
import notificationSlice from './Slices/NotificationSlics';
import appointmentSlice from './Slices/AppointmentSlice';

// Global persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user', 'notifications', 'appointments'],
  blacklist: ['services', 'tracking'],
};

// Auth-specific persist config
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['token', 'refreshToken', 'isAuthenticated', 'user'],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  user: userSlice,
  services: servicesSlice,
  tracking: trackingSlice,
  notifications: notificationSlice,
  appointments: appointmentSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: __DEV__,
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Clear persisted storage
export const clearPersistedData = (): Promise<void> => persistor.purge();

export default store;
