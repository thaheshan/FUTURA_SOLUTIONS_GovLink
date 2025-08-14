import axios from 'axios';

const API_BASE_URL = 'https://api.gov-services.lk';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const trackingApi = {
  submitApplication: async (data: {
    serviceId: string;
    applicationData: Record<string, any>;
    documents: any[];
  }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/applications`, data, {
        headers: getAuthHeader()
      });
      return {
        success: true,
        data: response.data,
        message: 'Application submitted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Submission failed',
        error: error.response?.data || error.message
      };
    }
  },

  getUserApplications: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/applications`, {
        headers: getAuthHeader()
      });
      return {
        success: true,
        data: response.data,
        message: 'Applications fetched'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch applications',
        error: error.response?.data || error.message
      };
    }
  },

  trackByReference: async (referenceNumber: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/applications/track/${referenceNumber}`);
      return {
        success: true,
        data: response.data,
        message: 'Application found'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Application not found',
        error: error.response?.data || error.message
      };
    }
  },

  getApplicationDetails: async (applicationId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/applications/${applicationId}`, {
        headers: getAuthHeader()
      });
      return {
        success: true,
        data: response.data,
        message: 'Application details fetched'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Details not found',
        error: error.response?.data || error.message
      };
    }
  },

  cancelApplication: async (applicationId: string, reason: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/applications/${applicationId}/cancel`,
        { reason },
        { headers: getAuthHeader() }
      );
      return {
        success: true,
        data: response.data,
        message: 'Application cancelled'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Cancellation failed',
        error: error.response?.data || error.message
      };
    }
  },

  uploadDocuments: async (applicationId: string, documents: any[]) => {
    try {
      const formData = new FormData();
      documents.forEach((doc) => {
        formData.append('documents', doc);
      });

      const response = await axios.post(
        `${API_BASE_URL}/applications/${applicationId}/documents`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return {
        success: true,
        data: response.data,
        message: 'Documents uploaded'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Upload failed',
        error: error.response?.data || error.message
      };
    }
  },

  getApplicationHistory: async (applicationId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/applications/${applicationId}/history`, {
        headers: getAuthHeader()
      });
      return {
        success: true,
        data: response.data,
        message: 'History fetched'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'History not found',
        error: error.response?.data || error.message
      };
    }
  }
};