import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { PAYMENT_STATUS, SPECIAL_REQUEST_PAYMENT_CHANNEL } from '../constants';
import { SpecialRequestModel } from '../models';
import { SpecialRequestDto } from '../dtos';
import { SPECIAL_REQUEST_MODEL_PROVIDER } from '../providers';

@Injectable()
export class MockPayService {
  constructor(
    @Inject(SPECIAL_REQUEST_MODEL_PROVIDER)
    private readonly specialRequestModel: Model<SpecialRequestModel>,
    private readonly queueEventService: QueueEventService
  ) {}

  /**
   * Simulates a payment process
   * @param id - ID of the special request
   * @returns Payment status
   */
  public async simulatePayment(id: string | Types.ObjectId): Promise<any> {
    const request = await this.specialRequestModel.findById(id);
    if (!request) {
      throw new NotFoundException('Special request not found');
    }

    if (request.paymentStatus !== PAYMENT_STATUS.UNPAID) {
      throw new BadRequestException('Payment has already been processed');
    }

    // Simulate payment delay
    console.log(`Starting mock payment for request: ${id}`);
    setTimeout(async () => {
      console.log(`Mock payment completed for request: ${id}`);
      request.paymentStatus = PAYMENT_STATUS.PAID;
      request.status = 'PAID'; // Optional, update the status if required
      await request.save();

      const dto = new SpecialRequestDto(request);

      // Publish payment success event
      await this.queueEventService.publish(
        new QueueEvent({
          channel: SPECIAL_REQUEST_PAYMENT_CHANNEL,
          eventName: EVENT.UPDATED,
          data: dto
        })
      );
    }, 3000); // Mock delay of 3 seconds

    return { message: 'Payment in process', requestId: id };
  }
}
