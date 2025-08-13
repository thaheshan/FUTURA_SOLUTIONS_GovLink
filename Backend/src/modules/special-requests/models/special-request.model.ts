import { Document, Types } from 'mongoose';

export class SpecialRequestModel extends Document {
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

  additionalCharges:[{
    reason: string,

    additionalCharge:number
  }];

  paymentStatus: string;

  refundRequested: boolean;

  refundReason: string;

  refundStatus: string;

  messageToPerformer: string;

  contactDetails:{
    country:string,

    firstName: string,

    lastName: string,

    requesterEmail:  string,

    requesterPhoneNumber: number,

    requesterAddress: string

  }

  details: Record<string, any>; // JSON field to store details about the special request
}
