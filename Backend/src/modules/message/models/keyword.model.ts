import { Document } from 'mongoose';

export class MessageDetectionKeywordModel extends Document {
  keyword: string;

  createdAt?: Date;

  updatedAt?: Date;
}
