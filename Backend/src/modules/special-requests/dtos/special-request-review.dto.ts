import { Types } from 'mongoose';
import { pick } from 'lodash';

export class SpecialRequestReviewDto {
  _id: Types.ObjectId;

  requestID: Types.ObjectId;

  reviewerID: Types.ObjectId;

  reviewDate: Date;

  reviewStatus: string;

  refundStatus: string;

  reviewNotes: string;

  rating: number;

  comment: string;

  constructor(init: Partial<SpecialRequestReviewDto>) {
    Object.assign(
      this,
      pick(init, [
        '_id',
        'requestID',
        'reviewerID',
        'reviewDate',
        'reviewStatus',
        'refundStatus',
        'reviewNotes',
        'rating',
        'comment'
      ])
    );
  }

  toPublic() {
    return {
      _id: this._id,
      reviewStatus: this.reviewStatus,
      refundStatus: this.refundStatus,
      rating: this.rating,
      comment: this.comment
    };
  }
}
