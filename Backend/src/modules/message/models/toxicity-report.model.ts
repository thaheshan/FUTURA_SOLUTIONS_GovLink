import { Document, Types } from 'mongoose';

export class ToxicityReportModel extends Document {
  messageId: Types.ObjectId;

  detectedLabels: {
    label: string;
    score: number;
  }[];

  toxicity: number;

  createdAt?: Date;

  updatedAt?: Date;
}
