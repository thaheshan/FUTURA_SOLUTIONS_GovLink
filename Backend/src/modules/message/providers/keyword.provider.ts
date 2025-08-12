import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import { MessageDetectionKeywordSchema } from '../schemas';

export const MESSAGE_DETECTION_KEYWORD_MODEL_PROVIDER = 'MESSAGE_DETECTION_KEYWORD_MODEL_PROVIDER';

export const messageDetectionKeywordProviders = [
  {
    provide: MESSAGE_DETECTION_KEYWORD_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('MessageDetectionKeyword', MessageDetectionKeywordSchema),
    inject: [MONGO_DB_PROVIDER]
  }
];
