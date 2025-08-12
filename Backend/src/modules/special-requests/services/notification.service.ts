import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { NOTIFICATION_CHANNEL, NOTIFICATION_EVENT } from '../constants';
import { NotificationDto } from '../dtos';
import { NotificationModel } from '../models';
import {
  NotificationCreatePayload
} from '../payloads';
import { NOTIFICATION_MODEL_PROVIDER } from '../providers';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_MODEL_PROVIDER)
    private readonly notificationModel: Model<NotificationModel>,
    private readonly queueEventService: QueueEventService
  ) {}

  /**
   * Create a new notification
   */
  public async createNotification(
    payload: NotificationCreatePayload,
    recipientId: Types.ObjectId
  ): Promise<NotificationDto> {
    const notification = await this.notificationModel.create({
      ...payload,
      recipientId,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const dto = new NotificationDto(notification);

    // Publish event for notification creation
    await this.queueEventService.publish(
      new QueueEvent({
        channel: NOTIFICATION_CHANNEL,
        eventName: NOTIFICATION_EVENT.CREATED,
        data: dto
      })
    );

    return dto;
  }

  /**
   * Mark a notification as read
   */
  public async markAsRead(
    notificationId: string | Types.ObjectId,
    user: UserDto
  ): Promise<boolean> {
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) throw new NotFoundException('Notification not found');

    if (notification.recipientID.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'You are not authorized to mark this notification as read'
      );
    }

    await notification.save();

    // Publish event for notification update
    await this.queueEventService.publish(
      new QueueEvent({
        channel: NOTIFICATION_CHANNEL,
        eventName: NOTIFICATION_EVENT.UPDATED,
        data: new NotificationDto(notification)
      })
    );

    return true;
  }

  /**
   * Get notifications for a user
   */
  public async getNotifications(
    recipientId: string | Types.ObjectId,
    limit: number,
    offset: number
  ): Promise<{ data: NotificationDto[]; total: number }> {
    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find({ recipientId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .lean(),
      this.notificationModel.countDocuments({ recipientId })
    ]);

    return {
      data: notifications.map((n) => new NotificationDto(n)),
      total
    };
  }
}
