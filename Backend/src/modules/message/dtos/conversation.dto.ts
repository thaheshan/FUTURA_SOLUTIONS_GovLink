import { Types } from 'mongoose';
import { pick } from 'lodash';
import { IRecipient } from '../models';

export class ConversationDto {
  _id: Types.ObjectId;

  type: string;

  name: string;

  recipients: IRecipient[];

  lastMessage: string;

  lastSenderId: Types.ObjectId;

  lastMessageCreatedAt: Date;

  meta: any;

  createdAt: Date;

  updatedAt: Date;

  recipientInfo: any;

  totalNotSeenMessages: number;

  isSubscribed: boolean;

  isBlocked: boolean;

  streamId: Types.ObjectId;

  performerId: Types.ObjectId;

  constructor(data: Partial<ConversationDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'type',
        'name',
        'recipients',
        'lastMessage',
        'lastSenderId',
        'lastMessageCreatedAt',
        'meta',
        'createdAt',
        'updatedAt',
        'recipientInfo',
        'totalNotSeenMessages',
        'isSubscribed',
        'isBlocked',
        'streamId',
        'performerId'
      ])
    );
  }

  public getRoomName() {
    return `conversation-${this.type}-${this._id}`;
  }
}
