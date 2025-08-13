import { Schema } from 'mongoose';

export const AdditionalChargesAddedSchema = new Schema({
  reason: { type: String },
  additionalCharge: { type: Number}
})

export const RequesterContactDetailsSchema = new Schema({
  country: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  requesterEmail: { type: String, required: true },
  requesterPhoneNumber: { type: Number, required: true },
  requesterAddress: { type: String }
})

export const SpecialRequestSchema = new Schema({
  fanID: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  creatorID: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  requestTypeID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'PerformerSpecialRequestPage'
  },
  eventType:{
    type: String,
    required: true
  },
  eventLocation:{
    type:String,
    required: true
  },
  eventDuration:{
    type:String,
    required: true
  },
  status: {
    type: String,
    enum: [
      'pending',
      'accepted',
      'declined',
      'completed',
      'refund-requested',
      'refunded'
    ],
    default: 'pending'
  },
  creationDate: { type: Date, default: Date.now },
  eventDate: { type: Date,required: true },
  totalPrice: { type: Number, required: true },
  additionalCharges: [AdditionalChargesAddedSchema],
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'failed', 'refunded'],
    default: 'unpaid'
  },
  refundRequested: { type: Boolean, default: false }, // Legacy support
  refundReason: { type: String },
  refundStatus: {
    type: String,
    enum: ['not-requested', 'requested', 'approved', 'denied'],
    default: 'not-requested'
  },
  messageToPerformer: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500
  },
  contactDetails: RequesterContactDetailsSchema,
  details: { type: Schema.Types.Mixed, default: {} } // JSON field to store additional details about the special request
});
