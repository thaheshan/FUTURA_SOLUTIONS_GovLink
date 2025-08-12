import { Document, Types } from 'mongoose';

export class SpecialRequestChatModel extends Document {
  senderID: Types.ObjectId;

  receiverID: Types.ObjectId;

  requestID: Types.ObjectId;

  chatContent: string;

  chatMeta: object; // Metadata (e.g., timestamps, message status)
}
