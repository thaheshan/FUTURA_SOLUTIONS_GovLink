import {
  Controller,
  Injectable,
  UseGuards,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Put,
  Get,
  Param,
  Query,
  UseInterceptors,
  Inject,
  forwardRef,
  Delete,
  Request
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import {
  DataResponse, PageableData, getConfig
} from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { AuthService } from 'src/modules/auth/services';
import { AuthCreateDto } from 'src/modules/auth/dtos';
import { FileUploadInterceptor, FileUploaded, FileDto } from 'src/modules/file';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import { UserDto } from 'src/modules/user/dtos';
import {
  PerformerCreatePayload,
  PerformerUpdatePayload,
  PerformerSearchPayload,
  PaymentGatewaySettingPayload,
  CommissionSettingPayload,
  BankingSettingPayload
} from '../payloads';
import { PerformerDto } from '../dtos';
import { PerformerService, PerformerSearchService } from '../services';

@Injectable()
@Controller('admin/performers')
export class AdminPerformerController {
  constructor(
    private readonly performerService: PerformerService,
    private readonly performerSearchService: PerformerSearchService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) { }

  @Get('/search')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async search(
    @Query() req: PerformerSearchPayload
  ): Promise<DataResponse<PageableData<PerformerDto>>> {
    const data = await this.performerSearchService.adminSearch(req);
    return DataResponse.ok(data);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() payload: PerformerCreatePayload
  ): Promise<DataResponse<PerformerDto>> {
    // password should be created in auth module only
    const { password } = payload;
    // eslint-disable-next-line no-param-reassign
    delete payload.password;
    const performer = await this.performerService.create(payload);

    if (password) {
      await this.authService.createAuthPassword(
        new AuthCreateDto({
          source: 'performer',
          sourceId: performer._id,
          type: 'password',
          key: performer.email,
          value: password
        })
      );
    }

    return DataResponse.ok(performer);
  }

  @Put('/:id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateUser(
    @Body() payload: PerformerUpdatePayload,
    @Param('id') performerId: string,
    @Request() req: any
  ): Promise<DataResponse<PerformerDto>> {
    await this.performerService.adminUpdate(performerId, payload);
    const performer = await this.performerService.getDetails(performerId, req.jwToken);
    return DataResponse.ok(performer);
  }

  @Get('/:id/view')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getDetails(
    @Param('id') performerId: string,
    @Request() req: any
  ): Promise<DataResponse<PerformerDto>> {
    const performer = await this.performerService.getDetails(performerId, req.jwToken);
    // TODO - check roles or other to response info
    const data = performer.toResponse(true, true);
    return DataResponse.ok(data);
  }

  @Delete('/:id/delete')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async delete(
    @Param('id') performerId: string
  ): Promise<DataResponse<any>> {
    const data = await this.performerService.delete(performerId);
    return DataResponse.ok(data);
  }

  @Post('/documents/upload/:performerId/:type')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    FileUploadInterceptor('performer-document', 'file', {
      destination: getConfig('file').documentDir,
      uploadImmediately: true,
      acl: S3ObjectCannelACL.AuthenticatedRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadPerformerDocument(
    @FileUploaded() file: FileDto,
    @Param('performerId') id: string,
    @Param('type') type: string
  ): Promise<any> {
    await this.performerService.updateDocument(id, file, type);
    return DataResponse.ok({
      ...file,
      url: `${file.getUrl(true)}`
    });
  }

  @Post('/:performerId/avatar/upload')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    FileUploadInterceptor('avatar', 'avatar', {
      destination: getConfig('file').avatarDir,
      uploadImmediately: true,
      acl: S3ObjectCannelACL.PublicRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadPerformerAvatar(
    @FileUploaded() file: FileDto,
    @Param('performerId') performerId: string
  ): Promise<any> {
    await this.performerService.updateAvatar(performerId, file);
    return DataResponse.ok({
      ...file,
      url: file.getUrl()
    });
  }

  @Post('/:performerId/cover/upload')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    FileUploadInterceptor('cover', 'cover', {
      destination: getConfig('file').coverDir,
      uploadImmediately: true,
      acl: S3ObjectCannelACL.PublicRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadPerformerCover(
    @FileUploaded() file: FileDto,
    @Param('performerId') performerId: string
  ): Promise<any> {
    await this.performerService.updateCover(performerId, file);
    return DataResponse.ok({
      ...file,
      url: file.getUrl()
    });
  }

  @Post('/:id/welcome-video/upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseInterceptors(
    FileUploadInterceptor('performer-welcome-video', 'welcome-video', {
      destination: getConfig('file').videoDir,
      acl: S3ObjectCannelACL.PublicRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadPerformerVideo(
    @FileUploaded() file: FileDto,
    @Param('id') performerId: string
  ): Promise<any> {
    // TODO - define url for perfomer id if have?
    await this.performerService.updateWelcomeVideo(performerId, file);
    return DataResponse.ok({
      ...file,
      url: file.getUrl(true)
    });
  }

  @Put('/:id/payment-gateway-settings')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updatePaymentGatewaySetting(
    @Body() payload: PaymentGatewaySettingPayload
  ) {
    const data = await this.performerService.updatePaymentGateway(payload);
    return DataResponse.ok(data);
  }

  @Put('/:id/commission-settings')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateCommissionSetting(
    @Param('id') performerId: string,
    @Body() payload: CommissionSettingPayload
  ) {
    const data = await this.performerService.updateCommissionSetting(
      performerId,
      payload
    );
    return DataResponse.ok(data);
  }

  @Put('/:id/banking-settings')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateBankingSetting(
    @Param('id') performerId: string,
    @Body() payload: BankingSettingPayload,
    @CurrentUser() user: UserDto
  ) {
    const data = await this.performerService.updateBankingSetting(
      performerId,
      payload,
      user
    );
    return DataResponse.ok(data);
  }
}
