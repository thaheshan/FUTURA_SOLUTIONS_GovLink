import { Schema } from 'mongoose';

export const MessageDetectionKeywordSchema = new Schema({
  keyword: {
    type: String,
    required: true,
    index: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});
