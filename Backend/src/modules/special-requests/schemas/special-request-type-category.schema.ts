import { Schema } from 'mongoose';

export const SpecialRequestTypeCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: {
    type: String, required: true, unique: true, index: true
  },
  description: { type: String }
});
