import {
  Module, forwardRef
} from '@nestjs/common';
import { MongoDBModule, QueueModule } from 'src/kernel';
import { AuthModule } from '../auth/auth.module';
import { payoutRequestProviders } from './providers/payout-request.provider';
import { PayoutRequestService } from './services';
import {
  PayoutRequestController, AdminPayoutRequestController
} from './controllers';
import { PerformerModule } from '../performer/performer.module';
import { MailerModule } from '../mailer/mailer.module';
import { SettingModule } from '../settings/setting.module';
import { EarningModule } from '../earning/earning.module';
import { UpdatePayoutRequestListener } from './listeners';

@Module({
  imports: [
    MongoDBModule,
    QueueModule.forRoot(),
    // inject user module because we request guard from auth, need to check and fix dependencies if not needed later
    forwardRef(() => AuthModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => MailerModule),
    forwardRef(() => SettingModule),
    forwardRef(() => EarningModule)
  ],
  providers: [
    ...payoutRequestProviders,
    PayoutRequestService,
    UpdatePayoutRequestListener
  ],
  controllers: [
    PayoutRequestController,
    AdminPayoutRequestController
  ],
  exports: [PayoutRequestService]
})
export class PayoutRequestModule {}
