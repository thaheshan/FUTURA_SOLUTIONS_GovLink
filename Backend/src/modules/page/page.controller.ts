import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors
} from '@nestjs/common';
import { DataResponse, getConfig, PathIdDto } from 'src/kernel';
import { ApiTags } from '@nestjs/swagger';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageDocument } from './entities/page.entity';
import { FileUploadInterceptor, FileUploaded, FileDto } from '../file';
import { S3ObjectCannelACL, Storage } from '../storage/contants';
import { MembershipPlanService } from '../membership-plan/membership-plan.service';
import { MembershipPlan } from '../membership-plan/entities/membership-plan.entity';

@Controller({ path: 'page', version: '1' })
@ApiTags('Page')
export class PageController {
    constructor(
        private readonly pageService: PageService,
        private readonly membershipPlanService: MembershipPlanService
    ) {}

    @Post()
    createPage(@Body() createPageDto: CreatePageDto) {
        return this.pageService.create(createPageDto);
    }

    @Get()
    findAll() {
        return this.pageService.findAll();
    }

    @Get(':url')
    findOne(@Param('url') url: string): Promise<PageDocument | null> {
        return this.pageService.findOneByUrl(url);
    }

    @Patch(':id')
    update(@Param() { id }: PathIdDto, @Body() updatePageDto: UpdatePageDto) {
        return this.pageService.update(id, updatePageDto);
    }

    @Delete(':id')
    remove(@Param() { id }: PathIdDto) {
        return this.pageService.remove(id);
    }

    @Post(':id/intro-video/upload')
    @UseInterceptors(
        FileUploadInterceptor('video', 'intro-video', {
            destination: getConfig('file').introVideoDir,
            uploadImmediately: true,
            acl: S3ObjectCannelACL.PublicRead,
            server: Storage.S3
        })
    )
    async uploadAvatar(
        @Param() { id }: PathIdDto,
        @FileUploaded() file: FileDto
    ): Promise<DataResponse<string>> {
        const url = await this.pageService.updateIntroVideo(id, file);
        return DataResponse.ok(url);
    }

    @Post(':id/profile-picture/upload')
    @UseInterceptors(
        FileUploadInterceptor('image', 'profile-picture', {
            destination: getConfig('file').imageDir,
            uploadImmediately: true,
            acl: S3ObjectCannelACL.PublicRead,
            server: Storage.S3
        })
    )
    async uploadProfilePicture(
        @Param() { id }: PathIdDto,
        @FileUploaded() file: FileDto
    ): Promise<DataResponse<string>> {
        const url = await this.pageService.updateProfilePicture(id, file);
        return DataResponse.ok(url);
    }

    @Post(':id/cover-image/upload')
    @UseInterceptors(
        FileUploadInterceptor('image', 'cover-image', {
            destination: getConfig('file').imageDir,
            uploadImmediately: true,
            acl: S3ObjectCannelACL.PublicRead,
            server: Storage.S3
        })
    )
    async uploadCoverImage(
        @Param() { id }: PathIdDto,
        @FileUploaded() file: FileDto
    ): Promise<DataResponse<string>> {
        const url = await this.pageService.updateCover(id, file);
        return DataResponse.ok(url);
    }

    @Get(':id/membership-plan')
    @ApiTags('Membership plan')
    async updateMembershipPlan(
        @Param() { id }: PathIdDto
    ): Promise<MembershipPlan[]> {
        return this.membershipPlanService.getForPage(id);
    }
}
