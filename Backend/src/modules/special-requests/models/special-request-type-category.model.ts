import { Document } from 'mongoose';

export class SpecialRequestTypeCategoryModel extends Document {
  name: string;

  code: string;

  description: string;
}
