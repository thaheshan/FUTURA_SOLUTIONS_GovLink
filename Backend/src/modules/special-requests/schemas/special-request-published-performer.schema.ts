import { Schema, Types } from 'mongoose';

export const SpecialRequestTypesAddedSchema = new Schema({
  requestDescription: { type: String, required: true },
  name: { type: String,required: true, unique: true },
  specialRequestTypeId: { type: Types.ObjectId, ref: 'SpecialRequestType',required: false },
  enabled: { type: Boolean, default: false },
  basePrice: { type: Number, required: true },
  highlights: { type: String }
})

export const SpecialRequestTeaserVideoAddedSchema = new Schema({
  teaserVideoId: {type: Types.ObjectId},
  url:{type:String}
})

export const SpecialRequestPerformerPageSchema = new Schema({
  pageDescription: { type: String, unique: true }, 
  creatorId: { type: Types.ObjectId, ref: 'User',unique: true,required: true },
  specialRequestTypes: [SpecialRequestTypesAddedSchema],
  isPublished: { type: Boolean, default: false,required: true },
  specialRequestTeaserVideo: [SpecialRequestTeaserVideoAddedSchema]
});
