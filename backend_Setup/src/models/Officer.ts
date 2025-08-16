// src/models/Officer.ts
import mongoose, { Document } from 'mongoose';
const { Schema } = mongoose;

interface IOfficer extends Document {
  userId: string;
  employeeId: string;
  department: string;
  position: string;
  specializations: string[];
  workload: { current: number; maximum: number };
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  performance: {
    applicationsProcessed: number;
    averageProcessingTime: number;
    rating: number;
    lastEvaluationDate?: Date;
  };
  team?: { teamId: string; role: 'member' | 'leader' | 'supervisor' };
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: Date;
}

const officerSchema = new Schema<IOfficer>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String, required: true, unique: true, index: true },
    department: { type: String, required: true, index: true },
    position: { type: String, required: true },
    specializations: [{ type: String }],
    workload: { current: { type: Number, default: 0 }, maximum: { type: Number, default: 50 } },
    availability: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: false },
      sunday: { start: '09:00', end: '17:00', available: false },
    },
    performance: {
      applicationsProcessed: { type: Number, default: 0 },
      averageProcessingTime: { type: Number, default: 0 },
      rating: { type: Number, default: 5.0, min: 1, max: 5 },
      lastEvaluationDate: Date,
    },
    team: {
      teamId: String,
      role: { type: String, enum: ['member', 'leader', 'supervisor'], default: 'member' },
    },
    status: { type: String, enum: ['active', 'inactive', 'on_leave'], default: 'active', index: true },
    joinDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes
officerSchema.index({ department: 1, status: 1 });
officerSchema.index({ specializations: 1, status: 1 });
officerSchema.index({ 'workload.current': 1, status: 1 });

// Create and export the model
const Officer = mongoose.model<IOfficer>('Officer', officerSchema);

export default Officer;


