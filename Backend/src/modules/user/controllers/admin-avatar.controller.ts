import {
  HttpCode,
  HttpStatus,
  Controller,
  Injectable,
  UseGuards,
  Post,
  UseInterceptors,
  Param,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, getConfig, EntityNotFoundException } from 'src/kernel';
import { FileUploadInterceptor, FileUploaded, FileDto } from 'src/modules/file';
import { Roles } from 'src/modules/auth';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import { UserDto } from '../dtos';
import { UserService } from '../services';

@Injectable()
@Controller('admin/users')
export class AdminAvatarController {
  static avatarDir: string;

  constructor(private readonly userService: UserService) {}

  @Post('/:id/avatar/upload')
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
  async uploadUserAvatar(
    @Param('id') userId: string,
    @FileUploaded() file: FileDto
  ): Promise<any> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new EntityNotFoundException();
    }
    await this.userService.updateAvatar(new UserDto(user), file);
    return DataResponse.ok({
      success: true,
      url: file.getUrl()
    });
  }
}
