import { Schema, Types } from 'mongoose';

export const SpecialRequestReviewSchema = new Schema({
  requestID: { type: Types.ObjectId, required: true, index: true },
  reviewerID: { type: Types.ObjectId, required: true, index: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
  reviewDate: { type: Date, default: Date.now },
  reviewStatus: { type: String, required: true },
  refundStatus: { type: String, default: 'pending' },
  reviewNotes: { type: String },
  updatedAt: { type: Date, default: Date.now }
});
