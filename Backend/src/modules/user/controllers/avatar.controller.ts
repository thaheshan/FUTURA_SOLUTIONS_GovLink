import {
  HttpCode,
  HttpStatus,
  Controller,
  Injectable,
  UseGuards,
  Post,
  UseInterceptors,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards';
import { DataResponse, getConfig } from 'src/kernel';
import { FileUploadInterceptor, FileUploaded, FileDto } from 'src/modules/file';
import { CurrentUser } from 'src/modules/auth';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import { UserDto } from '../dtos';
import { UserService } from '../services';

@Injectable()
@Controller('users')
export class AvatarController {
  static avatarDir: string;

  constructor(private readonly userService: UserService) {}

  @Post('/avatar/upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileUploadInterceptor('avatar', 'avatar', {
      destination: getConfig('file').avatarDir,
      uploadImmediately: true,
      acl: S3ObjectCannelACL.PublicRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadAvatar(
    @CurrentUser() user: UserDto,
    @FileUploaded() file: FileDto
  ): Promise<any> {
    await this.userService.updateAvatar(user, file);
    return DataResponse.ok({
      success: true,
      url: file.getUrl()
    });
  }
}
