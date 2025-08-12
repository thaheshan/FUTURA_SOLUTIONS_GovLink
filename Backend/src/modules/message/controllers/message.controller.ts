import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Query,
  Param,
  Delete,
  UseInterceptors
} from '@nestjs/common';
import { DataResponse, ForbiddenException, getConfig } from 'src/kernel';
import { AuthGuard, RoleGuard } from 'src/modules/auth/guards';
import {
  FileUploaded, FileUploadInterceptor, FileDto
} from 'src/modules/file';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import { CurrentUser, Roles } from 'src/modules/auth';
import { UserDto } from 'src/modules/user/dtos';
import { UserService } from 'src/modules/user/services';
import { MessageService, NotificationMessageService } from '../services';
import {
  MessageListRequest, MessageCreatePayload
} from '../payloads';
import { MessageDto } from '../dtos';

@Injectable()
@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly notificationMessageService: NotificationMessageService,
    private readonly userService: UserService
  ) { }

  @Post('/public/file/photo')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileUploadInterceptor(
      'message-photo',
      'file',
      {
        destination: getConfig('file').messageDir,
        acl: S3ObjectCannelACL.PublicRead,
        server: Storage.S3
      }
    )
  )
  async validatePublicPhoto(
    @FileUploaded() file: FileDto
  ) {
    await this.messageService.validatePhotoFile(file, true);
    return DataResponse.ok({
      ...file.toResponse(),
      url: file.getUrl()
    });
  }

  @Post('/private/file/video')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileUploadInterceptor(
      'message-video',
      'file',
      {
        destination: getConfig('file').messageDir,
        acl: S3ObjectCannelACL.PublicRead,
        server: Storage.S3
      }
    )
  )
  async createVideoFileMessage(
    @FileUploaded() file: FileDto
  ) {
    await this.messageService.validateVideoFile(file);
    return DataResponse.ok({
      ...file.toResponse(),
      url: file.getUrl()
    });
  }

  @Post('/read-all/:conversationId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async readAllMessage(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<MessageDto>> {
    const message = await this.notificationMessageService.recipientReadAllMessageInConversation(user, conversationId);
    return DataResponse.ok(message);
  }

  @Get('/counting-not-read-messages')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async countTotalNotReadMessage(
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const data = await this.notificationMessageService.countTotalNotReadMessage(user._id);
    return DataResponse.ok(data);
  }

  @Get('/conversations/:conversationId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async loadMessages(
    @Query() query: MessageListRequest,
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: UserDto,
    @Request() req: any
  ): Promise<DataResponse<any>> {
    // eslint-disable-next-line no-param-reassign
    query.conversationId = conversationId;
    const data = await this.messageService.loadPrivateMessages(query, user, req.jwToken);
    return DataResponse.ok(data);
  }

  @Post('/conversations/:conversationId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createMessage(
    @Body() payload: MessageCreatePayload,
    @Param('conversationId') conversationId: string,
    @Request() req: any
  ): Promise<DataResponse<any>> {
    const data = await this.messageService.createPrivateMessage(
      conversationId,
      payload,
      {
        source: req.authUser.source,
        sourceId: req.authUser.sourceId
      },
      req.jwToken
    );
    return DataResponse.ok(data);
  }

  @Post('/stream/conversations/:conversationId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createStreamMessage(
    @Body() payload: MessageCreatePayload,
    @Param('conversationId') conversationId: string,
    @Request() req: any,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const data = await this.messageService.createStreamMessageFromConversation(
      conversationId,
      payload,
      {
        source: req.authUser.source,
        sourceId: req.authUser.sourceId
      },
      user
    );
    return DataResponse.ok(data);
  }

  @Delete('/:messageId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async deleteMessage(
    @Param('messageId') messageId: string,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const data = await this.messageService.deleteMessage(
      messageId,
      user
    );
    return DataResponse.ok(data);
  }

  @Delete('/:conversationId/remove-all-message')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async deleteAllPublicMessage(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: any
  ): Promise<DataResponse<any>> {
    const data = await this.messageService.deleteAllMessageInConversation(
      conversationId,
      user
    );
    return DataResponse.ok(data);
  }

  @Get('/conversations/public/:conversationId')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async loadPublicMessages(
    @Query() req: MessageListRequest,
    @Param('conversationId') conversationId: string
  ): Promise<DataResponse<any>> {
    // eslint-disable-next-line no-param-reassign
    req.conversationId = conversationId;
    const data = await this.messageService.loadPublicMessages(req);
    return DataResponse.ok(data);
  }

  @Post('/keywords')
  @HttpCode(HttpStatus.CREATED)
  // @Roles('admin')
  // @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createKeyword(
    @Body() keywordDto: { keyword: string }
  ): Promise<DataResponse<{ message: string }>> {
    await this.messageService.createKeyword(keywordDto.keyword);
    return DataResponse.ok({ message: 'Keyword created successfully' });
  }

  @Get('/toxicity-reports')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getToxicityReports(
    @Query('userId') userId: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @CurrentUser() currentUser: UserDto
  ): Promise<DataResponse<any>> {
    const safeLimit = Number.isNaN(limit) ? 10 : limit;
    const safePage = Number.isNaN(page) ? 0 : page;
    let requestedUser = userId;
    // If no userId is provided, get the reports for the current user
    if (!requestedUser) {
      requestedUser = currentUser._id.toString();
    }

    // Check if the current user is allowed to view the reports for the requested userId
    const isAdmin = currentUser.roles.includes('admin');
    const isGuardian = await this.userService.isGuardian(currentUser._id, requestedUser);

    if (requestedUser !== currentUser._id.toString() && !isAdmin && !isGuardian) {
      throw new ForbiddenException('You do not have permission to view these reports.');
    }

    const reports = await this.messageService.getToxicityReportsByUser(requestedUser, safeLimit, safePage);
    return DataResponse.ok(reports);
  }
}
