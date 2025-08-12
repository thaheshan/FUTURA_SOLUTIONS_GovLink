import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserV2Service } from 'src/modules/user-v2/user-v2.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserV2Service
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const token = request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException('Access token not found');
        }

        try {
            const decoded: any = jwt.verify(
                token,
                this.configService.get<string>('JWT_SECRET')
            );

            const user = await this.userService.findById(decoded.sub);

            if (!user || !user.isActive) {
                throw new UnauthorizedException('Invalid or inactive user');
            }

            (request as any).user = user;

            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
