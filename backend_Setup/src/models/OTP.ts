import { Schema, model, Document } from 'mongoose';
import type { IOTP } from '../types/auth';
import { OTPType } from '../types/auth';

const OTPSchema = new Schema<IOTP>({
  userId: { 
    type: Schema.Types.ObjectId as any, // 👈 bypass strict type
    ref: 'User',
    required: true 
  },
  code: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(OTPType),
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL
  }
}, {
  timestamps: true
});

// Index for faster queries
OTPSchema.index({ userId: 1, type: 1 });

export const OTP = model<IOTP>('OTP', OTPSchema);
