import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { SPECIAL_REQUEST_FEEDBACK_MODEL_PROVIDER } from '../providers';
import { SpecialRequestFeedbackModel } from '../models';
import { SpecialRequestFeedbackDto } from '../dtos';
import {
  SpecialRequestFeedbackCreatePayload,
  SpecialRequestFeedbackUpdatePayload
} from '../payloads';
import { FEEDBACK_CHANNEL, FEEDBACK_EVENT } from '../constants';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(SPECIAL_REQUEST_FEEDBACK_MODEL_PROVIDER)
    private readonly feedbackModel: Model<SpecialRequestFeedbackModel>,
    private readonly queueEventService: QueueEventService
  ) {}

  /**
   * Create feedback for a special request
   */
  public async createFeedback(
    requestId: string | Types.ObjectId,
    payload: SpecialRequestFeedbackCreatePayload,
    user: UserDto
  ): Promise<SpecialRequestFeedbackDto> {
    const feedback = await this.feedbackModel.create({
      requestId,
      userId: user._id,
      rating: payload.rating,
      comment: payload.comment,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const dto = new SpecialRequestFeedbackDto(feedback);

    // Publish event for feedback creation
    await this.queueEventService.publish(
      new QueueEvent({
        channel: FEEDBACK_CHANNEL,
        eventName: FEEDBACK_EVENT.CREATED,
        data: dto
      })
    );

    return dto;
  }

  /**
   * Update feedback for a special request
   */
  public async updateFeedback(
    feedbackId: string | Types.ObjectId,
    payload: SpecialRequestFeedbackUpdatePayload,
    user: UserDto
  ): Promise<SpecialRequestFeedbackDto> {
    const feedback = await this.feedbackModel.findById(feedbackId);
    if (!feedback) throw new NotFoundException('Feedback not found');

    if (feedback.fanID.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'You are not authorized to update this feedback'
      );
    }

    if (payload.rating) feedback.rating = payload.rating;
    if (payload.comment) feedback.comment = payload.comment;

    await feedback.save();

    const dto = new SpecialRequestFeedbackDto(feedback);

    // Publish event for feedback update
    await this.queueEventService.publish(
      new QueueEvent({
        channel: FEEDBACK_CHANNEL,
        eventName: FEEDBACK_EVENT.UPDATED,
        data: dto
      })
    );

    return dto;
  }

  /**
   * Get feedback for a specific special request
   */
  public async getFeedbackForRequest(
    requestId: string | Types.ObjectId
  ): Promise<SpecialRequestFeedbackDto[]> {
    const feedbacks = await this.feedbackModel
      .find({ requestId })
      .sort({ createdAt: -1 })
      .lean();

    return feedbacks.map((f) => new SpecialRequestFeedbackDto(f));
  }
}
