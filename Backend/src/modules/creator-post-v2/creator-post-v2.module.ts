import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, QueueModule } from 'src/kernel';
import { CreatorPostV2Controller } from './controllers/creator-post-v2.controller';
import { CreatorPostV2Service } from './services/creator-post-v2.service';
import { FeedFileService } from '../feed/services';
import { AuthV2Module } from '../auth-v2/auth-v2.module';
import { UserV2Module } from '../user-v2/user-v2.module';
import { MailerModule } from '../mailer/mailer.module';
import { FileModule } from '../file/file.module';
import { CreatorPostV2Providers } from './providers';

@Module({
  imports: [
    MongoDBModule,
    QueueModule.forRoot(),
    forwardRef(() => AuthV2Module),
    forwardRef(() => UserV2Module),
    forwardRef(() => MailerModule),
    forwardRef(() => FileModule)
  ],
  controllers: [CreatorPostV2Controller],
  providers: [
    ...CreatorPostV2Providers,
    CreatorPostV2Service,
    FeedFileService
  ]
})
export class CreatorPostV2Module { }
