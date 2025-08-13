import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, QueueModule, AgendaModule } from 'src/kernel';
import { AuthModule } from '../auth/auth.module';
import { assetsProviders } from './providers';
import { FileModule } from '../file/file.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { ReactionModule } from '../reaction/reaction.module';
import { VideoService } from './services/video.service';
import { AdminPerformerVideosController } from './controllers/admin-video.controller';
import { PerformerModule } from '../performer/performer.module';
import { MailerModule } from '../mailer/mailer.module';
import { TokenTransactionModule } from '../token-transaction/token-transaction.module';
import { VideoSearchService } from './services/video-search.service';
import { GalleryService } from './services/gallery.service';
import { AdminPerformerGalleryController } from './controllers/admin-gallery.controller';
import { PhotoService } from './services/photo.service';
import { AdminPerformerPhotoController } from './controllers/admin-photo.controller';
import { PhotoSearchService } from './services/photo-search.service';
import { ProductSearchService } from './services/product-search.service';
import { ProductService } from './services/product.service';
import { AdminPerformerProductsController } from './controllers/admin-product.controller';
import { PerformerVideosController } from './controllers/performer-video.controller';
import { UserVideosController } from './controllers/user-video.controller';
import { PerformerGalleryController } from './controllers/performer-gallery.controller';
import { PerformerPhotoController } from './controllers/performer-photo.controller';
import { PerformerProductController } from './controllers/performer-product.controller';
import { UserPhotosController } from './controllers/user-photo.controller';
import { UserProductsController } from './controllers/user-product.controller';
import { UserGalleryController } from './controllers/user-gallery.controller';
import { ReactionAssetsListener, CommentAssetsListener, StockProductListener } from './listeners';
import { UserModule } from '../user/user.module';
import { CommentModule } from '../comment/comment.module';
import { ScheduleVideosAgendaJob } from './jobs';

@Module({
  imports: [
    MongoDBModule,
    QueueModule.forRoot(),
    AgendaModule.register(),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => MailerModule),
    forwardRef(() => FileModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => ReactionModule),
    forwardRef(() => TokenTransactionModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => CommentModule)
  ],
  providers: [
    ...assetsProviders,
    VideoService,
    VideoSearchService,
    GalleryService,
    PhotoService,
    PhotoSearchService,
    ProductService,
    ProductSearchService,
    ReactionAssetsListener,
    CommentAssetsListener,
    StockProductListener,
    ScheduleVideosAgendaJob
  ],
  controllers: [
    AdminPerformerVideosController,
    AdminPerformerGalleryController,
    AdminPerformerPhotoController,
    AdminPerformerProductsController,
    PerformerVideosController,
    PerformerGalleryController,
    PerformerPhotoController,
    PerformerProductController,
    UserVideosController,
    UserPhotosController,
    UserProductsController,
    UserGalleryController
  ],
  exports: [
    ...assetsProviders,
    VideoService,
    VideoSearchService,
    GalleryService,
    PhotoService,
    PhotoSearchService,
    ProductService,
    ProductSearchService,
    ReactionAssetsListener,
    CommentAssetsListener,
    StockProductListener
  ]
})
export class PerformerAssetsModule {}
