import { Types } from 'mongoose';
import { pick } from 'lodash';
import { UserDocument } from 'src/modules/user-v2/schema/user-v2.schema';
import { SpecialRequestPerformerPageDocument } from '../schema/special-request-published-performer.schema';

export class FanSpecialRequesAdditionalChargestDto {
    reason?: string;

    additionalCharge?: number;

    constructor(init: Partial<FanSpecialRequesAdditionalChargestDto>) {
        Object.assign(this, pick(init, ['reason', 'additionalCharge']));
    }
}

export class FanSpecialRequestContactDetailsDto {
    _id?: Types.ObjectId;

    country: string;

    firstName: string;

    lastName: string;

    email: string;

    phoneNumber: number;

    address?: string;

    constructor(init: Partial<FanSpecialRequestContactDetailsDto>) {
        Object.assign(
            this,
            pick(init, [
                '_id',
                'country',
                'firstName',
                'lastName',
                'email',
                'phoneNumber',
                'address'
            ])
        );
    }
}

export class SpecialRequestDto {
    _id: Types.ObjectId;

    fan: Types.ObjectId | UserDocument;

    creator: Types.ObjectId | UserDocument;

    requestType: Types.ObjectId | SpecialRequestPerformerPageDocument;

    eventType: string;

    eventLocation: string;

    eventDuration: string;

    status: string;

    eventDate: Date;

    creationDate: Date;

    totalPrice: number;

    additionalCharges: FanSpecialRequesAdditionalChargestDto[];

    paymentStatus: string;

    refundRequested: boolean;

    refundReason: string;

    refundStatus: string;

    contactDetails: FanSpecialRequestContactDetailsDto;

    messageToPerformer: string;

    constructor(init: Partial<SpecialRequestDto>) {
        Object.assign(
            this,
            pick(init, [
                '_id',
                'fan',
                'creator',
                'requestType',
                'eventType',
                'eventLocation',
                'eventDuration',
                'eventDate',
                'status',
                'creationDate',
                'totalPrice',
                'paymentStatus',
                'refundRequested',
                'refundReason',
                'refundStatus',
                'messageToPerformer'
            ])
        );

        this.additionalCharges = (init.additionalCharges || []).map(
            (type) => new FanSpecialRequesAdditionalChargestDto(type)
        );
        this.contactDetails = init.contactDetails
            ? new FanSpecialRequestContactDetailsDto(init.contactDetails)
            : null;
    }

    toPublic() {
        return {
            _id: this._id,
            fanID: this.fan,
            creator: this.creator,
            requestTypeID: this.requestType,
            status: this.status,
            creationDate: this.creationDate,
            totalPrice: this.totalPrice,
            paymentStatus: this.paymentStatus,
            refundStatus: this.refundStatus,
            messageToPerformer: this.messageToPerformer
        };
    }
}
