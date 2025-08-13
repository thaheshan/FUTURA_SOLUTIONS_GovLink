import { Types } from 'mongoose';
import { pick } from 'lodash';
import { FileModel } from 'src/modules/file/models';
import { UserDocument } from 'src/modules/user-v2/schema/user-v2.schema';
import { SpecialRequestTypeDocument } from '../schema/special-request-type.schema';

export class SpecialRequestTeaserVideoDto {
    teaserVideo?: Types.ObjectId | FileModel;

    url?: string;

    constructor(init: Partial<SpecialRequestTeaserVideoDto>) {
        Object.assign(this, pick(init, ['teaserVideo', 'url']));
    }
}
export class SpecialRequestTypeItemDto {
    _id?: Types.ObjectId;

    name: string;

    requestDescription?: string;

    specialRequestType?: Types.ObjectId | SpecialRequestTypeDocument;

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
                'specialRequestType',
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

    creator: Types.ObjectId | UserDocument;

    specialRequestTypes: SpecialRequestTypeItemDto[];

    isPublished: boolean;

    specialRequestTeaserVideo: SpecialRequestTeaserVideoDto[];

    constructor(init: Partial<SpecialRequestPerformerPublishDto>) {
        Object.assign(
            this,
            pick(init, ['_id', 'pageDescription', 'creator', 'isPublished'])
        );

        this.specialRequestTypes = (init.specialRequestTypes || []).map(
            (type) => new SpecialRequestTypeItemDto(type)
        );

        this.specialRequestTeaserVideo = (
            init.specialRequestTeaserVideo || []
        ).map((video) => new SpecialRequestTeaserVideoDto(video));
    }
}
