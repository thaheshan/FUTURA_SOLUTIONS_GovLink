import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import {
    SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER,
    SPECIAL_REQUEST_TYPE_MODEL_PROVIDER
} from '../providers';
import { SpecialRequestTypeDocument } from '../schema/special-request-type.schema';
import { SpecialRequestTypeDto } from '../dtos';
import { SpecialRequestTypeCategoryDocument } from '../schema/special-request-type-category.schema';

@Injectable()
export class SpecialRequestTypeService {
    constructor(
        @Inject(SPECIAL_REQUEST_TYPE_MODEL_PROVIDER)
        private readonly specialRequestTypeModel: Model<SpecialRequestTypeDocument>,
        @Inject(SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER)
        private readonly specialRequestTypeCategoryModel: Model<SpecialRequestTypeCategoryDocument>
    ) {}

    public async getRequestTypes(): Promise<SpecialRequestTypeDto[]> {
        const requests = await this.specialRequestTypeModel.find().lean();
        return requests.map((r) => new SpecialRequestTypeDto(r));
    }
}
