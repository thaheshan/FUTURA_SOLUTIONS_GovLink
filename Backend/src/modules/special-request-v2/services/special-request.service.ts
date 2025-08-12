import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { SpecialRequestDto } from '../dtos';
import { SpecialRequest } from '../schema/special-request.schema';
import { SPECIAL_REQUEST_MODEL_PROVIDER } from '../providers';
import { SpecialRequestCreatePayload } from '../payloads';

export const SPECIAL_REQUEST_CHANNEL = 'SPECIAL_REQUEST_CHANNEL';

@Injectable()
export class SpecialRequestService {
    constructor(
        @Inject(SPECIAL_REQUEST_MODEL_PROVIDER)
        private readonly specialRequestModel: Model<SpecialRequest>,
        private readonly queueEventService: QueueEventService
    ) {}

    public async createRequest(
        payload: SpecialRequestCreatePayload,
        fan: Types.ObjectId
    ): Promise<SpecialRequestDto> {
        if (
            !payload.requestType ||
            !payload.creator ||
            !payload.totalPrice ||
            !payload.messageToPerformer
        ) {
            throw new BadRequestException('Missing required fields');
        }

        if (
            payload.messageToPerformer.length < 10 ||
            payload.messageToPerformer.length > 500
        ) {
            throw new BadRequestException(
                'Description must be between 10 and 500 characters'
            );
        }

        // eslint-disable-next-line new-cap
        const request = new this.specialRequestModel({
            ...payload,
            fan,
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
}
