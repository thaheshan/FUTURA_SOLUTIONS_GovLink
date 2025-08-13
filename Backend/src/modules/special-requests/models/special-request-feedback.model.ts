import { Document, Types } from 'mongoose';

export class SpecialRequestFeedbackModel extends Document {
  fanID: Types.ObjectId;

  creatorID: Types.ObjectId;

  requestID: Types.ObjectId;

  rating: number;

  comment: string;
}
