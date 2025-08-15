export const USER_ROLES = {
  CITIZEN: 'citizen',
  OFFICER: 'officer',
  ADMIN: 'admin'
} as const;

export const APPLICATION_TYPES = {
  NEW: 'new',
  RENEWAL: 'renewal',
  REPLACEMENT: 'replacement',
  CORRECTION: 'correction'
} as const;

export const APPLICATION_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  DOCUMENT_VERIFICATION: 'document_verification',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  READY_FOR_COLLECTION: 'ready_for_collection'
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
  NO_SHOW: 'no_show'
} as const;

export const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  SYSTEM: 'system'
} as const;

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
}