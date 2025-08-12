import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { UserV2Service } from '../user-v2/user-v2.service';
import { AUTH_V2_MODEL, VERIFICATION_CODE_MODEL } from './authV2Provider';
import { AssignRoleDto } from './dto/assign-role.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { AuthV2 } from './schema/auth-v2.shema';
import { VerificationCode } from './schema/verification-code.schema';
import { MailerService } from '../mailer';
import { UserDocument } from '../user-v2/schema/user-v2.schema';

@Injectable()
export class AuthV2Service {
    logger = new Logger(AuthV2Service.name);

    constructor(
        private usersService: UserV2Service,
        private jwtService: JwtService,
        @Inject(AUTH_V2_MODEL) private authModel: Model<AuthV2>,
        @Inject(VERIFICATION_CODE_MODEL)
        private readonly verificationCodeModel: Model<VerificationCode>,
        private readonly mailService: MailerService
    ) {}

    generateToken(user: any) {
        const payload = {
            sub: user._id,
            email: user.authUser.email,
            username: user.authUser.username,
            role: user.role
        };

        return this.jwtService.sign(payload, {
            expiresIn: '7d'
        });
    }

    private async createUserWithRollback(authUser: any) {
        try {
            return await this.usersService.create({
                isVerified: false,
                isActive: true,
                authUser
            });
        } catch (err) {
            this.logger.error(
                '[Register] User creation failed. Rolling back authUser.',
                err
            );
            await this.authModel.findByIdAndDelete(authUser._id);
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async requestNewVerificationCode(user: UserDocument) {
        await this.verificationCodeModel
            .deleteMany({
                user: new Types.ObjectId(user.authUser._id.toString())
            })
            .exec();

        await await this.generateVerificationCodeAndSend(
            user.authUser,
            user.authUser.email
        );
    }

    private async createVerificationCodeWithRollback(
        user: any,
        authUser: any,
        email: string
    ) {
        try {
            await this.generateVerificationCodeAndSend(authUser, email);
        } catch (err) {
            this.logger.error(
                '[Register] Verification code creation failed.',
                err
            );
            await this.usersService.deleteById(user._id);
            await this.authModel.findByIdAndDelete(authUser._id);
            throw new InternalServerErrorException(
                'Failed to create verification code'
            );
        }
    }

    private async generateVerificationCodeAndSend(
        authUser: any,
        email: string
    ) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await this.verificationCodeModel.create({
            user: authUser._id,
            code,
            expiresAt,
            used: false
        });
        console.log(
            `[Register] Verification code created for ${email}: ${code}`
        );
        try {
            await this.mailService.send({
                to: email,
                subject: 'Verify your email address',
                html: `<h1>Verification code: ${code}</h1>`
            });
            console.log(
                `[Register] Verification code sent to ${email}: ${code}`
            );
        } catch (err) {
            this.logger.error(
                '[Register] Verification code creation failed. Rolling back user and authUser.'
            );
        }
    }

    async register(dto: RegisterDto) {
        try {
            const { email, username, password } = dto;

            const existingByEmail = await this.authModel.findOne({ email });
            if (existingByEmail) {
                throw new ConflictException('Email already exists');
            }

            const existingByUsername = await this.authModel.findOne({
                username
            });
            if (existingByUsername) {
                throw new ConflictException('Username already exists');
            }

            const hash = await bcrypt.hash(password, 10);

            const authUser = await this.authModel.create({
                email,
                username,
                password: hash
            });

            const user = await this.createUserWithRollback(authUser);

            await this.createVerificationCodeWithRollback(
                user,
                authUser,
                email
            );
            this.logger.log('[Register] Registration successful');
            const token = this.generateToken(user);
            this.logger.log('[Register] Token generated', token);
            return {
                message: 'Verification code sent',
                email: authUser.email,
                token
            };
        } catch (err) {
            this.logger.error('[Register] Registration failed:', err);
            throw err;
        }
    }

    async verifyCode(dto: VerifyCodeDto) {
        const authUser = await this.authModel.findOne({ email: dto.email });

        if (!authUser) {
            throw new BadRequestException('User not found');
        }

        const verificationRecord = await this.verificationCodeModel.findOne({
            user: authUser._id,
            code: dto.code,
            used: false,
            expiresAt: { $gt: new Date() }
        });

        if (!verificationRecord) {
            throw new BadRequestException(
                'Invalid or expired verification code'
            );
        }

        verificationRecord.used = true;
        await verificationRecord.save();

        const updatedUser = await this.usersService.updateByAuthUserId(
            authUser._id,
            {
                isVerified: true
            }
        );

        return { message: 'Email verified successfully', user: updatedUser };
    }

    async assignRole(dto: AssignRoleDto) {
        const user = await this.usersService.findByEmailOrUsername(dto.email);
        if (!user || !user.isVerified)
            throw new BadRequestException('User not verified');

        const updated = await this.usersService.update(dto.email, {
            role: dto.role
        });

        return { message: 'Role assigned and logged in', user: updated };
    }

    async login(loginDto: LoginDto) {
        const { identifier, password } = loginDto;

        const authUser = await this.authModel.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });
        if (!authUser) {
            throw new UnauthorizedException(
                'Invalid credentials: Username or password is wrong'
            );
        }
        const passwordMatches = await bcrypt.compare(
            password,
            authUser.password
        );
        if (!passwordMatches) {
            throw new UnauthorizedException(
                'Invalid credentials: Username or password is wrong'
            );
        }

        const user = await this.usersService.findByAuthUserId(
            authUser._id.toString()
        );

        const token = this.generateToken(user);
        return { token, user };
    }
}
