import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { SpecialRequestReviewModel } from '../models';
import { SpecialRequestReviewSchema } from '../schemas/special-request-review.schema';
import { SpecialRequestService } from './special-request.service';
import { ReviewCreatePayload } from '../payloads';
import { SpecialRequestReviewDto } from '../dtos';

@Injectable()
export class SpecialRequestReviewService {
  private readonly reviewModel: Model<SpecialRequestReviewModel>;

  constructor(private readonly specialRequestService: SpecialRequestService) {
    this.reviewModel = SpecialRequestReviewSchema as unknown as Model<SpecialRequestReviewModel>;
  }

  /**
   * Submit a new review
   */
  public async submitReview(
    requestId: string | Types.ObjectId,
    payload: ReviewCreatePayload
  ): Promise<any> {
    const request = await this.specialRequestService.findById(requestId);
    if (!request || request.status !== 'completed') {
      throw new NotFoundException('Special request not found or not completed');
    }

    const review = new this.reviewModel({
      requestID: request._id,
      reviewerID: request.fanID,
      rating: payload.rating,
      comment: payload.comment,
      reviewDate: new Date(),
      reviewStatus: 'completed'
    });

    await review.save();
    return { success: true, message: 'Review submitted successfully' };
  }

  /**
   * Update an existing review
   */
  public async updateReview(
    reviewId: string | Types.ObjectId,
    payload: ReviewCreatePayload
  ): Promise<any> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.reviewStatus === 'completed') {
      throw new BadRequestException('Cannot update a completed review');
    }

    review.rating = payload.rating;
    review.comment = payload.comment;
    review.updatedAt = new Date();

    await review.save();
    return { success: true, message: 'Review updated successfully' };
  }

  /**
   * Find a review by request ID
   */
  public async findReviewByRequestId(
    requestId: string | Types.ObjectId
  ): Promise<SpecialRequestReviewDto> {
    const review = await this.reviewModel
      .findOne({ requestID: requestId })
      .lean();
    if (!review) {
      throw new NotFoundException('Review not found for this request ID');
    }
    return new SpecialRequestReviewDto(review);
  }
}
