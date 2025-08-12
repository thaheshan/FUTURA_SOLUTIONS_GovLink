import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SettingModule } from './modules/settings/setting.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { PostModule } from './modules/post/post.module';
import { FileModule } from './modules/file/file.module';
import { PerformerModule } from './modules/performer/performer.module';
import { UtilsModule } from './modules/utils/utils.module';
import { PerformerAssetsModule } from './modules/performer-assets/performer-assets.module';
import { CommentModule } from './modules/comment/comment.module';
import { ReactionModule } from './modules/reaction/reaction.module';
import { PaymentModule } from './modules/payment/payment.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { BannerModule } from './modules/banner/banner.module';
import { MessageModule } from './modules/message/message.module';
import { SocketModule } from './modules/socket/socket.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { FeedModule } from './modules/feed/feed.module';
import { ContactModule } from './modules/contact/contact.module';
import { StreamModule } from './modules/stream/stream.module';
import { StatisticsModule } from './modules/statistics/statistic.module';
import { PayoutRequestModule } from './modules/payout-request/payout.module';
import { OrderModule } from './modules/order/order.module';
import { BlockModule } from './modules/block/block.module';
import { ReportModule } from './modules/report/report.module';
import { StorageModule } from './modules/storage/storage.module';
import { FollowModule } from './modules/follow/follow.module';
// import { SpecialRequestsModule } from './modules/special-requests/special-requests.module';
import { AuthV2Module } from './modules/auth-v2/auth-v2.module';
import configuration from './config';
import { UserV2Module } from './modules/user-v2/user-v2.module';
import { PageModule } from './modules/page/page.module';
import { MembershipPlanModule } from './modules/membership-plan/membership-plan.module';
import { SpecialRequestsModuleV2 } from './modules/special-request-v2/special-requests-v2.module';
import { CreatorPostV2Module } from './modules/creator-post-v2/creator-post-v2.module';

// hello text
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration]
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public')
        }),
        StorageModule.forRoot(),
        AuthModule,
        UserModule,
        PostModule,
        SettingModule,
        MailerModule,
        FileModule,
        UtilsModule,
        PerformerModule,
        PerformerAssetsModule,
        CommentModule,
        ReactionModule,
        PaymentModule,
        SubscriptionModule,
        BannerModule,
        SocketModule,
        MessageModule,
        CouponModule,
        FeedModule,
        StreamModule,
        ContactModule,
        StatisticsModule,
        PayoutRequestModule,
        OrderModule,
        BlockModule,
        ReportModule,
        FollowModule,
        // SpecialRequestsModule,
        AuthV2Module,
        UserV2Module,
        PageModule,
        MembershipPlanModule,
        SpecialRequestsModuleV2,
        CreatorPostV2Module
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}

export default AppModule;
