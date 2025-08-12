import { Types } from 'mongoose';
import { pick } from 'lodash';

export class SpecialRequestTeaserVideoDto {
  _id?: Types.ObjectId;

  teaserVideoId?: Types.ObjectId;

  url?: string;

  constructor(init: Partial<SpecialRequestTeaserVideoDto>) {
    Object.assign(
      this, 
      pick(init, [
        '_id',
        'teaserVideoId',
        'url'
      ]));
  }
}
export class SpecialRequestTypeItemDto {
  _id?: Types.ObjectId;

  name: string;

  requestDescription?: string;

  specialRequestTypeId?: Types.ObjectId|null;

  enabled: boolean;

  basePrice?: number;

  highlights?: string;

  categoryId?: Types.ObjectId;

  constructor(init: Partial<SpecialRequestTypeItemDto>) {
    Object.assign(
      this,
      pick(init, [
        '_id',
        'requestDescription',
        'name',
        'specialRequestTypeId',
        'enabled',
        'basePrice',
        'highlights',
        'categoryId'
      ])
    );
  }
}

export class SpecialRequestPerformerPublishDto {
  _id?: Types.ObjectId;

  pageDescription?: string;

  creatorId: Types.ObjectId;

  specialRequestTypes: SpecialRequestTypeItemDto[];

  isPublished: boolean;

  specialRequestTeaserVideo: SpecialRequestTeaserVideoDto[];

  constructor(init: Partial<SpecialRequestPerformerPublishDto>) {
    Object.assign(
      this,
      pick(init, [
        '_id',
        'pageDescription',
        'creatorId',
        'isPublished'
      ])
    );

    this.specialRequestTypes = (init.specialRequestTypes || []).map(
      (type) => new SpecialRequestTypeItemDto(type)
    );

    this.specialRequestTeaserVideo = (init.specialRequestTeaserVideo || []).map(
      (video) => new SpecialRequestTeaserVideoDto(video)
    );
  }
}

