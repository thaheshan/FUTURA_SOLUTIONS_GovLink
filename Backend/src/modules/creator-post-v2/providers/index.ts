import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import {
    CreatorPostV2Schema,
    CreatorPostV2
} from '../schema/creator-post-v2.schema';

export const CREATOR_POST_MODEL = 'CREATOR_POST_MODEL';

export const CreatorPostV2Providers = [
    {
        provide: CREATOR_POST_MODEL,
        useFactory: (connection: Connection) =>
            connection.model(CreatorPostV2.name, CreatorPostV2Schema),
        inject: [MONGO_DB_PROVIDER]
    }
];
