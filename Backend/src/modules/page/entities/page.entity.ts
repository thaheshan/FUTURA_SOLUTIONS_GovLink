import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
    UserDocument,
    UserV2
} from 'src/modules/user-v2/schema/user-v2.schema';
import { PageStatus, PageStatusSchema } from './page-status.entity';

export type PageDocument = Page & Document;

@Schema({ timestamps: true })
export class Page {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    url: string;

    @Prop({ ref: UserV2.name, type: Types.ObjectId, required: true })
    user: UserDocument | Types.ObjectId;

    @Prop({})
    description?: string;

    @Prop({ default: false })
    isPublished: boolean;

    @Prop({ type: PageStatusSchema, default: {} })
    status: PageStatus;

    @Prop()
    introVideo?: string;

    @Prop()
    profilePicture?: string;

    @Prop()
    coverPicture?: string;
}
export const PageSchema = SchemaFactory.createForClass(Page);
