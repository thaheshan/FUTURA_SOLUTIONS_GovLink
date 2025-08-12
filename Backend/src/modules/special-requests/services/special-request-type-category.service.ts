import {
  Inject,
  Injectable
} from '@nestjs/common';
import { Model } from 'mongoose';
import { SpecialRequestTypeCategoryDto } from '../dtos';
import { SpecialRequestTypeCategoryModel } from '../models/special-request-type-category.model';
import { SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER } from '../providers';

@Injectable()
export class SpecialRequestTypeCategoryService {
  constructor(
    @Inject(SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER)
    private readonly specialRequestTypeCategoryModel: Model<SpecialRequestTypeCategoryModel>
  ) {}

  public async getRequestTypeCategories(): Promise<SpecialRequestTypeCategoryDto[]> {
    const requests = await this.specialRequestTypeCategoryModel.find().lean();
    return requests.map((r) => new SpecialRequestTypeCategoryDto(r));
  }
}
