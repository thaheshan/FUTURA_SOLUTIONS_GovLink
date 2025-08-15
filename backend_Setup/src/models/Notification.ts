import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  userType: 'citizen' | 'officer' | 'admin';
  type: 'email' | 'sms' | 'push' | 'system';
  channel: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'application' | 'appointment' | 'system' | 'reminder' | 'alert';
  subject?: string;
  message: string;
  templateId?: string;
  templateVariables?: Record<string, any>;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'cancelled';
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  metadata: {
    applicationId?: string;
    appointmentId?: string;
    referenceNumber?: string;
    source: string;
    [key: string]: any;
  };
  readAt?: Date;
  actionRequired?: boolean;
  actionUrl?: string;
  expiresAt?: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userType: {
    type: String,
    enum: ['citizen', 'officer', 'admin'],
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['email', 'sms', 'push', 'system'],
    required: true,
    index: true
  },
  channel: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  category: {
    type: String,
    enum: ['application', 'appointment', 'system', 'reminder', 'alert'],
    required: true,
    index: true
  },
  subject: String,
  message: {
    type: String,
    required: true
  },
  templateId: String,
  templateVariables: Schema.Types.Mixed,
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  scheduledAt: { type: Date, index: true },
  sentAt: Date,
  deliveredAt: Date,
  failureReason: String,
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  metadata: {
    applicationId: String,
    appointmentId: String,
    referenceNumber: String,
    source: { type: String, required: true },
    type: Schema.Types.Mixed
  },
  readAt: Date,
  actionRequired: { type: Boolean, default: false },
  actionUrl: String,
  expiresAt: { type: Date, index: true }
}, { timestamps: true });

// Compound indexes for efficient queries
notificationSchema.index({ userId: 1, status: 1, createdAt: -1 });
notificationSchema.index({ status: 1, scheduledAt: 1 });
notificationSchema.index({ type: 1, status: 1, priority: -1 });
notificationSchema.index({ category: 1, userId: 1, createdAt: -1 });

// TTL index to automatically delete expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification = model<INotification>('Notification', notificationSchema);