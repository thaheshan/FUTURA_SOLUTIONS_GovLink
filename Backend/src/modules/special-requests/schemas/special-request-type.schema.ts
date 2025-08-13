import { Schema, Types } from 'mongoose';

export const SpecialRequestTypeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  basePrice: { type: Number, required: true },
  estimatedDeliveryTime: { type: Number, required: true }, // e.g., delivery time in hours/days
  creatorId: { type: Types.ObjectId, ref: 'User' },
  categoryId: { type: Types.ObjectId, ref: 'SpecialRequestTypeCategory', required: false },
  enabled: { type: Boolean, default: false },
  highlights: { type: String },
  fields: { type: Schema.Types.Mixed, default: {} } // JSON field to store additional details about the special request
});
