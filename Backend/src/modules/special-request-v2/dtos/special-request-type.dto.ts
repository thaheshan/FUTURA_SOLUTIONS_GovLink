import { Types } from 'mongoose';
import { pick } from 'lodash';

export class SpecialRequestTypeDto {
    _id: Types.ObjectId;

    name: string;

    description: string;

    basePrice: number;

    estimatedDeliveryTime: number;

    categoryId: Types.ObjectId;

    constructor(init: Partial<SpecialRequestTypeDto>) {
        Object.assign(
            this,
            pick(init, [
                '_id',
                'name',
                'description',
                'basePrice',
                'estimatedDeliveryTime',
                'categoryId',
                'enabled',
                'highlights'
            ])
        );
    }
}
