import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, QueueModule } from 'src/kernel';
import { AuthV2Module } from '../auth-v2/auth-v2.module';
import { PerformerModule } from '../performer/performer.module';
import { UserV2Module } from '../user-v2/user-v2.module';
import { MailerModule } from '../mailer/mailer.module';
import { FileModule } from '../file/file.module';
import { specialRequestProviders } from './providers';
import {
  SpecialRequestService,
  SpecialRequestTypeService,
  SpecialRequestPerfomerPublishService,
  SpecialRequestTypeCategoryService
} from './services';
import { SpecialRequestController } from './controllers/special-request.controller';

@Module({
  imports: [
    MongoDBModule,
    QueueModule.forRoot(),
    forwardRef(() => AuthV2Module),
    forwardRef(() => UserV2Module),
    forwardRef(() => PerformerModule),
    forwardRef(() => MailerModule),
    forwardRef(() => FileModule)
  ],
  providers: [
    ...specialRequestProviders,
    SpecialRequestService,
    SpecialRequestTypeService,
    SpecialRequestTypeCategoryService,
    SpecialRequestPerfomerPublishService
  ],
  controllers: [SpecialRequestController],
  exports: [
    ...specialRequestProviders,
    SpecialRequestService
  ]
})
export class SpecialRequestsModuleV2 {}
