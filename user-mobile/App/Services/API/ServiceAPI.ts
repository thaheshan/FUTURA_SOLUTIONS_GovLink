// src/Api/servicesApi.ts
import apiClient from './APIClient'; // your centralized axios client
import { Service, ServiceRequirement, ServiceFee, SearchFilters } from '../../Store/Slices/ServiceSlice';
import type { NICApplicationData } from '../../Store/Slices/ServiceSlice';

// Enhanced Types and Interfaces
export interface ApiResponse<T = any> {
  referenceNumber?: string | null;
  success: boolean;
  data?: T;
  message: string;
  error?: any;
  total?: number;
  timestamp?: string;
}

export interface NICApplicationResponse {
  referenceNumber: string;
  applicationId: string;
  status: string;
  submittedAt: string;
  estimatedCompletionDate: string;
  trackingUrl?: string;
  paymentRequired?: boolean;
  paymentAmount?: number;
}

export interface ApplicationStatus {
  referenceNumber: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed' | 'cancelled' | 'in_review' | 'under_review';
  submittedAt: string;
  lastUpdated: string;
  estimatedCompletionDate?: string;
  currentStage: string;
  stages: ApplicationStage[];
  remarks?: string;
  documentsRequired?: string[];
  documentsSubmitted?: string[];
  applicationType?: string;
  applicationSubtype?: string;
  priorityLevel?: 'normal' | 'urgent' | 'express';
  serviceCenterLocation?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  paymentInfo?: {
    totalAmount: number;
    paidAmount: number;
    currency: string;
    paymentStatus: 'pending' | 'partial' | 'completed' | 'failed';
    paymentMethod?: string;
    transactionId?: string;
  };
}

export interface ApplicationStage {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  completedAt?: string;
  startedAt?: string;
  description: string;
  order: number;
  estimatedDuration?: string;
  actualDuration?: string;
  assignedTo?: string;
  notes?: string;
  documents?: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
    verified: boolean;
  }[];
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentDate?: string;
  description?: string;
  fees?: {
    serviceFee: number;
    processingFee: number;
    urgentFee?: number;
    total: number;
  };
}

export interface ApplicationFilters {
  status?: string | string[];
  dateFrom?: string;
  dateTo?: string;
  serviceType?: string;
  priority?: string;
  sortBy?: 'submittedAt' | 'lastUpdated' | 'estimatedCompletion';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  includeDocuments?: boolean;
}

export interface ServiceStats {
  totalApplications: number;
  pendingApplications: number;
  completedApplications: number;
  averageProcessingTime: number;
  todaySubmissions: number;
  weeklyTrend: number[];
  statusBreakdown: {
    [key: string]: number;
  };
  popularServices: {
    serviceId: string;
    serviceName: string;
    applicationCount: number;
  }[];
}

export interface DocumentUpload {
  uri: string;
  type: string;
  name: string;
  size?: number;
  required?: boolean;
  category?: string;
  description?: string;
  base64?: string; // For some upload scenarios
}

export interface NotificationPreferences {
  smsNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  statusUpdates: boolean;
  reminderAlerts: boolean;
  paymentNotifications: boolean;
  documentRequests: boolean;
}

export interface TrackingFilters {
  referenceNumbers?: string[];
  statuses?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  serviceTypes?: string[];
  includeHistory?: boolean;
}

// Enhanced Services API
export const servicesApi = {
  // SERVICES MANAGEMENT
  
  // Fetch all services with pagination and filters
  getAllServices: async (page = 1, limit = 20, filters?: Partial<SearchFilters>): Promise<ApiResponse<Service[]>> => {
    try {
      const params = { 
        page, 
        limit, 
        ...filters,
        timestamp: Date.now()
      };
      const response = await apiClient.get('/services', { params });
      return { 
        referenceNumber: response.data.referenceNumber ?? null,
        success: true, 
        data: response.data.services, 
        total: response.data.total,
        message: 'Services fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        referenceNumber: error.response?.data?.referenceNumber ?? null,
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch services', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Fetch service by ID with detailed information
  getServiceById: async (id: string): Promise<ApiResponse<Service>> => {
    try {
      const response = await apiClient.get(`/services/${id}`);
      return { 
        referenceNumber: response.data.referenceNumber ?? null,
        success: true, 
        data: response.data, 
        message: 'Service details fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        referenceNumber: error.response?.data?.referenceNumber ?? null,
        success: false, 
        message: error.response?.data?.message || 'Service not found', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Fetch services by district with caching
  getServicesByDistrict: async (districtId: string, useCache = true): Promise<ApiResponse<Service[]>> => {
    try {
      const params = useCache ? { cache: 'true' } : {};
      const response = await apiClient.get(`/services/district/${districtId}`, { params });
      return { 
        referenceNumber: response.data.referenceNumber ?? null,
        success: true, 
        data: response.data.services, 
        total: response.data.total,
        message: 'District services fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        referenceNumber: error.response?.data?.referenceNumber ?? null,
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch district services', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Enhanced search with advanced filters
  searchServices: async (query: string, filters: SearchFilters): Promise<ApiResponse<Service[]>> => {
    try {
      const response = await apiClient.get('/services/search', { 
        params: { 
          q: query, 
          ...filters,
          timestamp: Date.now() // Prevent caching for search
        } 
      });
      return { 
        referenceNumber: response.data.referenceNumber ?? null,
        success: true, 
        data: response.data.results, 
        total: response.data.total, 
        message: 'Search completed successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        referenceNumber: error.response?.data?.referenceNumber ?? null,
        success: false, 
        message: error.response?.data?.message || 'Search failed', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // APPLICATION TRACKING SPECIFIC METHODS

  // Get application status - Main tracking method
  getApplicationStatus: async (referenceNumber: string): Promise<ApiResponse<ApplicationStatus>> => {
    try {
      if (!referenceNumber || referenceNumber.trim().length === 0) {
        return {
          success: false,
          message: 'Reference number is required',
          timestamp: new Date().toISOString()
        };
      }

      const response = await apiClient.get(`/applications/${referenceNumber}/status`, {
        timeout: 15000, // 15 seconds timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      return { 
        referenceNumber: response.data.referenceNumber ?? referenceNumber,
        success: true, 
        data: response.data, 
        message: 'Application status fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('getApplicationStatus error:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        return {
          referenceNumber: referenceNumber,
          success: false,
          message: 'Network connection error. Please check your internet connection and try again.',
          error: 'NETWORK_ERROR',
          timestamp: new Date().toISOString()
        };
      }

      if (error.response?.status === 404) {
        return {
          referenceNumber: referenceNumber,
          success: false,
          message: 'Application not found. Please verify your reference number.',
          error: 'APPLICATION_NOT_FOUND',
          timestamp: new Date().toISOString()
        };
      }

      if (error.response?.status === 429) {
        return {
          referenceNumber: referenceNumber,
          success: false,
          message: 'Too many requests. Please wait a moment and try again.',
          error: 'RATE_LIMITED',
          timestamp: new Date().toISOString()
        };
      }

      return { 
        referenceNumber: referenceNumber,
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch application status', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Bulk tracking for multiple applications
  getMultipleApplicationStatus: async (referenceNumbers: string[]): Promise<ApiResponse<ApplicationStatus[]>> => {
    try {
      if (!referenceNumbers || referenceNumbers.length === 0) {
        return {
          success: false,
          message: 'At least one reference number is required',
          timestamp: new Date().toISOString()
        };
      }

      const response = await apiClient.post('/applications/bulk-status', {
        referenceNumbers: referenceNumbers
      });

      return {
        success: true,
        data: response.data.applications,
        total: response.data.total,
        message: 'Multiple applications status fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch multiple applications status',
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Get user's applications with enhanced filters
  getUserApplications: async (filters?: ApplicationFilters): Promise<ApiResponse<ApplicationStatus[]>> => {
    try {
      const response = await apiClient.get('/applications/my-applications', { 
        params: {
          ...filters,
          includeStages: true,
          includeDocuments: filters?.includeDocuments ?? false
        }
      });
      
      return { 
        referenceNumber: response.data.referenceNumber ?? null,
        success: true, 
        data: response.data.applications, 
        total: response.data.total,
        message: 'Applications fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch applications', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Get application history/timeline with detailed tracking
  getApplicationHistory: async (referenceNumber: string): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.get(`/applications/${referenceNumber}/history`, {
        params: {
          includeSystemEvents: true,
          includeUserActions: true
        }
      });
      
      return { 
        referenceNumber: response.data.referenceNumber ?? referenceNumber,
        success: true, 
        data: response.data.history, 
        message: 'Application history fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        referenceNumber: referenceNumber,
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch application history', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Submit NIC application with enhanced validation
  submitNICApplication: async (applicationData: NICApplicationData): Promise<ApiResponse<NICApplicationResponse>> => {
    try {
      const formData = new FormData();

      // Append basic form fields
      Object.keys(applicationData).forEach((key) => {
        if (key !== 'documents' && applicationData[key as keyof NICApplicationData] !== undefined) {
          formData.append(key, String(applicationData[key as keyof NICApplicationData]));
        }
      });

      // Append documents with validation
      if (applicationData.documents && applicationData.documents.length > 0) {
        applicationData.documents.forEach((doc: DocumentUpload, index: number) => {
          formData.append(`document_${index}`, {
            uri: doc.uri,
            type: doc.type,
            name: doc.name,
            size: doc.size,
          } as any);
          
          // Add document metadata
          if (doc.category) formData.append(`document_${index}_category`, doc.category);
          if (doc.required !== undefined) formData.append(`document_${index}_required`, String(doc.required));
          if (doc.description) formData.append(`document_${index}_description`, doc.description);
        });
      }

      // Add submission metadata
      formData.append('submittedAt', new Date().toISOString());
      formData.append('clientVersion', '1.0.0'); // App version for tracking
      formData.append('platform', 'mobile');
      
      const response = await apiClient.post('/applications/nic', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for file uploads
        onUploadProgress: (progressEvent) => {
          // You can add upload progress tracking here
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log('Upload progress:', percentCompleted + '%');
        }
      });

      return { 
        referenceNumber: response.data.referenceNumber,
        success: true, 
        data: response.data, 
        message: 'NIC application submitted successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        success: false, 
        message: error.response?.data?.message || 'NIC application submission failed', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Track application by different identifiers
  trackApplication: async (identifier: string, type: 'reference' | 'phone' | 'nic' = 'reference'): Promise<ApiResponse<ApplicationStatus>> => {
    try {
      const response = await apiClient.get('/applications/track', {
        params: {
          identifier,
          type
        }
      });
      
      return {
        referenceNumber: response.data.referenceNumber,
        success: true,
        data: response.data,
        message: 'Application tracked successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to track application',
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Quick status check (minimal data)
  getQuickStatus: async (referenceNumber: string): Promise<ApiResponse<{ status: string; stage: string; lastUpdated: string }>> => {
    try {
      const response = await apiClient.get(`/applications/${referenceNumber}/quick-status`);
      
      return {
        referenceNumber: referenceNumber,
        success: true,
        data: response.data,
        message: 'Quick status fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        referenceNumber: referenceNumber,
        success: false,
        message: error.response?.data?.message || 'Failed to fetch quick status',
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Cancel application with reason
  cancelApplication: async (referenceNumber: string, reason: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post(`/applications/${referenceNumber}/cancel`, { 
        reason,
        cancelledAt: new Date().toISOString(),
        cancelledBy: 'user'
      });
      
      return { 
        referenceNumber: response.data.referenceNumber ?? referenceNumber,
        success: true, 
        data: response.data, 
        message: 'Application cancelled successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        referenceNumber: referenceNumber,
        success: false, 
        message: error.response?.data?.message || 'Failed to cancel application', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Update application details
  updateApplication: async (referenceNumber: string, updateData: Partial<NICApplicationData>): Promise<ApiResponse> => {
    try {
      const response = await apiClient.put(`/applications/${referenceNumber}`, {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      
      return { 
        referenceNumber: response.data.referenceNumber ?? referenceNumber,
        success: true, 
        data: response.data, 
        message: 'Application updated successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        referenceNumber: referenceNumber,
        success: false, 
        message: error.response?.data?.message || 'Failed to update application', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // DOCUMENT MANAGEMENT

  // Upload additional documents
  uploadDocuments: async (referenceNumber: string, documents: DocumentUpload[]): Promise<ApiResponse> => {
    try {
      const formData = new FormData();
      
      documents.forEach((doc, index) => {
        formData.append(`document_${index}`, {
          uri: doc.uri,
          type: doc.type,
          name: doc.name,
          size: doc.size,
        } as any);
        
        if (doc.category) formData.append(`document_${index}_category`, doc.category);
        if (doc.description) formData.append(`document_${index}_description`, doc.description);
      });

      const response = await apiClient.post(`/applications/${referenceNumber}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      return { 
        referenceNumber: response.data.referenceNumber ?? referenceNumber,
        success: true, 
        data: response.data, 
        message: 'Documents uploaded successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        referenceNumber: referenceNumber,
        success: false, 
        message: error.response?.data?.message || 'Document upload failed', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Get application documents
  getApplicationDocuments: async (referenceNumber: string): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.get(`/applications/${referenceNumber}/documents`);
      return { 
        referenceNumber: response.data.referenceNumber ?? referenceNumber,
        success: true, 
        data: response.data.documents, 
        message: 'Documents fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        referenceNumber: referenceNumber,
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch documents', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Download document
  downloadDocument: async (referenceNumber: string, documentId: string): Promise<ApiResponse<Blob>> => {
    try {
      const response = await apiClient.get(`/applications/${referenceNumber}/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      return { 
        referenceNumber: referenceNumber,
        success: true, 
        data: response.data, 
        message: 'Document downloaded successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        referenceNumber: referenceNumber,
        success: false, 
        message: error.response?.data?.message || 'Document download failed', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // PAYMENT SERVICES

  // Process payment
  processPayment: async (referenceNumber: string, paymentDetails: PaymentDetails): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post(`/applications/${referenceNumber}/payment`, {
        ...paymentDetails,
        processedAt: new Date().toISOString()
      });
      return { 
        referenceNumber: response.data.referenceNumber ?? referenceNumber,
        success: true, 
        data: response.data, 
        message: 'Payment processed successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        referenceNumber: referenceNumber,
        success: false, 
        message: error.response?.data?.message || 'Payment processing failed', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Get payment status
  getPaymentStatus: async (referenceNumber: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(`/applications/${referenceNumber}/payment/status`);
      return { 
        referenceNumber: response.data.referenceNumber ?? referenceNumber,
        success: true, 
        data: response.data, 
        message: 'Payment status fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        referenceNumber: referenceNumber,
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch payment status', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // NOTIFICATIONS AND PREFERENCES

  // Update notification preferences
  updateNotificationPreferences: async (preferences: NotificationPreferences): Promise<ApiResponse> => {
    try {
      const response = await apiClient.put('/user/notification-preferences', preferences);
      return { 
        success: true, 
        data: response.data, 
        message: 'Notification preferences updated successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update preferences', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Get user notifications
  getUserNotifications: async (limit = 20, offset = 0): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.get('/user/notifications', { 
        params: { limit, offset } 
      });
      return { 
        success: true, 
        data: response.data.notifications, 
        total: response.data.total,
        message: 'Notifications fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch notifications', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // UTILITY FUNCTIONS FOR TRACKING

  // Validate reference number format
  validateReferenceNumber: (referenceNumber: string): { isValid: boolean; message?: string } => {
    if (!referenceNumber || referenceNumber.trim().length === 0) {
      return { isValid: false, message: 'Reference number is required' };
    }

    // Basic format validation (adjust pattern as needed)
    const pattern = /^[A-Z0-9]{2,4}-?\d{8,12}-?\d{2,6}$/i;
    if (!pattern.test(referenceNumber.replace(/\s/g, ''))) {
      return { isValid: false, message: 'Invalid reference number format' };
    }

    return { isValid: true };
  },

  // Health check
  healthCheck: async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get('/health');
      return { 
        success: true, 
        data: response.data, 
        message: 'Service is healthy',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Service health check failed', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Get service statistics
  getServiceStats: async (): Promise<ApiResponse<ServiceStats>> => {
    try {
      const response = await apiClient.get('/services/stats');
      return { 
        success: true, 
        data: response.data, 
        message: 'Service statistics fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch service statistics', 
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },
};

// Enhanced Utility Functions
export const formatReferenceNumber = (refNumber: string): string => {
  if (!refNumber) return '';
  // Remove existing separators and format consistently
  const cleaned = refNumber.replace(/[-\s]/g, '');
  return cleaned.replace(/(.{4})/g, '$1-').slice(0, -1);
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return '#F59E0B';
    case 'processing':
    case 'in_progress':
    case 'under_review':
    case 'in_review':
      return '#3B82F6';
    case 'approved':
    case 'completed':
      return '#10B981';
    case 'rejected':
    case 'failed':
      return '#EF4444';
    case 'cancelled':
      return '#6B7280';
    default:
      return '#9CA3AF';
  }
};

export const getStatusText = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Pending Review';
    case 'processing':
      return 'Under Processing';
    case 'in_progress':
      return 'In Progress';
    case 'under_review':
    case 'in_review':
      return 'Under Review';
    case 'approved':
      return 'Approved';
    case 'completed':
      return 'Completed';
    case 'rejected':
      return 'Rejected';
    case 'failed':
      return 'Failed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown Status';
  }
};

export const getStatusBadgeStyle = (status: string) => {
  const color = getStatusColor(status);
  return {
    backgroundColor: `${color}20`,
    borderColor: color,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  };
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

export const getTimeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  } catch {
    return dateString;
  }
};

export const isReferenceNumberValid = (referenceNumber: string): boolean => {
  return servicesApi.validateReferenceNumber(referenceNumber).isValid;
};

export default servicesApi;

