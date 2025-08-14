// src/store/slices/notificationsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationsApi } from '../../Services/API/NotificationAPI';

// Types
export interface Notification {
  id: string;
  type: 'system' | 'reminder' | 'update' | 'alert';
  title: string;
  titleTranslations?: {
    si?: string;
    ta?: string;
  };
  message: string;
  messageTranslations?: {
    si?: string;
    ta?: string;
  };
  read: boolean;
  readAt?: string;
  createdAt: string;
  metadata?: {
    serviceId?: string;
    applicationId?: string;
    appointmentId?: string;
    deepLink?: string;
  };
  priority?: 'high' | 'medium' | 'low';
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isMarkingAsRead: boolean;
  isDeleting: boolean;
  isClearing: boolean;
  error: string | null;
  lastFetchTime: string | null;
}

// Initial state
const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isMarkingAsRead: false,
  isDeleting: false,
  isClearing: false,
  error: null,
  lastFetchTime: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk<Notification[], void, { rejectValue: string }>(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.getNotifications();
      
      if (response.success) {
        await AsyncStorage.setItem('userNotifications', JSON.stringify(response.data));
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch notifications');
    } catch (error: any) {
      try {
        const cachedData = await AsyncStorage.getItem('userNotifications');
        if (cachedData) return JSON.parse(cachedData);
      } catch {}
      
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const markAsRead = createAsyncThunk<string, string, { rejectValue: string }>(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.markAsRead(notificationId);
      if (response.success) return notificationId;
      return rejectWithValue(response.message || 'Failed to mark as read');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Mark as read failed');
    }
  }
);

export const deleteNotification = createAsyncThunk<string, string, { rejectValue: string }>(
  'notifications/delete',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.deleteNotification(notificationId);
      if (response.success) return notificationId;
      return rejectWithValue(response.message || 'Failed to delete notification');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Deletion failed');
    }
  }
);

export const clearAllNotifications = createAsyncThunk<boolean, void, { rejectValue: string }>(
  'notifications/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.clearAll();
      if (response.success) return true;
      return rejectWithValue(response.message || 'Failed to clear notifications');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Clear all failed');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },
    
    markAsReadLocally: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
        state.unreadCount -= 1;
      }
    },
    
    deleteNotificationLocally: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) state.unreadCount -= 1;
        state.notifications.splice(index, 1);
      }
    },
    
    clearAllNotificationsLocally: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    
    clearNotificationErrors: (state) => {
      state.error = null;
    },
    
    resetNotificationsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read).length;
        state.lastFetchTime = new Date().toISOString();
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch notifications';
      })
      
      .addCase(markAsRead.pending, (state) => {
        state.isMarkingAsRead = true;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.isMarkingAsRead = false;
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          notification.readAt = new Date().toISOString();
          state.unreadCount -= 1;
        }
      })
      .addCase(markAsRead.rejected, (state) => {
        state.isMarkingAsRead = false;
      })
      
      .addCase(deleteNotification.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isDeleting = false;
        const index = state.notifications.findIndex(n => n.id === action.payload);
        if (index !== -1) {
          const notification = state.notifications[index];
          if (!notification.read) state.unreadCount -= 1;
          state.notifications.splice(index, 1);
        }
      })
      .addCase(deleteNotification.rejected, (state) => {
        state.isDeleting = false;
      })
      
      .addCase(clearAllNotifications.pending, (state) => {
        state.isClearing = true;
      })
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.isClearing = false;
        state.notifications = [];
        state.unreadCount = 0;
      })
      .addCase(clearAllNotifications.rejected, (state) => {
        state.isClearing = false;
      });
  },
});

export const {
  addNotification,
  markAsReadLocally,
  deleteNotificationLocally,
  clearAllNotificationsLocally,
  clearNotificationErrors,
  resetNotificationsState,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;