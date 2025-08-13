import { Types } from 'mongoose';
import { pick } from 'lodash';

export class NotificationDto {
  _id: Types.ObjectId;

  recipientID: Types.ObjectId;

  requestID: Types.ObjectId;

  message: string;

  timeStamp: Date;

  status: string;

  constructor(init: Partial<NotificationDto>) {
    Object.assign(
      this,
      pick(init, [
        '_id',
        'recipientID',
        'requestID',
        'message',
        'timeStamp',
        'status'
      ])
    );
  }

  toPublic() {
    return {
      _id: this._id,
      recipientID: this.recipientID,
      requestID: this.requestID,
      message: this.message,
      timeStamp: this.timeStamp,
      status: this.status
    };
  }
}
