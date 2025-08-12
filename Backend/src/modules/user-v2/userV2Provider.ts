import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import { UserV2, UserSchema } from './schema/user-v2.schema';

export const USER_V2_MODEL = 'USER_V2_MODEL';

export const userV2Providers = [
  {
    provide: USER_V2_MODEL,
    useFactory: (connection: Connection) => connection.model(UserV2.name, UserSchema),
    inject: [MONGO_DB_PROVIDER]
  }
];
