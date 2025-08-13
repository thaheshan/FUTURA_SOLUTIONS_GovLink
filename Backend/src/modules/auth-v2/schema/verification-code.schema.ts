import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserV2 } from 'src/modules/user-v2/schema/user-v2.schema';

export type VerificationCodeDocument = VerificationCode & Document;

@Schema({ timestamps: true }) // adds createdAt and updatedAt
export class VerificationCode {
    @Prop({ required: true })
    code: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: UserV2.name,
        required: true,
        unique: true
    })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ default: false })
    used: boolean;
}

export const VerificationCodeSchema =
    SchemaFactory.createForClass(VerificationCode);
