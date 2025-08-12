import { Schema, Types } from 'mongoose';

export const SpecialRequestFeedbackSchema = new Schema({
  fanID: { type: Types.ObjectId, ref: 'User', required: true },
  creatorID: { type: Types.ObjectId, ref: 'Creator', required: true },
  requestID: { type: Types.ObjectId, ref: 'SpecialRequest', required: true },
  rating: {
    type: Number, min: 1, max: 5, required: true
  },
  comment: { type: String }
});
