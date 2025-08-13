import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
    UserDocument,
    UserV2
} from 'src/modules/user-v2/schema/user-v2.schema';
import {
    PAYMENT_STATUS,
    REFUND_STATUS,
    SPECIAL_REQUEST_STATUS
} from '../constants';
import { SpecialRequestPerformerPageDocument } from './special-request-published-performer.schema';

export type AdditionalChargesAddedDocument =
    HydratedDocument<AdditionalChargesAdded>;

@Schema({ _id: false })
export class AdditionalChargesAdded {
    @Prop()
    reason?: string;

    @Prop()
    additionalCharge?: number;
}

export const AdditionalChargesAddedSchema = SchemaFactory.createForClass(
    AdditionalChargesAdded
);

export type RequesterContactDetailsDocument =
    HydratedDocument<RequesterContactDetails>;

@Schema()
export class RequesterContactDetails {
    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phoneNumber: number;

    @Prop()
    address?: string;
}

export const RequesterContactDetailsSchema = SchemaFactory.createForClass(
    RequesterContactDetails
);

export type SpecialRequestDocument = HydratedDocument<SpecialRequest>;

@Schema()
export class SpecialRequest {
    @Prop({ type: Types.ObjectId, ref: UserV2.name, required: true })
    fan: Types.ObjectId | UserDocument;

    @Prop({ type: Types.ObjectId, ref: UserV2.name, required: true })
    creator: Types.ObjectId | UserDocument;

    @Prop({
        type: Types.ObjectId,
        ref: 'PerformerSpecialRequestPage',
        required: true
    })
    requestType: Types.ObjectId | SpecialRequestPerformerPageDocument;

    @Prop({ required: true })
    eventType: string;

    @Prop({ required: true })
    eventLocation: string;

    @Prop({ required: true })
    eventDuration: string;

    @Prop({
        type: String,
        enum: Object.values(SPECIAL_REQUEST_STATUS),
        default: 'pending'
    })
    status: string;

    @Prop({ default: Date.now })
    creationDate: Date;

    @Prop({ required: true })
    eventDate: Date;

    @Prop({ required: true })
    totalPrice: number;

    @Prop({ type: [AdditionalChargesAddedSchema] })
    additionalCharges: AdditionalChargesAdded[];

    @Prop({
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: 'unpaid'
    })
    paymentStatus: string;

    @Prop({ default: false })
    refundRequested: boolean;

    @Prop()
    refundReason?: string;

    @Prop({
        type: String,
        enum: Object.values(REFUND_STATUS),
        default: 'not-requested'
    })
    refundStatus: string;

    @Prop({ required: true, minlength: 10, maxlength: 500 })
    messageToPerformer: string;

    @Prop({ type: RequesterContactDetailsSchema })
    contactDetails: RequesterContactDetails;

    @Prop({ type: Object, default: {} })
    details: Record<string, any>;
}

export const SpecialRequestSchema =
    SchemaFactory.createForClass(SpecialRequest);
