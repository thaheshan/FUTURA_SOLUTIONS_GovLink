import { Types } from 'mongoose';
import { pick } from 'lodash';

export class SpecialRequestFeedbackDto {
  _id: Types.ObjectId;

  fanID: Types.ObjectId;

  creatorID: Types.ObjectId;

  requestID: Types.ObjectId;

  rating: number;

  comment: string;

  constructor(init: Partial<SpecialRequestFeedbackDto>) {
    Object.assign(
      this,
      pick(init, [
        '_id',
        'fanID',
        'creatorID',
        'requestID',
        'rating',
        'comment'
      ])
    );
  }

  toPublic() {
    return {
      _id: this._id,
      rating: this.rating,
      comment: this.comment
    };
  }
}
