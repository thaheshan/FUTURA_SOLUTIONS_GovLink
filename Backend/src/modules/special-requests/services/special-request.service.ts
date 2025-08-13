import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { QueueEventService, QueueEvent, PageableData } from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { UserDto } from 'src/modules/user/dtos';
import { SPECIAL_REQUEST_STATUS, PAYMENT_STATUS, REFUND_STATUS } from '../constants';
import { SpecialRequestDto } from '../dtos';
import { SpecialRequestModel } from '../models';
import { SPECIAL_REQUEST_MODEL_PROVIDER } from '../providers';
import {
  SpecialRequestCreatePayload,
  SpecialRequestUpdatePayload,
  SpecialRequestRefundPayload
} from '../payloads';

export const SPECIAL_REQUEST_CHANNEL = 'SPECIAL_REQUEST_CHANNEL';

@Injectable()
export class SpecialRequestService {
  constructor(
    @Inject(SPECIAL_REQUEST_MODEL_PROVIDER)
    private readonly specialRequestModel: Model<SpecialRequestModel>,
    private readonly queueEventService: QueueEventService
  ) {}

  /**
   * Create a new special request
   */
  public async createRequest(
    payload: SpecialRequestCreatePayload,
    fanId: Types.ObjectId
  ): Promise<SpecialRequestDto> {
    if (
      !payload.requestTypeID ||
      !payload.creatorID ||
      !payload.totalPrice ||
      !payload.messageToPerformer
    ) {
      throw new BadRequestException('Missing required fields');
    }

    if (payload.messageToPerformer.length < 10 || payload.messageToPerformer.length > 500) {
      throw new BadRequestException(
        'Description must be between 10 and 500 characters'
      );
    }

    // eslint-disable-next-line new-cap
    const request = new this.specialRequestModel({
      ...payload,
      fanID: fanId,
      creationDate: new Date()
    });

    await request.save();

    const dto = new SpecialRequestDto(request);
    await this.queueEventService.publish(
      new QueueEvent({
        channel: SPECIAL_REQUEST_CHANNEL,
        eventName: EVENT.CREATED,
        data: dto
      })
    );
    return dto;
  }

  /**
   * Update request status
   */
  public async updateRequest(
    id: string | Types.ObjectId,
    payload: SpecialRequestUpdatePayload
  ): Promise<SpecialRequestDto> {
    const request = await this.specialRequestModel.findById(id);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (payload.description) {
      request.messageToPerformer = payload.description;
    }

    if (payload.status) {
      request.status = payload.status;
    }

    await request.save();

    const dto = new SpecialRequestDto(request);
    await this.queueEventService.publish(
      new QueueEvent({
        channel: SPECIAL_REQUEST_CHANNEL,
        eventName: 'UPDATED',
        data: dto
      })
    );
    return dto;
  }

  /**
   * Update the status of a special request
   * @param id - ID of the special request
   * @param performer - Current user (performer)
   * @param status - New status ('ACCEPTED' or 'DECLINED')
   * @returns Updated special request
   */
  public async updateRequestStatus(
    id: string,
    performer: any,
    status: (typeof SPECIAL_REQUEST_STATUS)[keyof typeof SPECIAL_REQUEST_STATUS]
  ): Promise<SpecialRequestDto> {
    const request = await this.specialRequestModel.findById(id);
    if (!request) {
      throw new NotFoundException('Special request not found');
    }

    if (String(request.creatorID) !== String(performer._id)) {
      throw new ForbiddenException(
        'You are not authorized to update this request'
      );
    }

    request.status = SPECIAL_REQUEST_STATUS[status];
    await request.save();

    const dto = new SpecialRequestDto(request);

    await this.queueEventService.publish(
      new QueueEvent({
        channel: SPECIAL_REQUEST_CHANNEL,
        eventName: EVENT.UPDATED,
        data: dto
      })
    );

    return dto;
  }

  /**
   * Delete a special request
   */
  public async deleteRequest(
    id: string | Types.ObjectId,
    user: UserDto
  ): Promise<boolean> {
    const request = await this.specialRequestModel.findById(id);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (
      user.roles.includes('admin') ||
      `${user._id}` === `${request.creatorID}` ||
      `${user._id}` === `${request.fanID}`
    ) {
      await this.specialRequestModel.deleteOne({ _id: id });

      await this.queueEventService.publish(
        new QueueEvent({
          channel: SPECIAL_REQUEST_CHANNEL,
          eventName: EVENT.DELETED,
          data: new SpecialRequestDto(request)
        })
      );

      return true;
    }

    throw new ForbiddenException(
      'You are not authorized to delete this request'
    );
  }

  /**
   * Process refund
   */
  public async processRefund(
    id: string | Types.ObjectId,
    payload: SpecialRequestRefundPayload
  ): Promise<SpecialRequestDto> {
    const request = await this.specialRequestModel.findById(id);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.paymentStatus !== PAYMENT_STATUS.PAID) {
      throw new BadRequestException('Request has not been paid yet');
    }

    request.refundRequested = true;
    request.refundReason = payload.reason;
    request.status = SPECIAL_REQUEST_STATUS.REFUND_REQUESTED;
    await request.save();

    const dto = new SpecialRequestDto(request);
    await this.queueEventService.publish(
      new QueueEvent({
        channel: SPECIAL_REQUEST_CHANNEL,
        eventName: 'UPDATED',
        data: dto
      })
    );
    return dto;
  }

  /**
   * Get a single request by ID
   */
  public async findById(
    id: string | Types.ObjectId
  ): Promise<SpecialRequestDto> {
    const request = await this.specialRequestModel.findById(id);
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    return new SpecialRequestDto(request);
  }

  /**
   * Get all requests for a fan or creator
   */
  public async findByUser(
    userId: Types.ObjectId,
    role: 'fan' | 'creator',
    filters: any = {}
  ): Promise<SpecialRequestDto[]> {
    const query: any = role === 'fan' ? { fanID: userId } : { creatorID: userId };
    if (filters.status) query.status = filters.status;

    const requests = await this.specialRequestModel.find(query).lean();
    return requests.map((r) => new SpecialRequestDto(r));
  }

  /**
   * Check authorization for a special request
   */
  public async checkAuth(req: any, user: UserDto): Promise<boolean> {
    const { query } = req;
    if (!query.requestId) {
      throw new ForbiddenException('Request ID is required');
    }

    const request = await this.specialRequestModel.findById(query.requestId);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (user.roles && user.roles.includes('admin')) {
      return true;
    }

    if (user._id.toString() === request.fanID.toString()) {
      return true;
    }

    if (user._id.toString() === request.creatorID.toString()) {
      return true;
    }

    throw new ForbiddenException(
      'You are not authorized to access this request'
    );
  }

  public async markAsCompleted(
    id: string | Types.ObjectId,
    creator: UserDto
  ): Promise<SpecialRequestDto> {
    const request = await this.specialRequestModel.findById(id);
    if (!request) {
      throw new NotFoundException('Special request not found');
    }

    // Ensure the current user is the creator of the request
    if (`${request.creatorID}` !== `${creator._id}`) {
      throw new ForbiddenException(
        'You are not authorized to complete this request'
      );
    }

    if (request.status !== SPECIAL_REQUEST_STATUS.ACCEPTED) {
      throw new ForbiddenException(
        'Request must be accepted before completion'
      );
    }

    request.status = SPECIAL_REQUEST_STATUS.COMPLETED;
    await request.save();

    const dto = new SpecialRequestDto(request);

    // Publish event for listeners
    await this.queueEventService.publish(
      new QueueEvent({
        channel: SPECIAL_REQUEST_CHANNEL,
        eventName: EVENT.UPDATED,
        data: dto
      })
    );

    return dto;
  }

  /**
   * Initiate refund request
   */
  public async requestRefund(
    id: string | Types.ObjectId,
    payload: SpecialRequestRefundPayload,
    requester: UserDto
  ): Promise<SpecialRequestDto> {
    const request = await this.specialRequestModel.findById(id);
    if (!request) {
      throw new NotFoundException('Special request not found');
    }

    if (`${request.fanID}` !== `${requester._id}`) {
      throw new ForbiddenException(
        'You are not authorized to request a refund'
      );
    }

    if (request.status !== SPECIAL_REQUEST_STATUS.COMPLETED) {
      throw new BadRequestException(
        'Refund can only be requested for completed requests'
      );
    }

    if (request.refundStatus === REFUND_STATUS.REQUESTED) {
      throw new BadRequestException('Refund has already been requested');
    }

    request.refundStatus = REFUND_STATUS.REQUESTED;
    request.refundReason = payload.reason;
    await request.save();

    return new SpecialRequestDto(request);
  }

  /**
   * View refund requests
   */
  public async getRefundRequests(
    filters: any
  ): Promise<PageableData<SpecialRequestDto>> {
    const query = { refundStatus: REFUND_STATUS.REQUESTED } as any;
    if (filters.status) {
      query.status = filters.status;
    }

    const requests = await this.specialRequestModel.find(query).lean();
    const total = await this.specialRequestModel.countDocuments(query);

    return {
      total,
      data: requests.map((req) => new SpecialRequestDto(req))
    };
  }

  /**
   * Approve or deny refund
   */
  public async processRefundRequest(
    id: string | Types.ObjectId,
    action: 'approve' | 'deny'
    // admin: UserDto
  ): Promise<SpecialRequestDto> {
    const request = await this.specialRequestModel.findById(id);
    if (!request) {
      throw new NotFoundException('Special request not found');
    }

    if (request.refundStatus !== REFUND_STATUS.REQUESTED) {
      throw new BadRequestException(
        'Refund has not been requested for this request'
      );
    }

    request.refundStatus = action === 'approve' ? REFUND_STATUS.APPROVED : REFUND_STATUS.DENIED;

    if (action === 'approve') {
      request.status = SPECIAL_REQUEST_STATUS.REFUNDED;
    }

    await request.save();

    return new SpecialRequestDto(request);
  }
}
