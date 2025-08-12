import {
  Controller,
  Injectable,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Param,
  Get,
  Patch,
  UseInterceptors,
  forwardRef,
  Inject
} from '@nestjs/common';
import { FileDto, FileUploaded, FileUploadInterceptor } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { S3ObjectCannelACL,Storage } from 'src/modules/storage/contants';
import { AuthGuard } from 'src/modules/auth-v2/guard/auth.guard';
import { DataResponse, getConfig } from 'src/kernel';
import { CurrentUser } from 'src/modules/auth';
import { UserDto } from 'src/modules/user/dtos';
import {
  SpecialRequestCreatePayload,
  SpecialRequestTypeAddPerfomerPayload,
  SpecialRequestPerformerPublishPagePayload
} from '../payloads';
import {
  SpecialRequestService,
  SpecialRequestTypeService,
  SpecialRequestTypeCategoryService,
  SpecialRequestPerfomerPublishService
} from '../services';
import {
  SpecialRequestTypeDto,
  SpecialRequestTypeCategoryDto,
  SpecialRequestPerformerPublishDto
} from '../dtos';

@Injectable()
@Controller({path:'special-request',version:'1'})
export class SpecialRequestController {
    constructor(
        @Inject(forwardRef(() => FileService))
        private readonly fileService: FileService,
        private readonly specialRequestService: SpecialRequestService,
        private readonly specialRequestTypeService: SpecialRequestTypeService,
        private readonly specialRequestTypeCategoryService: SpecialRequestTypeCategoryService,
        private readonly specialRequestPerformerPublish: SpecialRequestPerfomerPublishService
    ) {}

    @Get('/types')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async getSpecialRequestTypes(): Promise<
        DataResponse<SpecialRequestTypeDto[]>
    > {
        const result = await this.specialRequestTypeService.getRequestTypes();
        return DataResponse.ok(result);
    }

    @Get('/categories')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async getSpecialRequestTypesCategories(): Promise<
        DataResponse<SpecialRequestTypeCategoryDto[]>
    > {
        const result =await this.specialRequestTypeCategoryService.getRequestTypeCategories();
        return DataResponse.ok(result);
    }

    @Post('/request-fan')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async createRequest(
        @Body() payload: SpecialRequestCreatePayload,
        @CurrentUser() user: UserDto
    ): Promise<DataResponse<any>> {
        const request = await this.specialRequestService.createRequest(
            payload,
            user._id
        );
        return DataResponse.ok(request);
    }
  
    @Post('/add-specieal-request-page')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async addSpecialRequestToPage(
      @Body() payload: SpecialRequestTypeAddPerfomerPayload,
      @CurrentUser() user: UserDto
    ): Promise<DataResponse<any>>{
      try{
          const req=await this.specialRequestPerformerPublish.addSpecialRequestPerformerPage(
            payload,
            user._id
          )
          return DataResponse.ok(req)
      }catch(e){
          console.error('Error in addSpecialRequestToPage:', e);
          throw e;
      }

    }

    @Patch('/update-specieal-request-page')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async updateSpecialRequestToPage(
      @Body() payload: SpecialRequestTypeAddPerfomerPayload,
      @CurrentUser() user: UserDto
    ): Promise<DataResponse<any>>{
      try{
          const req=await this.specialRequestPerformerPublish.updateSpecialRequestPage(
            payload,
            user._id
          )
          return DataResponse.ok(req)
      }catch(e){
          console.error('Error in updateSpecialRequestToPage:', e);
          throw e;
      }

    }

    @Post('/publish-specieal-request-page')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async publishSpecialRequestToPage(
      @Body() payload: SpecialRequestPerformerPublishPagePayload,
      @CurrentUser() user: UserDto
    ): Promise<DataResponse<any>>{
      try{
          const req=await this.specialRequestPerformerPublish.publishSpecialRequestPage(
            payload,
            user._id
          )
          return DataResponse.ok(req)
      }catch(e){
          console.error('Error in publishSpecialRequestToPage:', e);
          throw e;
      }
    }

    // upload teaser video
    @Post('/upload-special-request-teaser')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UseInterceptors(
      FileUploadInterceptor('special-request-teaser-video', 'teaser-video', {
        destination: getConfig('file').specialRequestTeaserVideoDir,
        uploadImmediately: true,
        acl: S3ObjectCannelACL.AuthenticatedRead,
        server: Storage.S3
      })
    )
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async uploadTeaserToPage(
      @FileUploaded() file: FileDto,
      @CurrentUser() user: UserDto
    ): Promise<DataResponse<any>>{
      try{
          const req=await this.specialRequestPerformerPublish.uploadTeaserVideo(
            file._id,
            user._id
          )
          return DataResponse.ok(req)
      }catch(e){
        await this.fileService.remove(file._id)
        console.error('Error in publishSpecialRequestToPage:', e);
        throw e;
      }
    }

    @Get('/get-special-request-page')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async getSpecialRequestPage(
      @CurrentUser() user: UserDto
    ): Promise<
        DataResponse<SpecialRequestPerformerPublishDto>
    > {
        const result = await this.specialRequestPerformerPublish.getSpecialRequestPage(user._id)
        return DataResponse.ok(result);
    }

    @Get('/performer-page/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async getPerformerSpecialRequestPage(
      @Param('id') creatorId: string
    ): Promise<
        DataResponse<SpecialRequestPerformerPublishDto>
    > {
        const result = await this.specialRequestPerformerPublish.getPerformersSpecialRequestPage(creatorId)
        return DataResponse.ok(result);
    }

}
