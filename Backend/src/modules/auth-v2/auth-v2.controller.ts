import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { UserRole } from 'src/constant/userRole';
import { PageService } from 'src/modules/page/page.service';
import { PageDocument } from 'src/modules/page/entities/page.entity';
import { AuthV2Service } from './auth-v2.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller({
    path: 'auth',
    version: '1'
})
export class AuthV2Controller {
    constructor(
        private authService: AuthV2Service,
        private readonly pageService: PageService
    ) {}

    @Post('register')
    async register(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.register(dto);

        // Set cookie with token
        res.cookie('access_token', result.token, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        return result;
    }

    @Post('assign-role')
    assignRole(@Body() dto: AssignRoleDto) {
        return this.authService.assignRole(dto);
    }

    @Post('verify-code')
    verify(@Body() dto: VerifyCodeDto) {
        return this.authService.verifyCode(dto);
    }

    @Get('verify-code')
    @UseGuards(AuthGuard)
    getNewToken(@Req() req) {
        const rawUser = req.user.toObject ? req.user.toObject() : req.user;
        return this.authService.requestNewVerificationCode(rawUser);
    }

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.login(dto);

        // Set cookie with token
        res.cookie('access_token', result.token, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        return { user: result.user };
    }

    @Get('me')
    @UseGuards(AuthGuard)
    getMe(@Req() req) {
        const rawUser = req.user.toObject ? req.user.toObject() : req.user;

        if (rawUser.authUser) {
            delete rawUser.authUser.password;
        }

        const baseResponse = { ...rawUser };

        if (!rawUser.isVerified) {
            baseResponse.message =
                'Please verify your email before logging in.';
        }

        if (!rawUser.pageName || !rawUser.pageUrl || !rawUser.role) {
            baseResponse.needsProfileCompletion = true;
            baseResponse.message =
                'Please complete your profile by creating your page and selecting a role.';
            baseResponse.isCreator = rawUser.role === UserRole.Creator;
        }

        return baseResponse;
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token', {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return { message: 'Logged out' };
    }

    @Get('me/page')
    @UseGuards(AuthGuard)
    async getMyPage(@Req() req): Promise<PageDocument> {
        const rawUser = req.user.toObject ? req.user.toObject() : req.user;
        return this.pageService.findForUser(rawUser._id.toString());
    }
}
