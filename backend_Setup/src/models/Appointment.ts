import { Schema, model, Document } from 'mongoose';

export interface IAppointment extends Document {
  applicationId: string;
  applicationType: 'nic' | 'passport' | 'other';
  applicantInfo: {
    name: string;
    email: string;
    phone: string;
    nicNumber?: string;
  };
  officerInfo: {
    officerId: string;
    officerName: string;
    department: string;
  };
  appointmentDetails: {
    date: Date;
    timeSlot: string;
    duration: number;
    venue: {
      name: string;
      address: string;
      roomNumber?: string;
    };
  };
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
  purpose: string;
  notes?: string;
  remindersSent: {
    twentyFourHour: boolean;
    twoHour: boolean;
    thirtyMinute: boolean;
  };
  rescheduleHistory: {
    previousDate: Date;
    previousTimeSlot: string;
    reason: string;
    rescheduledBy: string;
    rescheduledAt: Date;
  }[];
  checkInTime?: Date;
  checkOutTime?: Date;
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: Date;
  };
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  applicationId: {
    type: String,
    required: true,
    index: true
  },
  applicationType: {
    type: String,
    enum: ['nic', 'passport', 'other'],
    required: true,
    index: true
  },
  applicantInfo: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    nicNumber: { type: String, trim: true }
  },
  officerInfo: {
    officerId: { type: String, required: true, index: true },
    officerName: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true }
  },
  appointmentDetails: {
    date: { type: Date, required: true, index: true },
    timeSlot: { type: String, required: true },
    duration: { type: Number, default: 30 },
    venue: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      roomNumber: String
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled', 'no_show'],
    default: 'scheduled',
    index: true
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  notes: { type: String, trim: true },
  remindersSent: {
    twentyFourHour: { type: Boolean, default: false },
    twoHour: { type: Boolean, default: false },
    thirtyMinute: { type: Boolean, default: false }
  },
  rescheduleHistory: [{
    previousDate: Date,
    previousTimeSlot: String,
    reason: String,
    rescheduledBy: String,
    rescheduledAt: { type: Date, default: Date.now }
  }],
  checkInTime: Date,
  checkOutTime: Date,
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedAt: Date
  },
  cancellationReason: String,
  cancelledBy: String,
  cancelledAt: Date
}, { timestamps: true });

// Compound indexes for performance
appointmentSchema.index({ 'appointmentDetails.date': 1, 'appointmentDetails.timeSlot': 1 });
appointmentSchema.index({ 'officerInfo.officerId': 1, 'appointmentDetails.date': 1 });
appointmentSchema.index({ status: 1, 'appointmentDetails.date': 1 });
appointmentSchema.index({ applicationType: 1, status: 1 });

export const Appointment = model<IAppointment>('Appointment', appointmentSchema);