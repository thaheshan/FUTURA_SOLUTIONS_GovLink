import axios from 'axios';
import { Service, ServiceRequirement, ServiceFee, SearchFilters } from '../../Store/Slices/ServiceSlice';

const API_BASE_URL = 'https://api.gov-services.lk';

export const servicesApi = {
  getAllServices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services`);
      return {
        success: true,
        data: response.data,
        message: 'Services fetched successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch services',
        error: error.response?.data || error.message
      };
    }
  },

  getServiceById: async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Service details fetched'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Service not found',
        error: error.response?.data || error.message
      };
    }
  },

  getServicesByDistrict: async (districtId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services/district/${districtId}`);
      return {
        success: true,
        data: response.data,
        message: 'District services fetched'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch district services',
        error: error.response?.data || error.message
      };
    }
  },

  searchServices: async (query: string, filters: SearchFilters) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services/search`, {
        params: { query, ...filters }
      });
      return {
        success: true,
        data: response.data.results,
        total: response.data.total,
        message: 'Search completed'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Search failed',
        error: error.response?.data || error.message
      };
    }
  },

  getServiceRequirements: async (serviceId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services/${serviceId}/requirements`);
      return {
        success: true,
        data: response.data,
        message: 'Requirements fetched'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Requirements not found',
        error: error.response?.data || error.message
      };
    }
  },

  getServiceFees: async (serviceId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services/${serviceId}/fees`);
      return {
        success: true,
        data: response.data,
        message: 'Fees fetched'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Fees not found',
        error: error.response?.data || error.message
      };
    }
  }
};