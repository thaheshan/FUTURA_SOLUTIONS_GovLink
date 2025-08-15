"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_PRIORITIES = exports.NOTIFICATION_TYPES = exports.APPOINTMENT_STATUS = exports.APPLICATION_STATUS = exports.APPLICATION_TYPES = exports.USER_ROLES = void 0;
exports.USER_ROLES = {
    CITIZEN: 'citizen',
    OFFICER: 'officer',
    ADMIN: 'admin'
};
exports.APPLICATION_TYPES = {
    NEW: 'new',
    RENEWAL: 'renewal',
    REPLACEMENT: 'replacement',
    CORRECTION: 'correction'
};
exports.APPLICATION_STATUS = {
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    DOCUMENT_VERIFICATION: 'document_verification',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    READY_FOR_COLLECTION: 'ready_for_collection'
};
exports.APPOINTMENT_STATUS = {
    SCHEDULED: 'scheduled',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    RESCHEDULED: 'rescheduled',
    NO_SHOW: 'no_show'
};
exports.NOTIFICATION_TYPES = {
    EMAIL: 'email',
    SMS: 'sms',
    PUSH: 'push',
    SYSTEM: 'system'
};
exports.NOTIFICATION_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};
