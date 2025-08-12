import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { FileModel } from 'src/modules/file/models';
import {
    UserDocument,
    UserV2
} from 'src/modules/user-v2/schema/user-v2.schema';
import { PostTypeEnum, PostVisibilityEnum } from '../constants';

export type CreatorPostV2Document = HydratedDocument<CreatorPostV2>;

@Schema({ timestamps: true })
export class CreatorPostV2 {
    @Prop({ required: true, enum: Object.values(PostTypeEnum) })
    postType: PostTypeEnum;

    @Prop({ type: Types.ObjectId, ref: UserV2.name })
    creator: Types.ObjectId | UserDocument;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, default: true })
    allowComments: boolean;

    @Prop({
        required: true,
        default: PostVisibilityEnum.PUBLIC,
        enum: Object.values(PostVisibilityEnum)
    })
    postVisibility: PostVisibilityEnum;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: Types.ObjectId, ref: 'File' })
    image: Types.ObjectId | FileModel;

    @Prop({ type: Types.ObjectId, ref: 'File' })
    video: Types.ObjectId | FileModel;
}

export const CreatorPostV2Schema = SchemaFactory.createForClass(CreatorPostV2);
