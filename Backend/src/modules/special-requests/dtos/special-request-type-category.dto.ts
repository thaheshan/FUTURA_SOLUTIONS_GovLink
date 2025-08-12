import { Types } from 'mongoose';
import { pick } from 'lodash';

export class SpecialRequestTypeCategoryDto {
  _id: Types.ObjectId;

  name: string;

  description: string;

  basePrice: number;

  estimatedDeliveryTime: number;

  constructor(init: Partial<SpecialRequestTypeCategoryDto>) {
    Object.assign(
      this,
      pick(init, [
        '_id',
        'name',
        'code',
        'description'
      ])
    );
  }
}
