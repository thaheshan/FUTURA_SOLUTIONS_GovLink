import { Schema, model, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  category: string;
  district: string;
  status: 'active' | 'inactive' | 'maintenance';
  requirements: string[];
  processingTime: string;
  fees: number;
  documents: string[];
  eligibility: string[];
  onlineAvailable: boolean;
  departmentCode: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  lastUpdated: Date;
}

const serviceSchema = new Schema<IService>({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  district: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
    index: true
  },
  requirements: [{
    type: String,
    trim: true
  }],
  processingTime: {
    type: String,
    required: true
  },
  fees: {
    type: Number,
    default: 0,
    min: 0
  },
  documents: [{
    type: String,
    trim: true
  }],
  eligibility: [{
    type: String,
    trim: true
  }],
  onlineAvailable: {
    type: Boolean,
    default: true
  },
  departmentCode: {
    type: String,
    required: true,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Text search index for name and description
serviceSchema.index({ 
  name: 'text', 
  description: 'text',
  category: 'text',
  tags: 'text'
});

// Compound indexes for common queries
serviceSchema.index({ district: 1, category: 1, status: 1 });
serviceSchema.index({ departmentCode: 1, status: 1 });
serviceSchema.index({ priority: 1, status: 1 });

export const Service = model<IService>('Service', serviceSchema);