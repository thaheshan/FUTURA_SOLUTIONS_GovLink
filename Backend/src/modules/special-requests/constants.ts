// Request Statuses
export const SPECIAL_REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  COMPLETED: 'completed',
  REFUND_REQUESTED: 'refund-requested',
  REFUNDED: 'refunded'
};

// Payment Statuses
export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Refund Statuses
export const REFUND_STATUS = {
  NOT_REQUESTED: 'not-requested',
  REQUESTED: 'requested',
  APPROVED: 'approved',
  DENIED: 'denied'
};

// Notification Types
export const NOTIFICATION_TYPE = {
  REQUEST_CREATED: 'request-created',
  REQUEST_ACCEPTED: 'request-accepted',
  REQUEST_DECLINED: 'request-declined',
  REQUEST_COMPLETED: 'request-completed',
  REFUND_REQUESTED: 'refund-requested',
  REFUND_APPROVED: 'refund-approved',
  REFUND_DENIED: 'refund-denied',
  NEW_CHAT_MESSAGE: 'new-chat-message'
};

// Review Statuses
export const REVIEW_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed'
};

// Special Request Types
export const SPECIAL_REQUEST_TYPE = {
  VIDEO_MESSAGE: 'video-message',
  LIVE_CHAT: 'live-chat',
  CUSTOM_CREATION: 'custom-creation'
};

// Miscellaneous
export const SPECIAL_REQUEST_CHANNEL = 'SPECIAL_REQUEST_CHANNEL';
export const SPECIAL_REQUEST_CHAT_CHANNEL = 'SPECIAL_REQUEST_CHAT_CHANNEL';
export const NOTIFICATION_CHANNEL = 'NOTIFICATION_CHANNEL';
export const FEEDBACK_CHANNEL = 'FEEDBACK_CHANNEL';
export const REVIEW_CHANNEL = 'REVIEW_CHANNEL';

export const REVIEW_EVENT = {
  CREATED: 'created',
  UPDATED: 'updated'
};

export const FEEDBACK_EVENT = {
  CREATED: 'created',
  UPDATED: 'updated'
};

export const MESSAGE_EVENT = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted'
};

export const NOTIFICATION_EVENT = {
  CREATED: 'created',
  UPDATED: 'updated'
};

export const SPECIAL_REQUEST_PAYMENT_CHANNEL = 'SPECIAL_REQUEST_PAYMENT_CHANNEL';

export const SPECIAL_REQUEST_COMPLETION_TOPIC = 'SPECIAL_REQUEST_COMPLETION_TOPIC';
