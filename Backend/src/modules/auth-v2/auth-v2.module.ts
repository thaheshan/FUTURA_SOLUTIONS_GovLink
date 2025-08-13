import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongoDBModule } from 'src/kernel';
import { AuthV2Service } from './auth-v2.service';
import { AuthV2Controller } from './auth-v2.controller';
import { UserV2Module } from '../user-v2/user-v2.module';
import { authV2Providers } from './authV2Provider';
import { MailerModule } from '../mailer/mailer.module';

@Module({
    imports: [
        MongoDBModule,
        UserV2Module,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '7d' }
        }),
        forwardRef(() => MailerModule)
    ],
    controllers: [AuthV2Controller],
    providers: [...authV2Providers, AuthV2Service],
    exports: [AuthV2Module]
})
export class AuthV2Module {}
