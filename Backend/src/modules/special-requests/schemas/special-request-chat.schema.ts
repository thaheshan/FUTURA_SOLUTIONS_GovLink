import { Schema, Types } from 'mongoose';

export const SpecialRequestChatSchema = new Schema({
  senderID: { type: Types.ObjectId, ref: 'User', required: true },
  receiverID: { type: Types.ObjectId, ref: 'User', required: true },
  requestID: { type: Types.ObjectId, ref: 'SpecialRequest', required: true },
  chatContent: { type: String, required: true },
  chatMeta: { type: Object } // metadata like timestamps, status, etc.
});
