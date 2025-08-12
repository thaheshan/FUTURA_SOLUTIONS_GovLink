import {
    Body,
    Controller,
    forwardRef,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Logger,
    Post,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataResponse, getConfig } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { CurrentUser } from 'src/modules/auth';
import { FileDto, FileUploaded, FileUploadInterceptor } from 'src/modules/file';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import { FileService } from 'src/modules/file/services';
import { AuthGuard } from 'src/modules/auth-v2/guard/auth.guard';
import { CreatorPostV2Service } from '../services/creator-post-v2.service';
import { CreatorTextPostV2Payload } from '../payload/creator-text-post-v2.payload';
import { CreatorImagePostV2Payload } from '../payload/creator-image-post-v2.payload';
import { CreatorVideoPostV2Payload } from '../payload/creator-video-post-v2.payload';
import { CreateCreatorPostDto } from '../dto/create-creator-post-v2.dto';

@Controller({ path: 'creator-post', version: '1' })
@ApiTags('Creator-post')
export class CreatorPostV2Controller {
    private readonly logger = new Logger(CreatorPostV2Service.name);

    constructor(
        @Inject(forwardRef(() => FileService))
        private readonly fileService: FileService,
        private readonly creatorPostService: CreatorPostV2Service
    ) {}

    @Post('/add-text-post')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async textPostCreate(
        @Body() payload: CreatorTextPostV2Payload,
        @CurrentUser() user: UserDto
    ): Promise<DataResponse<any>> {
        const data = await this.creatorPostService.createTextPost(
            payload,
            user._id
        );
        return DataResponse.ok(data);
    }

    @Post('/add-video-post')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async videoPostCreate(
        @Body() payload: CreatorVideoPostV2Payload,
        @CurrentUser() user: UserDto
    ): Promise<DataResponse<any>> {
        const data = await this.creatorPostService.createVideoPost(
            payload,
            user._id
        );
        return DataResponse.ok(data);
    }

    @Post('/add-image-post')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async imagePostCreate(
        @Body() payload: CreatorImagePostV2Payload,
        @CurrentUser() user: UserDto
    ): Promise<DataResponse<any>> {
        const data = await this.creatorPostService.createImagePost(
            payload,
            user._id
        );
        return DataResponse.ok(data);
    }

    @Post('photo/upload')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileUploadInterceptor('feed-photo', 'photo', {
            destination: getConfig('file').feedDir,
            acl: S3ObjectCannelACL.AuthenticatedRead,
            server: Storage.S3
        })
    )
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async uploadImage(@FileUploaded() file: FileDto): Promise<any> {
        try {
            return DataResponse.ok({
                success: true,
                ...file.toResponse(),
                url: file.getUrl()
            });
        } catch (e) {
            await this.fileService.remove(file._id);
            this.logger.error('Error in upload photo:', e);
            throw e;
        }
    }

    @Post('video/upload')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileUploadInterceptor('feed-video', 'video', {
            destination: getConfig('file').feedDir,
            acl: S3ObjectCannelACL.AuthenticatedRead,
            server: Storage.S3
        })
    )
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async uploadVideo(@FileUploaded() file: FileDto): Promise<any> {
        try {
            return DataResponse.ok({
                success: true,
                ...file.toResponse(),
                url: file.getUrl()
            });
        } catch (e) {
            await this.fileService.remove(file._id);
            this.logger.error('Error in upload video:', e);
            throw e;
        }
    }

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async getSpecialRequestPage(
        @CurrentUser() user: UserDto
    ): Promise<DataResponse<CreateCreatorPostDto[]>> {
        const result = await this.creatorPostService.getCreatorPosts(user._id);
        return DataResponse.ok(result);
    }
}
