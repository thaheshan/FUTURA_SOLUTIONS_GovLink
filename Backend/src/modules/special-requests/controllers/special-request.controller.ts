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
    Put,
    Param,
    Get,
    Query,
    Patch,
    UseInterceptors,
    forwardRef,
    Inject
} from '@nestjs/common';
import { FileDto, FileUploaded, FileUploadInterceptor } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { S3ObjectCannelACL,Storage } from 'src/modules/storage/contants';
// import { RoleGuard } from 'src/modules/auth/guards';
import { AuthGuard } from 'src/modules/auth-v2/guard/auth.guard';
import { DataResponse, getConfig, PageableData } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { UserDto } from 'src/modules/user/dtos';
import {
    SpecialRequestCreatePayload,
    SpecialRequestRefundPayload,
    ReviewCreatePayload,
    SpecialRequestSearchRequest,
    SpecialRequestTypeAddPerfomerPayload,
    SpecialRequestPerformerPublishPagePayload
} from '../payloads';
import { SPECIAL_REQUEST_STATUS } from '../constants';
import {
    MockPayService,
    SpecialRequestService,
    SpecialRequestReviewService,
    SpecialRequestSearchService,
    SpecialRequestTypeService,
    SpecialRequestTypeCategoryService,
    SpecialRequestPerfomerPublishService
} from '../services';
import {
    SpecialRequestDto,
    SpecialRequestReviewDto,
    SpecialRequestTypeDto,
    SpecialRequestTypeCategoryDto,
    SpecialRequestPerformerPublishDto
} from '../dtos';
import { SpecialRequestTypeCreatePayload } from '../payloads/special-request-type-create.request';

@Injectable()
@Controller('special-requests')
export class SpecialRequestController {
    constructor(
        @Inject(forwardRef(() => FileService))
        private readonly fileService: FileService,
        private readonly specialRequestService: SpecialRequestService,
        private readonly mockPayService: MockPayService,
        private readonly specialRequestReviewService: SpecialRequestReviewService,
        private readonly specialRequestSearchService: SpecialRequestSearchService,
        private readonly specialRequestTypeService: SpecialRequestTypeService,
        private readonly specialRequestTypeCategoryService: SpecialRequestTypeCategoryService,
        private readonly specialRequestPerformerPublish: SpecialRequestPerfomerPublishService
    ) {}

    @Get('/performer-requests')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async getPerformersSpecialRequests(
        @Query() query: any,
        @CurrentUser() user: UserDto
    ): Promise<DataResponse<any>> {
        const result = await this.specialRequestService.findByUser(
            user._id,
            'creator',
            query
        );
        return DataResponse.ok(result);
    }

    /**
     *add default special request types and categories
     */
    @Get('/sync-default-special-request-types')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async syncDefaultSpecialRequestTypes(): Promise<DataResponse<any>> {
        try {
            const result =
                await this.specialRequestTypeService.syncSpecialRequestTypes();
            return DataResponse.ok(result);
        } catch (error) {
            console.error(
                'Error syncing default special request types:',
                error
            );
            return DataResponse.ok(
                'Failed to sync default special request types'
            );
        }
    }

    /**
     * special request types for creator
     */
    @Get('/types')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    // @Roles("creator")
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async getSpecialRequestTypes(): Promise<
        DataResponse<SpecialRequestTypeDto[]>
    > {
        const result = await this.specialRequestTypeService.getRequestTypes(
            null,
            'creator'
        );
        return DataResponse.ok(result);
    }

    @Get('/creators-types')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Roles('creator')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async getCreatorsSpecialRequestTypes(
        @Query() query: any,
        @CurrentUser() user: UserDto
    ): Promise<DataResponse<SpecialRequestTypeDto[]>> {
        const result =
            await this.specialRequestTypeService.getCreatorsRequestTypes(
                user._id,
                'creator'
            );
        return DataResponse.ok(result);
    }

    /**
     * special request types categories get for everyone
     */
    @Get('/categories')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async getSpecialRequestTypesCategories(): Promise<
        DataResponse<SpecialRequestTypeCategoryDto[]>
    > {
        const result =
            await this.specialRequestTypeCategoryService.getRequestTypeCategories();
        return DataResponse.ok(result);
    }

    /**
     * special request types create for creator
     */
    @Post('/types')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    // @Roles("creator")
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async createRequestType(
        @Body() payload: SpecialRequestTypeCreatePayload,
        @CurrentUser() user: UserDto
    ): Promise<DataResponse<any>> {
        const request =
            await this.specialRequestTypeService.createSpecialRequestType(
                payload,
                user._id
            );
        return DataResponse.ok(request);
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

    /**
     * Accept a special request
     * @param id - ID of the special request
     * @param performer - Current user (performer)
     * @returns Success response
     */
    @Put('/:id/accept')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async acceptRequest(
        @Param('id') id: string,
        @CurrentUser() performer: UserDto
    ): Promise<DataResponse<any>> {
        const result = await this.specialRequestService.updateRequestStatus(
            id,
            performer,
            SPECIAL_REQUEST_STATUS.ACCEPTED
        );
        return DataResponse.ok(result);
    }

    /**
     * Decline a special request
     * @param id - ID of the special request
     * @param performer - Current user (performer)
     * @returns Success response
     */
    @Put('/:id/decline')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async declineRequest(
        @Param('id') id: string,
        @CurrentUser() performer: UserDto
    ): Promise<DataResponse<any>> {
        const result = await this.specialRequestService.updateRequestStatus(
            id,
            performer,
            SPECIAL_REQUEST_STATUS.DECLINED
        );
        return DataResponse.ok(result);
    }

    /**
     * Mock Payment for a special request
     * @param id - ID of the special request
     * @returns Mock payment status
     */
    @Post('/:id/pay')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async mockPay(@Param('id') id: string): Promise<DataResponse<any>> {
        const result = await this.mockPayService.simulatePayment(id);
        return DataResponse.ok(result);
    }

    @Put('/:id/complete')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Roles('performer')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async completeRequest(
        @Param('id') id: string,
        @CurrentUser() creator: UserDto
    ): Promise<DataResponse<any>> {
        const result = await this.specialRequestService.markAsCompleted(
            id,
            creator
        );
        return DataResponse.ok(result);
    }

    /**
     * Initiate refund request by fan
     */
    @Post('/:id/refund')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async requestRefund(
        @Param('id') id: string,
        @Body() payload: SpecialRequestRefundPayload,
        @CurrentUser() requester: UserDto
    ): Promise<DataResponse<SpecialRequestDto>> {
        const result = await this.specialRequestService.requestRefund(
            id,
            payload,
            requester
        );
        return DataResponse.ok(result);
    }

    /**
     * View refund requests (admin)
     */
    @Get('/refunds')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async viewRefundRequests(
        @Query() query: any
    ): Promise<DataResponse<PageableData<SpecialRequestDto>>> {
        const result = await this.specialRequestService.getRefundRequests(
            query
        );
        return DataResponse.ok(result);
    }

    /**
     * Approve or deny refund request (admin)
     */
    @Put('/:id/refund/:action(approve|deny)')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async processRefundRequest(
        @Param('id') id: string,
        @Param('action') action: 'approve' | 'deny'
    ): Promise<DataResponse<SpecialRequestDto>> {
        const result = await this.specialRequestService.processRefundRequest(
            id,
            action
        );
        return DataResponse.ok(result);
    }

    @Put('/:id/review/update')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async updateReview(
        @Param('id') reviewId: string,
        @Body() payload: ReviewCreatePayload
    ): Promise<DataResponse<any>> {
        const result = await this.specialRequestReviewService.updateReview(
            reviewId,
            payload
        );
        return DataResponse.ok(result);
    }

    /**
     * Admin search for all special requests
     */
    @Get('/admin/search')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async adminSearch(
        @Query() req: SpecialRequestSearchRequest
    ): Promise<DataResponse<PageableData<SpecialRequestDto>>> {
        const data = await this.specialRequestSearchService.adminSearch(req);
        return DataResponse.ok(data);
    }

    /**
     * Creator search for their own special requests
     */
    @Get('/creator/search')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Roles('creator')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async creatorSearch(
        @Query() req: SpecialRequestSearchRequest,
        @CurrentUser() user: UserDto
    ): Promise<DataResponse<PageableData<SpecialRequestDto>>> {
        const data = await this.specialRequestSearchService.creatorSearch(
            req,
            user
        );
        return DataResponse.ok(data);
    }

    /**
     * Get details of a single special request
     */
    // @Get("/:id")
    // @HttpCode(HttpStatus.OK)
    // @UseGuards(AuthGuard)
    // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    // async getRequest(
    //   @Param("id") id: string,
    //   @CurrentUser() user: UserDto
    // ): Promise<DataResponse<SpecialRequestDto>> {
    //   const request = await this.specialRequestService.findById(id);
    //   // Authorization check for the request
    //   if (
    //     `${request.fanID}` !== `${user._id}` &&
    //     `${request.creatorID}` !== `${user._id}` &&
    //     !user.roles.includes("admin")
    //   ) {
    //     throw new Error("Unauthorized access to this request");
    //   }
    //   return DataResponse.ok(request);
    // }

    /**
     * Get details of a review for a special request
     */
    @Get('/:id/review')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async getReview(
        @Param('id') id: string,
        @CurrentUser() user: UserDto
    ): Promise<DataResponse<SpecialRequestReviewDto>> {
        const review =
            await this.specialRequestReviewService.findReviewByRequestId(id);
        if (
            `${review.reviewerID}` !== `${user._id}` &&
            !user.roles.includes('admin')
        ) {
            throw new Error('Unauthorized access to this review');
        }
        return DataResponse.ok(review);
    }

    @Put('/:id/review')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async createReview(
        @Param('id') requestId: string,
        @Body() payload: ReviewCreatePayload
    ): Promise<DataResponse<any>> {
        const result = await this.specialRequestReviewService.submitReview(
            requestId,
            payload
        );
        return DataResponse.ok(result);
    }
  
    @Post('/addSpeciealRequestPage')
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

    @Patch('/updateSpeciealRequestPage')
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

    @Post('/publishSpeciealRequestPage')
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
    @Post('/uploadSpecialRequestTeaser')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UseInterceptors(
      FileUploadInterceptor('special-request-teaser-video', 'teaser-video', {
        destination: getConfig('file').videoDir,
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

    @Get('/getSpecialRequestPage')
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
