import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';

export type AuthV2Document = AuthV2 & Document;

@Schema({ timestamps: true })
export class AuthV2 {
    _id: string;

    @Prop({ required: false, unique: true })
    email: string;

    @Prop({ required: false, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    provider: string;

    @Prop()
    providerId: string;
}

export const AuthV2Schema = SchemaFactory.createForClass(AuthV2);
