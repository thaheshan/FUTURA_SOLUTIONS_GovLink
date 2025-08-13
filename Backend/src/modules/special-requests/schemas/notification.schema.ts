import { Schema, Types } from 'mongoose';

export const NotificationSchema = new Schema({
  recipientID: { type: Types.ObjectId, ref: 'User', required: true },
  requestID: { type: Types.ObjectId, ref: 'SpecialRequest', required: true },
  message: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
  status: { type: String, default: 'unread', index: true }
});
