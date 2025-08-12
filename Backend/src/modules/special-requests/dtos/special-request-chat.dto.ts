import { Types } from 'mongoose';
import { pick } from 'lodash';

export class SpecialRequestChatDto {
  _id: Types.ObjectId;

  senderID: Types.ObjectId;

  receiverID: Types.ObjectId;

  requestID: Types.ObjectId;

  chatContent: string;

  chatMeta: object;

  constructor(init: Partial<SpecialRequestChatDto>) {
    Object.assign(
      this,
      pick(init, [
        '_id',
        'senderID',
        'receiverID',
        'requestID',
        'chatContent',
        'chatMeta'
      ])
    );
  }

  toPublic() {
    return {
      _id: this._id,
      senderID: this.senderID,
      receiverID: this.receiverID,
      requestID: this.requestID,
      chatContent: this.chatContent
    };
  }
}
