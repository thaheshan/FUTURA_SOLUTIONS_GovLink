import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import {
  SpecialRequestSchema,
  SpecialRequestTypeSchema,
  SpecialRequestChatSchema,
  NotificationSchema,
  SpecialRequestFeedbackSchema,
  SpecialRequestReviewSchema,
  SpecialRequestTypeCategorySchema,
  SpecialRequestPerformerPageSchema
} from '../schemas';

export const SPECIAL_REQUEST_MODEL_PROVIDER = 'SPECIAL_REQUEST_MODEL_PROVIDER';
export const SPECIAL_REQUEST_TYPE_MODEL_PROVIDER = 'SPECIAL_REQUEST_TYPE_MODEL_PROVIDER';
export const SPECIAL_REQUEST_CHAT_MODEL_PROVIDER = 'SPECIAL_REQUEST_CHAT_MODEL_PROVIDER';
export const NOTIFICATION_MODEL_PROVIDER = 'NOTIFICATION_MODEL_PROVIDER';
export const SPECIAL_REQUEST_FEEDBACK_MODEL_PROVIDER = 'SPECIAL_REQUEST_FEEDBACK_MODEL_PROVIDER';
export const SPECIAL_REQUEST_REVIEW_MODEL_PROVIDER = 'SPECIAL_REQUEST_REVIEW_MODEL_PROVIDER';
export const SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER = 'SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER';
export const SPECIAL_REQUEST_PERFORMER_PAGE_PROVIDER="SPECIAL_REQUEST_PERFORMER_PAGE_PROVIDER";

export const specialRequestProviders = [
  {
    provide: SPECIAL_REQUEST_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('SpecialRequest', SpecialRequestSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: SPECIAL_REQUEST_TYPE_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('SpecialRequestType', SpecialRequestTypeSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: SPECIAL_REQUEST_CHAT_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('SpecialRequestChat', SpecialRequestChatSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: NOTIFICATION_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('Notification', NotificationSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: SPECIAL_REQUEST_FEEDBACK_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('SpecialRequestFeedback', SpecialRequestFeedbackSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: SPECIAL_REQUEST_REVIEW_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('SpecialRequestReview', SpecialRequestReviewSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('SpecialRequestTypeCategory', SpecialRequestTypeCategorySchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: SPECIAL_REQUEST_PERFORMER_PAGE_PROVIDER,
    useFactory: (connection: Connection) => connection.model('PerformerSpecialRequestPage', SpecialRequestPerformerPageSchema),
    inject: [MONGO_DB_PROVIDER]
  }
];
