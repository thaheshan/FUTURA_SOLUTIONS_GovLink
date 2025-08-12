import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SpecialRequestTypeCategoryDocument = HydratedDocument<SpecialRequestTypeCategory>;

@Schema()
export class SpecialRequestTypeCategory {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  code: string;

  @Prop()
  description?: string;
}

export const SpecialRequestTypeCategorySchema = SchemaFactory.createForClass(SpecialRequestTypeCategory);
