import { Document, Types } from 'mongoose';

export class PerformerModel extends Document {
  _id: Types.ObjectId;

  firstName: string;

  lastName: string;

  username: string;

  email: string;

  createdAt: Date;

  updatedAt: Date;

  isOnline: boolean;

  onlineAt: Date;

  offlineAt: Date;

  welcomeVideoId: Types.ObjectId;
}
