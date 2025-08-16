import { Schema, model, Document, models } from 'mongoose';


const officerSchema = new Schema<Officer>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    ref: 'User'
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  department: {
    type: String,
    required: true,
    index: true
  },
  position: {
    type: String,
    required: true
  },
  specializations: [{
    type: String,
    required: true
  }],
  workload: {
    current: { type: Number, default: 0, min: 0 },
    maximum: { type: Number, default: 50, min: 1 }
  },
  availability: {
    monday: { start: { type: String, default: '09:00' }, end: { type: String, default: '17:00' }, available: { type: Boolean, default: true } },
    tuesday: { start: { type: String, default: '09:00' }, end: { type: String, default: '17:00' }, available: { type: Boolean, default: true } },
    wednesday: { start: { type: String, default: '09:00' }, end: { type: String, default: '17:00' }, available: { type: Boolean, default: true } },
    thursday: { start: { type: String, default: '09:00' }, end: { type: String, default: '17:00' }, available: { type: Boolean, default: true } },
    friday: { start: { type: String, default: '09:00' }, end: { type: String, default: '17:00' }, available: { type: Boolean, default: true } },
    saturday: { start: { type: String, default: '09:00' }, end: { type: String, default: '13:00' }, available: { type: Boolean, default: false } },
    sunday: { start: { type: String, default: '09:00' }, end: { type: String, default: '17:00' }, available: { type: Boolean, default: false } }
  },
  performance: {
    applicationsProcessed: { type: Number, default: 0 },
    averageProcessingTime: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0, min: 1, max: 5 },
    lastEvaluationDate: Date,
    completionRate: { type: Number, default: 0, min: 0, max: 100 }
  },
  team: {
    teamId: String,
    role: { type: String, enum: ['member', 'leader', 'supervisor'], default: 'member' }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active',
    index: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes for performance
officerSchema.index({ department: 1, status: 1 });
officerSchema.index({ specializations: 1, status: 1 });
officerSchema.index({ 'workload.current': 1, status: 1 });

// Safe model creation to prevent OverwriteModelError
export const Officer = models.Officer || model<IOfficer>('Officer', officerSchema);


