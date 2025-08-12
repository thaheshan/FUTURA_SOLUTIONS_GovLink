import { Global, Module } from '@nestjs/common';
import { MongoDBModule } from 'src/kernel';
import { UserV2Controller } from './user-v2.controller';
import { UserV2Service } from './user-v2.service';
import { userV2Providers } from './userV2Provider';

@Module({
    imports: [MongoDBModule],
    controllers: [UserV2Controller],
    providers: [...userV2Providers, UserV2Service],
    exports: [...userV2Providers, UserV2Service]
})
@Global()
export class UserV2Module {}
