import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, QueueModule } from 'src/kernel';
import { FeedModule } from 'src/modules/feed/feed.module';
import { ReactionController } from './controllers/reaction.controller';
import { ReactionService } from './services/reaction.service';
import { reactionProviders } from './providers/reaction.provider';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PerformerModule } from '../performer/performer.module';
import { PerformerAssetsModule } from '../performer-assets/performer-assets.module';
import { DeletePerformerReactionListener, DeleteAssetsListener } from './listeners';
import { FileModule } from '../file/file.module';
import { FollowModule } from '../follow/follow.module';

@Module({
  imports: [
    QueueModule.forRoot(),
    MongoDBModule,
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => PerformerAssetsModule),
    forwardRef(() => FeedModule),
    forwardRef(() => FileModule),
    forwardRef(() => FollowModule)
  ],
  providers: [...reactionProviders, ReactionService, DeletePerformerReactionListener, DeleteAssetsListener],
  controllers: [ReactionController],
  exports: [ReactionService]
})
export class ReactionModule {}
