import { Document, Types } from 'mongoose';

export class NotificationModel extends Document {
  recipientID: Types.ObjectId;

  requestID: Types.ObjectId;

  message: string;

  timeStamp: Date;

  status: string;
}
