import {
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Controller,
  UseInterceptors,
  Get,
  Res,
  Query,
  forwardRef,
  Inject,
  HttpException,
  ValidationPipe,
  UsePipes,
  UseGuards
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import {
  MultiFileUploadInterceptor,
  FilesUploaded,
  FileDto
} from 'src/modules/file';
import { DataResponse, getConfig } from 'src/kernel';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import { Response } from 'express';
import { UserRegisterPayload } from 'src/modules/user/payloads';
import { PerformerRegisterPayload } from 'src/modules/performer/payloads';
import { AuthGuard } from 'src/modules/auth/guards';
import { CurrentUser } from 'src/modules/auth';
import { EmailVerificationPayload } from '../payloads';
import { AuthService } from '../services';

// custom imports
import { UserDto } from '../../user/dtos';

@Controller('auth')
export class RegisterController {
  constructor(
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('users/register')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async userRegister(
    @Body() payload: UserRegisterPayload
  ): Promise<DataResponse<{ message: string }>> {
    const user = await this.userService.register(payload);
    await this.authService.createAuthPassword({
      source: 'user',
      sourceId: user._id,
      type: 'password',
      value: payload.password,
      key: user.email
    });
    // always send email verification
    user.email && (await this.authService.sendVerificationEmail(user));
    return DataResponse.ok({
      message: 'Please check your inbox and verify your email address'
    });
  }

  @Post('performers/register')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    MultiFileUploadInterceptor([
      {
        type: 'performer-document',
        fieldName: 'idVerification',
        options: {
          destination: getConfig('file').documentDir,
          uploadImmediately: true,
          acl: S3ObjectCannelACL.AuthenticatedRead,
          server: Storage.S3
        }
      },
      {
        type: 'performer-document',
        fieldName: 'documentVerification',
        options: {
          destination: getConfig('file').documentDir,
          uploadImmediately: true,
          acl: S3ObjectCannelACL.AuthenticatedRead,
          server: Storage.S3
        }
      }
    ])
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(AuthGuard) // added to make sure only authenticated users can register as creators
  async performerRegister(
    @Body() payload: PerformerRegisterPayload,
    @FilesUploaded() files: Record<string, FileDto>,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<{ message: string }>> {
    try {
      if (!files.idVerification || !files.documentVerification) {
        throw new HttpException('Missing ID documents!', 404);
      }
      console.log({ user });
      console.log('register.controller.ts', '1');
      const performer = await this.performerService.register({
        ...payload,
        idVerificationId: files?.idVerification?._id as any,
        documentVerificationId: files?.documentVerification?._id as any
      });
      console.log('register.controller.ts', '2');
      await this.authService.updateAuthPerformerId({
        sourceId: user._id,
        performerId: performer._id
      });
      // await this.authService.createAuthPassword({
      //   source: "performer",
      //   sourceId: user._id,
      //   performerId: performer._id,
      //   type: "password",
      //   key: "",
      //   value: "",

      // });
      console.log('register.controller.ts', '3');

      performer.email &&
        (await this.authService.sendVerificationEmail(performer));
      return DataResponse.ok({
        message: `Your application will be processed withing 24 to 48 hours, most times sooner. You will get an email notification sent to ${
          performer.email || 'your email address'
        } with the status update.`
      });
    } catch (e) {
      files.idVerification &&
        (await this.fileService.remove(files.idVerification._id));
      files.documentVerification &&
        (await this.fileService.remove(files.documentVerification._id));
      throw e;
    }
  }

  @Post('email-verification')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async emailVerify(
    @Body() payload: EmailVerificationPayload
  ): Promise<DataResponse<{ message: string }>> {
    await this.authService.sendVerificationEmail(payload.source);
    return DataResponse.ok({
      message:
        'We have sent you a verification email please check your email account you registered with'
    });
  }

  @Get('email-verification')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  public async verifyEmail(
    @Res() res: Response,
    @Query('token') token: string
  ) {
    if (!token) {
      return res.render('404.html');
    }
    await this.authService.verifyEmail(token);
    if (process.env.EMAIL_VERIFIED_SUCCESS_URL) {
      return res.redirect(process.env.EMAIL_VERIFIED_SUCCESS_URL);
    }
    return res.redirect(`${process.env.USER_URL}`);
  }

  @Post('users/register-child')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard) // Ensure only authenticated users can create child accounts
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async registerChildAccount(
    @Body() payload: UserRegisterPayload,
    @CurrentUser() currentUser: UserDto
  ): Promise<DataResponse<{ message: string }>> {
    const childUser = await this.userService.registerChild(
      payload,
      currentUser._id
    );
    await this.authService.createAuthPassword({
      source: 'user',
      sourceId: childUser._id,
      type: 'password',
      value: payload.password,
      key: childUser.email
    });
    return DataResponse.ok({
      message: 'Child account created successfully'
    });
  }
}
