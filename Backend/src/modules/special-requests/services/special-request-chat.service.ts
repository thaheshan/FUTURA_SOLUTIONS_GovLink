import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { QueueEventService } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { MESSAGE_EVENT, SPECIAL_REQUEST_CHAT_CHANNEL } from '../constants';
import { SpecialRequestChatDto } from '../dtos';
import { SpecialRequestChatModel } from '../models';
import { SpecialRequestChatCreatePayload } from '../payloads';
import { SPECIAL_REQUEST_CHAT_MODEL_PROVIDER } from '../providers';

@Injectable()
export class SpecialRequestChatService {
  constructor(
    @Inject(SPECIAL_REQUEST_CHAT_MODEL_PROVIDER)
    private readonly chatModel: Model<SpecialRequestChatModel>,
    private readonly queueEventService: QueueEventService
  ) {}

  /**
   * Create a chat message for a special request
   */
  public async createChatMessage(
    requestId: string | Types.ObjectId,
    payload: SpecialRequestChatCreatePayload,
    sender: UserDto
  ): Promise<SpecialRequestChatDto> {
    const chatMessage = await this.chatModel.create({
      requestId,
      senderId: sender._id,
      senderRole: sender.roles.includes('admin') ? 'admin' : 'user',
      message: payload.message,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const dto = new SpecialRequestChatDto(chatMessage);

    // Publish event for the created chat message
    await this.queueEventService.publish({
      channel: SPECIAL_REQUEST_CHAT_CHANNEL,
      eventName: MESSAGE_EVENT.CREATED,
      data: dto
    });

    return dto;
  }

  /**
   * Get chat messages for a specific special request
   */
  public async getChatMessages(
    requestId: string | Types.ObjectId,
    limit: number,
    offset: number
  ): Promise<{ data: SpecialRequestChatDto[]; total: number }> {
    const [messages, total] = await Promise.all([
      this.chatModel
        .find({ requestId })
        .sort({ createdAt: 1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      this.chatModel.countDocuments({ requestId })
    ]);

    return {
      data: messages.map((m) => new SpecialRequestChatDto(m)),
      total
    };
  }

  /**
   * Delete a chat message
   */
  public async deleteChatMessage(
    messageId: string | Types.ObjectId,
    user: UserDto
  ): Promise<boolean> {
    const message = await this.chatModel.findById(messageId);
    if (!message) throw new NotFoundException('Message not found');

    if (
      !user.roles.includes('admin') &&
      message.senderID.toString() !== user._id.toString()
    ) {
      throw new ForbiddenException(
        'You are not authorized to delete this message'
      );
    }

    await this.chatModel.deleteOne({ _id: messageId });

    // Publish event for the deleted chat message
    await this.queueEventService.publish({
      channel: SPECIAL_REQUEST_CHAT_CHANNEL,
      eventName: MESSAGE_EVENT.DELETED,
      data: { messageId }
    });

    return true;
  }
}
