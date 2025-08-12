import { Document, FlattenMaps, Types } from 'mongoose';

export class SpecialRequestPerfomerPublishedModel extends Document {
  pageDescription : string;

  creatorId: Types.ObjectId;

  specialRequestTypes: FlattenMaps<{
    name: string,

    requestDescription: string,

    specialRequestTypeId?: Types.ObjectId | null,

    enabled: boolean,

    basePrice: number,

    highlights: string

  }>[];

  isPublished: boolean;

  specialRequestTeaserVideo: FlattenMaps<{
    teaserVideoId: Types.ObjectId,
    url: string
  }>[];
}
