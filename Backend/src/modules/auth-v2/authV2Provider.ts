import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import { AuthV2, AuthV2Schema } from './schema/auth-v2.shema';
import {
    VerificationCode,
    VerificationCodeSchema
} from './schema/verification-code.schema';

export const AUTH_V2_MODEL = 'AUTH_V2_MODEL';
export const VERIFICATION_CODE_MODEL = 'VERIFICATION_CODE_MODEL';

export const authV2Providers = [
    {
        provide: AUTH_V2_MODEL,
        useFactory: (connection: Connection) =>
            connection.model(AuthV2.name, AuthV2Schema),
        inject: [MONGO_DB_PROVIDER]
    },
    {
        provide: VERIFICATION_CODE_MODEL,
        useFactory: (connection: Connection) =>
            connection.model<VerificationCode>(
                VerificationCode.name,
                VerificationCodeSchema
            ),
        inject: [MONGO_DB_PROVIDER]
    }
];
