import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { FileModel } from 'src/modules/file/models';
import {
    UserDocument,
    UserV2
} from 'src/modules/user-v2/schema/user-v2.schema';
import { SpecialRequestTypeDocument } from './special-request-type.schema';

export type SpecialRequestTypesAddedDocument =
    HydratedDocument<SpecialRequestTypesAdded>;

@Schema()
export class SpecialRequestTypesAdded {
    @Prop({ required: true })
    requestDescription: string;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'SpecialRequestType', required: false })
    specialRequestType?: Types.ObjectId | SpecialRequestTypeDocument;

    @Prop({ default: false })
    enabled: boolean;

    @Prop({ required: true })
    basePrice: number;

    @Prop()
    highlights?: string;
}

export const SpecialRequestTypesAddedSchema = SchemaFactory.createForClass(
    SpecialRequestTypesAdded
);

export type SpecialRequestTeaserVideoAddedDocument =
    HydratedDocument<SpecialRequestTeaserVideoAdded>;

@Schema({ _id: false })
export class SpecialRequestTeaserVideoAdded {
    @Prop({ type: Types.ObjectId, ref: 'File' })
    teaserVideo?: Types.ObjectId | FileModel;

    @Prop()
    url?: string;
}

export const SpecialRequestTeaserVideoAddedSchema =
    SchemaFactory.createForClass(SpecialRequestTeaserVideoAdded);

export type SpecialRequestPerformerPageDocument =
    HydratedDocument<CreatorSpecialRequestPage>;

@Schema()
export class CreatorSpecialRequestPage {
    @Prop({ unique: true })
    pageDescription?: string;

    @Prop({
        type: Types.ObjectId,
        ref: UserV2.name,
        required: true,
        unique: true
    })
    creator: Types.ObjectId | UserDocument;

    @Prop({ type: [SpecialRequestTypesAddedSchema] })
    specialRequestTypes: SpecialRequestTypesAdded[];

    @Prop({ required: true, default: false })
    isPublished: boolean;

    @Prop({ type: [SpecialRequestTeaserVideoAddedSchema] })
    specialRequestTeaserVideo: SpecialRequestTeaserVideoAdded[];
}

export const SpecialRequestPerformerPageSchema = SchemaFactory.createForClass(
    CreatorSpecialRequestPage
);
