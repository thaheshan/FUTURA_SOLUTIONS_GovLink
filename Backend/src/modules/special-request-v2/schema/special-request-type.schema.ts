import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SpecialRequestTypeDocument = HydratedDocument<SpecialRequestType>;

@Schema()
export class SpecialRequestType {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description?: string;

    @Prop({ required: true })
    basePrice: number;

    @Prop({
        type: Types.ObjectId,
        ref: 'SpecialRequestTypeCategory',
        required: false
    })
    categoryId?: Types.ObjectId;

    @Prop({ default: false })
    enabled: boolean;
}

export const SpecialRequestTypeSchema =
    SchemaFactory.createForClass(SpecialRequestType);
