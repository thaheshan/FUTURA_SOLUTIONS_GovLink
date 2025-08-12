import {
  Inject,
  Injectable
} from '@nestjs/common';
import { Model } from 'mongoose';
import { SpecialRequestTypeCategoryDto } from '../dtos';
import { SpecialRequestTypeCategory } from '../schema/special-request-type-category.schema';
import { SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER } from '../providers';

@Injectable()
export class SpecialRequestTypeCategoryService {
  constructor(
    @Inject(SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER)
    private readonly specialRequestTypeCategoryModel: Model<SpecialRequestTypeCategory>
  ) {}

  public async getRequestTypeCategories(): Promise<SpecialRequestTypeCategoryDto[]> {
    const requests = await this.specialRequestTypeCategoryModel.find().lean();
    return requests.map((r) => new SpecialRequestTypeCategoryDto(r));
  }
}
