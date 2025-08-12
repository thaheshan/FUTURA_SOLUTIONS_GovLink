import { Document, Types } from 'mongoose';

export class SpecialRequestReviewModel extends Document {
  requestID: Types.ObjectId;

  reviewerID: Types.ObjectId;

  rating: number;

  comment: string;

  reviewDate: Date;

  reviewStatus: string;

  refundStatus: string;

  reviewNotes: string;

  updatedAt: Date;
}
