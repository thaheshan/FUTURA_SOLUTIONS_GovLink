import { Schema } from 'mongoose';

export const ToxicityReportSchema = new Schema({
  messageId: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
    index: true
  },
  detectedLabels: [
    {
      label: { type: String, required: true },
      score: { type: Number, required: true }
    }
  ],
  toxicity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'toxicityreports'
});
