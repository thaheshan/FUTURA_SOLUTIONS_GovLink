// Define types matching the slice
export type Service = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  isActive: boolean;
};

export type Appointment = {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  office: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  referenceNumber: string;
};

export type TrackingRequest = {
  id: string;
  serviceId: string;
  serviceName: string;
  submittedDate: string;
  status: 'Submitted' | 'Processing' | 'Ready' | 'Rejected' | 'Completed';
  assignedOffice?: string;
  assignedOfficer?: string;
  estimatedCompletion?: string;
  referenceNumber: string;
};

// Mock data for demonstration
const MOCK_SERVICES: Service[] = [
  {
    id: 'registry',
    name: 'Registry Services',
    description: 'National Identity Card, Birth/Death Certificates',
    category: 'Personal Documents',
    icon: 'id-card',
    isActive: true,
  },
  {
    id: 'land',
    name: 'Land Registration',
    description: 'Land transfers, deeds registration',
    category: 'Property',
    icon: 'landmark',
    isActive: false,
  },
  // Add other services...
];

// API functions
export const fetchServicesApi = async (): Promise<{ data: Service[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: MOCK_SERVICES });
    }, 500);
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const submitNICReissueApi = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: any
): Promise<{
  data: {
    success: boolean;
    trackingRequest: TrackingRequest;
  };
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          trackingRequest: {
            id: `TRK-${Date.now()}`,
            serviceId: 'registry',
            serviceName: 'NIC Reissue',
            submittedDate: new Date().toISOString(),
            status: 'Submitted',
            assignedOffice: 'Colombo DS Office',
            referenceNumber: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          },
        },
      });
    }, 1000);
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchAppointmentsApi = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string
): Promise<{ data: Appointment[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            id: 'APT-001',
            serviceId: 'registry',
            serviceName: 'NIC Reissue',
            date: '2023-08-15',
            time: '10:30 AM',
            office: 'Colombo DS Office',
            status: 'Confirmed',
            referenceNumber: 'REF-123456',
          },
        ],
      });
    }, 500);
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchTrackingRequestsApi = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string
): Promise<{ data: TrackingRequest[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            id: 'TRK-001',
            serviceId: 'registry',
            serviceName: 'NIC Reissue',
            submittedDate: '2023-08-10',
            status: 'Processing',
            assignedOffice: 'Colombo DS Office',
            estimatedCompletion: '2023-08-20',
            referenceNumber: 'REF-123456',
          },
        ],
      });
    }, 500);
  });
};
