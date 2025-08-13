import { Document, Types } from 'mongoose';

export class SpecialRequestTypeModel extends Document {
  name: string;

  description: string;

  basePrice: number;

  estimatedDeliveryTime: number;

  categoryId: Types.ObjectId;

  creatorId: Types.ObjectId;

  enabled: boolean;

  highlights: string;

  fields: Record<string, any>; // JSON field to store details about the special request
}
