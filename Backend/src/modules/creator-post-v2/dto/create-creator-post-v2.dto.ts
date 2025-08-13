import { Types } from 'mongoose';
import { pick } from 'lodash';
import { FileModel } from 'src/modules/file/models';
import { UserDocument } from 'src/modules/user-v2/schema/user-v2.schema';
import { PostTypeEnum, PostVisibilityEnum } from '../constants';

export class CreateCreatorPostDto {
    _id?: Types.ObjectId;

    postType?: PostTypeEnum;

    creator: Types.ObjectId | UserDocument;

    description: string;

    postVisibility: PostVisibilityEnum;

    allowComments: boolean;

    tags: string[];

    image: Types.ObjectId | FileModel;

    imageUrl: string;

    video: Types.ObjectId | FileModel;

    videoUrl: string;

    constructor(init: Partial<CreateCreatorPostDto>) {
        Object.assign(
            this,
            pick(init, [
                '_id',
                'postType',
                'creator',
                'description',
                'postVisibility',
                'allowComments',
                'image',
                'imageUrl',
                'video',
                'videoUrl'
            ])
        );

        this.tags = init.tags || [];
    }
}
