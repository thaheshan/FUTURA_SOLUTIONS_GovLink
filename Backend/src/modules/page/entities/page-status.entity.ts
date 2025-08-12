import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class PageStatus {
    @Prop({ default: false })
    isPublished: boolean;

    @Prop({ default: false })
    profilePictureAdded: boolean;

    @Prop({ default: false })
    coverPictureAdded: boolean;

    @Prop({ default: false })
    descriptionAdded: boolean;

    @Prop({ default: false })
    postAdded: boolean;

    @Prop({ default: false })
    shared: boolean;
}

export const PageStatusSchema = SchemaFactory.createForClass(PageStatus);
