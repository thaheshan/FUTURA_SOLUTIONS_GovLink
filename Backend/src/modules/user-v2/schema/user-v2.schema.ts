import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRole } from 'src/constant/userRole';
import { AuthV2 } from 'src/modules/auth-v2/schema/auth-v2.shema';

export type UserDocument = UserV2 & Document;

@Schema({ timestamps: true })
export class UserV2 {
    @Prop({ default: false })
    isVerified: boolean;

    @Prop()
    avatarUrl?: string;

    @Prop({ default: UserRole.Creator })
    role?: UserRole;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: AuthV2.name,
        required: true
    })
    authUser: AuthV2;
}

export const UserSchema = SchemaFactory.createForClass(UserV2);
