import { Types } from 'mongoose';
import { pick } from 'lodash';

export class FanSpecialRequesAdditionalChargestDto {
  _id?: Types.ObjectId;

  reason: string;

  additionalCharge:number;

  constructor(init: Partial<FanSpecialRequesAdditionalChargestDto>) {
    Object.assign(
      this, 
      pick(init, [
        '_id',
        'reason',
        'additionalCharge'
      ]));
  }
}

export class FanSpecialRequestContactDetailsDto {
  _id?: Types.ObjectId;

  country:string;

  firstName: string;

  lastName: string;

  requesterEmail:  string;

  requesterPhoneNumber: number;

  requesterAddress: string;

  constructor(init: Partial<FanSpecialRequestContactDetailsDto>) {
    Object.assign(
      this, 
      pick(init, [
        '_id',
        'country',
        'firstName',
        'lastName',
        'requesterEmail',
        'requesterPhoneNumber',
        'requesterAddress'
      ]));
  }
}

export class SpecialRequestDto {
  _id: Types.ObjectId;

  fanID: Types.ObjectId;

  creatorID: Types.ObjectId;

  requestTypeID: Types.ObjectId;

  eventType: string;

  eventLocation:string;

  eventDuration:string;

  status: string;

  eventDate:Date;

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
        'fanID',
        'creatorID',
        'requestTypeID',
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
    this.contactDetails = init.contactDetails ? new FanSpecialRequestContactDetailsDto(init.contactDetails): null;
  }

  toPublic() {
    return {
      _id: this._id,
      fanID: this.fanID,
      creatorID: this.creatorID,
      requestTypeID: this.requestTypeID,
      status: this.status,
      creationDate: this.creationDate,
      totalPrice: this.totalPrice,
      paymentStatus: this.paymentStatus,
      refundStatus: this.refundStatus,
      messageToPerformer: this.messageToPerformer
    };
  }
}
