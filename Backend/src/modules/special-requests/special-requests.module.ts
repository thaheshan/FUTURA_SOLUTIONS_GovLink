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
  SpecialRequestSearchService,
  SpecialRequestReviewService,
  MockPayService,
  SpecialRequestTypeService,
  SpecialRequestPerfomerPublishService,
  SpecialRequestTypeCategoryService
} from './services';
import {
  SpecialRequestCompletionListener,
  SpecialRequestListener,
  SpecialRequestPaymentListener
} from './listeners';
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
    SpecialRequestSearchService,
    SpecialRequestReviewService,
    SpecialRequestTypeService,
    SpecialRequestTypeCategoryService,
    MockPayService,
    SpecialRequestCompletionListener,
    SpecialRequestListener,
    SpecialRequestPaymentListener,
    SpecialRequestPerfomerPublishService
  ],
  controllers: [SpecialRequestController],
  exports: [
    ...specialRequestProviders,
    SpecialRequestService,
    SpecialRequestSearchService,
    SpecialRequestReviewService,
    MockPayService,
    SpecialRequestCompletionListener,
    SpecialRequestListener,
    SpecialRequestPaymentListener
  ]
})
export class SpecialRequestsModule {}
