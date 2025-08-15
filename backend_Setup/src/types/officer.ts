export interface IOfficer {
  _id?: string;
  userId: string;
  employeeId: string;
  department: string;
  position: string;
  specializations: string[];
  status: 'active' | 'inactive' | 'on_leave';
  workload: {
    current: number;
    maximum: number;
  };
  performance: {
    rating: number;
    applicationsProcessed: number;
    averageProcessingTime: number;
    completionRate: number;
  };
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOfficerMethods {
  // Add any instance methods here if needed
}

export type OfficerDocument = IOfficer & IOfficerMethods;
