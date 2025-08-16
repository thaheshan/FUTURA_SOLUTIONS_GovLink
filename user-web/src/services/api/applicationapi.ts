import apiClient from "./apiClient";
// Import or define ApplicationFilters type
// Define ApplicationFilters type here if not available in ../types/application
export type ApplicationFilters = {
  status?: string;
  officerId?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: string | undefined;
};

export const applicationsAPI = {
  getAllApplications: async (filters?: ApplicationFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    const response = await apiClient.get(`/government/applications?${params}`);
    return response.data;
  },
  
  getApplicationById: async (id: string) => {
    const response = await apiClient.get(`/government/applications/${id}`);
    return response.data;
  },
  
  updateApplicationStatus: async (id: string, status: string, notes?: string) => {
    const response = await apiClient.put(`/government/applications/${id}/status`, {
      status,
      notes
    });
    return response.data;
  },
  
  assignOfficer: async (applicationId: string, officerId: string) => {
    const response = await apiClient.put(`/government/applications/${applicationId}/assign`, {
      officerId
    });
    return response.data;
  }
};
