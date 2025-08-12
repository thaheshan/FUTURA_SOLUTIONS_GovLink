import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import {
  CreatorSpecialRequestPage,
  SpecialRequestPerformerPageSchema 
} from '../schema/special-request-published-performer.schema';
import { 
  SpecialRequestType,
  SpecialRequestTypeSchema
} from '../schema/special-request-type.schema';
import { 
  SpecialRequestTypeCategory,
  SpecialRequestTypeCategorySchema
} from '../schema/special-request-type-category.schema';
import { 
  SpecialRequest,
  SpecialRequestSchema
} from '../schema/special-request.schema';

export const SPECIAL_REQUEST_MODEL_PROVIDER = 'SPECIAL_REQUEST_MODEL_PROVIDER';
export const SPECIAL_REQUEST_TYPE_MODEL_PROVIDER = 'SPECIAL_REQUEST_TYPE_MODEL_PROVIDER';
export const SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER = 'SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER';
export const SPECIAL_REQUEST_PERFORMER_PAGE_PROVIDER="SPECIAL_REQUEST_PERFORMER_PAGE_PROVIDER";

export const specialRequestProviders = [
  {
    provide: SPECIAL_REQUEST_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model(SpecialRequest.name, SpecialRequestSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: SPECIAL_REQUEST_TYPE_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model(SpecialRequestType.name, SpecialRequestTypeSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model(SpecialRequestTypeCategory.name, SpecialRequestTypeCategorySchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: SPECIAL_REQUEST_PERFORMER_PAGE_PROVIDER,
    useFactory: (connection: Connection) => connection.model(CreatorSpecialRequestPage.name, SpecialRequestPerformerPageSchema),
    inject: [MONGO_DB_PROVIDER]
  }
];
