// Sri Lankan districts
export const SRI_LANKAN_DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya'
];

// Government service categories
export const SERVICE_CATEGORIES = [
  { id: 'registry', name: 'Registry Services', icon: 'id-card' },
  { id: 'land', name: 'Land Registration', icon: 'landmark' },
  { id: 'revenue', name: 'Revenue Services', icon: 'file-invoice-dollar' },
  { id: 'legal', name: 'Legal Services', icon: 'balance-scale' },
  { id: 'health', name: 'Health Services', icon: 'heartbeat' },
  { id: 'education', name: 'Education Services', icon: 'graduation-cap' },
  { id: 'agriculture', name: 'Agriculture Services', icon: 'tractor' },
  { id: 'welfare', name: 'Social Welfare', icon: 'hands-helping' },
  { id: 'business', name: 'Business Registration', icon: 'business-time' },
  { id: 'environment', name: 'Environment Services', icon: 'leaf' },
  { id: 'transport', name: 'Transport Services', icon: 'bus' },
];

// Specific services within categories
export const REGISTRY_SERVICES = [
  { id: 'nic-reissue', name: 'NIC Reissue', description: 'Apply for a new National Identity Card' },
  { id: 'birth-certificate', name: 'Birth Certificate', description: 'Apply for a birth certificate' },
  { id: 'death-certificate', name: 'Death Certificate', description: 'Apply for a death certificate' },
  { id: 'marriage-certificate', name: 'Marriage Certificate', description: 'Apply for a marriage certificate' },
  { id: 'name-change', name: 'Name Change', description: 'Apply for legal name change' },
];

// Appointment statuses
export const APPOINTMENT_STATUS = {
  PENDING: { text: 'Pending', color: '#FFA500' },
  CONFIRMED: { text: 'Confirmed', color: '#4CAF50' },
  CANCELLED: { text: 'Cancelled', color: '#F44336' },
  COMPLETED: { text: 'Completed', color: '#2196F3' },
};

// Tracking request statuses
export const TRACKING_STATUS = {
  SUBMITTED: { text: 'Submitted', color: '#9C27B0' },
  PROCESSING: { text: 'Processing', color: '#FF9800' },
  REVIEW: { text: 'Under Review', color: '#2196F3' },
  READY: { text: 'Ready for Pickup', color: '#4CAF50' },
  REJECTED: { text: 'Rejected', color: '#F44336' },
  COMPLETED: { text: 'Completed', color: '#607D8B' },
};

// Office hours
export const OFFICE_HOURS = {
  WEEKDAYS: '8:30 AM - 4:00 PM',
  SATURDAY: '8:30 AM - 12:30 PM',
  SUNDAY: 'Closed',
  PUBLIC_HOLIDAYS: 'Closed',
};

// Government offices types
export const GOVERNMENT_OFFICES = [
  'Divisional Secretariat',
  'District Secretariat',
  'Gramasewa Office',
  'Post Office',
  'Other Government Office'
];

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  SERVICES: '/services',
  APPOINTMENTS: '/appointments',
  TRACKING: '/tracking',
  PROFILE: '/users/me',
  DISTRICTS: '/districts',
  OFFICES: '/offices',
  NIC_REISSUE: '/services/nic-reissue',
};

// Form validation constants
export const VALIDATION = {
  MOBILE_REGEX: /^(?:0|94|\+94)?(?:(7\d{8})|(71\d{7})|(72\d{7})|(74\d{7})|(75\d{7})|(76\d{7})|(77\d{7})|(78\d{7})|(70\d{7}))$/,
  NIC_REGEX: /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/,
  PASSWORD_MIN_LENGTH: 8,
};

// Notification constants
export const NOTIFICATION_TYPES = {
  APPOINTMENT: 'appointment',
  STATUS_UPDATE: 'status-update',
  DOCUMENT_REQUEST: 'document-request',
  REMINDER: 'reminder',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection',
  SERVER_ERROR: 'Server error. Please try again later',
  INVALID_CREDENTIALS: 'Invalid mobile number or password',
  SESSION_EXPIRED: 'Your session has expired. Please log in again',
  FORM_VALIDATION: 'Please fill all required fields correctly',
};

// UI constants
export const UI_CONSTANTS = {
  MAX_APPOINTMENTS_HOME: 3,
  MAX_TRACKING_REQUESTS_HOME: 3,
  QR_CODE_SIZE: 200,
  MAP_ZOOM_LEVEL: 12,
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  SELECTED_DISTRICT: 'selectedDistrict',
  LANGUAGE: 'language',
};

// Supported languages
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'si', name: 'සිංහල' },
  { code: 'ta', name: 'தமிழ்' },
];

// Days of week for appointment booking
export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

// Time slots for appointments
export const TIME_SLOTS = [
  '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM',
  '2:30 PM', '3:00 PM', '3:30 PM'
];

// NIC reissue reasons
export const NIC_REISSUE_REASONS = [
  'Lost',
  'Damaged',
  'Change of Information',
  'First Time Issue',
  'Other'
];

// Document types for upload
export const DOCUMENT_TYPES = [
  'Photograph',
  'Birth Certificate',
  'Gramasewa Certificate',
  'Affidavit',
  'Previous NIC',
  'Other'
];

// Maximum file size for uploads (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Supported file types
export const SUPPORTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf'
];

// Service processing times (in days)
export const SERVICE_PROCESSING_TIMES = {
  'nic-reissue': { min: 7, max: 14 },
  'birth-certificate': { min: 3, max: 7 },
  'death-certificate': { min: 3, max: 7 },
  'marriage-certificate': { min: 5, max: 10 },
  'name-change': { min: 14, max: 30 },
};

// Fees for services (in LKR)
export const SERVICE_FEES = {
  'nic-reissue': 1000,
  'birth-certificate': 500,
  'death-certificate': 500,
  'marriage-certificate': 1000,
  'name-change': 2000,
};

// AI Assistant quick help options
export const QUICK_HELP_OPTIONS = [
  'How to apply for NIC?',
  'What documents do I need?',
  'How to book appointment?',
  'How to track my application?',
  'Office locations and hours',
];

// Government contact information
export const CONTACT_INFO = {
  HOTLINE: '1919',
  EMAIL: 'info@gov.lk',
  WEBSITE: 'www.gov.lk',
};

// Social media links
export const SOCIAL_MEDIA = {
  FACEBOOK: 'https://facebook.com/srilankagov',
  TWITTER: 'https://twitter.com/srilankagov',
  YOUTUBE: 'https://youtube.com/srilankagov',
};

export default {
  SRI_LANKAN_DISTRICTS,
  SERVICE_CATEGORIES,
  REGISTRY_SERVICES,
  APPOINTMENT_STATUS,
  TRACKING_STATUS,
  OFFICE_HOURS,
  GOVERNMENT_OFFICES,
  API_ENDPOINTS,
  VALIDATION,
  NOTIFICATION_TYPES,
  ERROR_MESSAGES,
  UI_CONSTANTS,
  STORAGE_KEYS,
  LANGUAGES,
  DAYS_OF_WEEK,
  TIME_SLOTS,
  NIC_REISSUE_REASONS,
  DOCUMENT_TYPES,
  MAX_FILE_SIZE,
  SUPPORTED_FILE_TYPES,
  SERVICE_PROCESSING_TIMES,
  SERVICE_FEES,
  QUICK_HELP_OPTIONS,
  CONTACT_INFO,
  SOCIAL_MEDIA,
};